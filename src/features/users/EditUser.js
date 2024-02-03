import { useSelector } from "react-redux"
import EditUserForm from "./EditUserForm"
import { useParams } from "react-router-dom"
import { selectUserById } from "./userApiSlice"
import { useGetUsersQuery } from "../users/userApiSlice"
import useTitle from "../../hooks/useTitle"


const EditUser = () => {
    const { id } = useParams()

    useTitle("Edit user form")
    
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    })
    //const user = useSelector(state => selectUserById(state, id))
    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>
    return content
}

export default EditUser