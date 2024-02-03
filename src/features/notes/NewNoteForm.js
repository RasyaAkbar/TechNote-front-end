import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./noteApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";




const NewNoteForm = ({ users }) => {
  
    const [
        addNewNote,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ] = useAddNewNoteMutation()

    const navigate = useNavigate()

    const [userId, setUserId] = useState([])

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    
    useEffect(()=>{
        if(isSuccess){
            setUserId([])
            setTitle('')
            setText('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])


    const onUserIdChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setUserId(values)
    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    

    const options = users.map(user => {
        return (
            <option
                key = {user.id}
                value = {user.id}
            >
                {user.username}
            </option>
        )
    })
    const canSave = [text, title, userId.length].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()
        if(canSave){
            await addNewNote({ users: userId, title, text})
        }
    }

    const errClass = isError? 'errmsg': 'offscreen'
    const validTitleClass = !title? 'form__input--incomplete': ''
    const validTextClass = text ? '': 'form__input--incomplete'

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveNoteClicked}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                

                <label className="form__label" htmlFor="title">
                    Title: <span className="nowrap"></span></label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="password"
                    name="password"
                    type="text"
                    value={title}
                    onChange={onTitleChanged}
                />
                
                <label className="form__label" htmlFor="title">
                    Text: <span className="nowrap"></span></label>
                <input
                    className={`form__input ${validTextClass}`}
                    id="password"
                    name="password"
                    type="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    multiple={true}
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )
    return content
}

export default NewNoteForm