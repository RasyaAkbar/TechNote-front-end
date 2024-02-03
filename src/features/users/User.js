import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { selectUserById } from "./userApiSlice";
import { useGetUsersQuery } from "../users/userApiSlice"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

const User = ({ userId }) => {
    const navigate = useNavigate()

    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })

    if(user){
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const cellStatus = user.active? '': 'table__cell--inactive'

        return(
            <tr className='table__row user'>
                <td className={`table__cell ${cellStatus}`}>User: {user.username} id: {user.id}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button 
                        className="icon-button table__button"
                        onClick = {handleEdit}
                    ><FontAwesomeIcon icon={faPenToSquare}/></button>
                </td>
            </tr>
        )
    }else return null
}

const memoizedUser = memo(User)
export default memoizedUser