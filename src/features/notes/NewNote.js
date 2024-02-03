import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";
import { useGetUsersQuery } from "../users/userApiSlice";
import useTitle from "../../hooks/useTitle"

const NewNote = () => {
    useTitle("New note form")
    //const users = useSelector(selectAllUsers)
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(userId => data?.entities[userId])
        })
    })

    if(!users?.length) return <p>No users available</p>
    const content = users? <NewNoteForm users={users}/> : <p>Loading...</p>
    return content
}

export default NewNote