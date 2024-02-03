import { useState, useEffect } from 'react'
import { useDeleteUserMutation, useUpdateUserMutation } from './userApiSlice'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ROLES } from '../../config/ROLES'
import { ConfirmDialog } from '../../confirmDialog'

const USER_REGEX = /^[A-z ]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/

const EditUserForm = ({ user }) => {

    const navigate = useNavigate()

    const [
        updateUser, {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ] = useUpdateUserMutation()

    const [
        deleteUser, {
            isSuccess: isDelSuccess,
            isError: isDelError,
            error: delError
        }
    ] = useDeleteUserMutation()

    const [username, setUsername] = useState(user.username)
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    
    
    useEffect(()=>{
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(()=>{
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(()=>{
        if(isDelSuccess || isSuccess){
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from (
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }
    const onActiveChanged = () => setActive(!active)

    const onSaveUserClicked = async(e) => {
        if(password){
            await updateUser({ id: user.id, username, roles, active, password})
        } else {
            await updateUser({ id: user.id, username, roles, active})
        }
    }

    const onDeleteUserClicked = async() => {
        const dialog = new ConfirmDialog({
            lang: 'english',
        });
        dialog.show('Deleting user will delete their existing notes').then((result)=>{
            if(result.ok){
                deleteUser({ id: user.id})
            }
        })
        
        
        
    }

    let canSave
    if(password){
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    }else{
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const options = Object.values(ROLES).map(role =>{
        return(
            <option
                key={role}
                value={role}
            >{role}</option>
        )
    })

    const errClass = (isError||isDelError)? 'errmsg': 'offscreen'
    const validUsernameClass = !validUsername? 'form__input--incomplete': ''
    const validPasswordClass = !validPassword? 'form__input--incomplete': ''
    const validRolesClass = Boolean(roles.length) ? '': 'form__input--incomplete'
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUsernameClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPasswordClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}

export default EditUserForm