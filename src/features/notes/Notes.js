import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNotesById, useGetNotesQuery } from "./noteApiSlice";
import { memo } from "react";

const Notes = ({ noteId }) => {
    const navigate = useNavigate()
    
    const { note } = useGetNotesQuery('notesList', {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        })
    })

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long'})
        const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long'})

        const handleEdit = () => navigate(`/dash/notes/${noteId}`)
        if (note){
            return (
                <tr className="table__row">
                    <td className="table__cell note__status">
                        {
                        note.completed?
                        <span className='note__status--completed'>Completed</span> :
                        <span className='note__status--open'>Open</span>
                        }
                    </td>
                    <td className='table__cell note__created'>{created}</td>
                    <td className='table__cell note__updated'>{updated}</td>
                    <td className='table__cell note__title'>{note.title}<br/>{note.text}</td>
                    <td className='table__cell note__username'>{note.username}</td>
                    <td className='table_cell'>
                        <button 
                            className='icon-button table__button'
                            onClick = {handleEdit}
                        >
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </button>
                    </td>
                </tr>
            )
        } else return <p>No notes available...</p>
    }
}

const memoizedNote = memo(Notes)
export default memoizedNote