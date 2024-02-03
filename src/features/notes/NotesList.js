import { useGetNotesQuery } from "./noteApiSlice"
import Notes from "./Notes"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
const NotesList = () => {

    useTitle("Notes List")
    let content
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,//set to get fresh data for every 60 sec
        refetchOnFocus: true,//set to get fresh data if the window regain focus
        refetchOnMountOrArgChange: true //set to get fresh data if new subscriber to a query is added
    }) 

    const { username, isAdmin, isManager } = useAuth()

    if(isLoading) content = <p>Loading...</p>
    if(isError) content = <p className='errmsg'>{error?.data?.message}</p>
    if(isSuccess){

        const { ids, entities } = notes

        let filteredIds
        if(isAdmin || isManager){
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username )
        }

        const tableContent = ids?.length? filteredIds.map(noteId => <Notes key={noteId} noteId={noteId}/>) : null

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">Status</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }
    return content
}

export default NotesList