import { selectNotesById } from "./noteApiSlice"
import { useParams } from "react-router-dom"
import EditNoteForm from "./EditNoteForm"
import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/userApiSlice"
import { useGetNotesQuery } from "./noteApiSlice"
import { useGetUsersQuery } from "../users/userApiSlice"
import useTitle from "../../hooks/useTitle"

const EditNote = () => {
    useTitle("Edit note form")
    const { id } = useParams()
    const { note } = useGetNotesQuery('notesList', {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        })
    })

    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(userId => data?.entities[userId])
        })
    })
    //const note = useSelector(state => selectNotesById(state, id))
    const content = note ? <EditNoteForm note={note} users={users}/> : <p>Loading...</p>
    return content
}

export default EditNote