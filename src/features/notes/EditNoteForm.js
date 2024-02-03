import { useState, useEffect } from 'react'
import { useDeleteNoteMutation, useUpdateNoteMutation } from './noteApiSlice'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAuth from '../../hooks/useAuth'


const EditNoteForm = ({ note, users }) => {
    const { isAdmin, isManager } = useAuth()

    const navigate = useNavigate()

    const [
        updateNote, {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ] = useUpdateNoteMutation()

    const [
        deleteNote, {
            isSuccess: isDelSuccess,
            isError: isDelError,
            error: delError
        }
    ] = useDeleteNoteMutation()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [assignedUsers, setAssignedUsers] = useState([note.user])
    
    useEffect(()=>{
        if(isDelSuccess || isSuccess){
            setAssignedUsers([])
            setTitle('')
            setText('')
            navigate('/dash/notes')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = () => setCompleted(!completed)
    const onAssignedUsersChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setAssignedUsers(values)
    }

    const onSaveNoteClicked = async (e) => {
        await updateNote({ id: note.id, users: assignedUsers, title, text, completed })
    }

    const onDeleteNoteClicked = async() => {
        await deleteNote({ id: note.id})
    }

    const options = users.map(user => {
        return(<option
            key={user.id}
            value={user.id}
        >
            {user.username}
        </option>)
    })


    const errClass = (isError || isDelError)? 'errmsg': 'offscreen'
    const validTitleClass = !title? 'form__input--incomplete': ''
    const validTextClass = text ? '': 'form__input--incomplete'
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const canSave = [assignedUsers.length, title, text].every(Boolean) && !isLoading
    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                            onClick = {onSaveNoteClicked}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {(isAdmin||isManager)?
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteNoteClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>: null
                        }
                    </div>
                </div>


                <label className="form__label" htmlFor="title">
                    Title: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="password"
                    name="password"
                    type="text"
                    value={title}
                    onChange={onTitleChanged}
                />
                
                <label className="form__label" htmlFor="title">
                    Text: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validTextClass}`}
                    id="password"
                    name="password"
                    type="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    Completed:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={completed}
                        onChange={onCompletedChanged}
                    />
                </label>

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    multiple={true}
                    value={assignedUsers}
                    onChange={onAssignedUsersChanged}
                >
                    {options}
                </select>

                <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                </div>

            </form>
        </>
  )
  return content
}

export default EditNoteForm