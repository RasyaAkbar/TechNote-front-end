import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
    faRightFromBracket,
    faFilePen,
    faUserGear,
    faUserPlus,
    faFileCirclePlus
} from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { apiSlice } from "../app/api/apiSlice"
import usePersist from "../hooks/usePersist"
import useAuth from "../hooks/useAuth"


const DashHeader = () => {

    const DASH_REGEX = /^\/dash(\/)?$/
    const NOTES_REGEX = /^\/dash\/notes(\/)?$/
    const USERS_REGEX = /^\/dash\/users(\/)?$/

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAdmin, isManager } = useAuth()


    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')

    const [ sendLogout, 
        {
        isLoading,
        isSuccess,
        isError,
        error,
        }
    ] = useSendLogoutMutation()

    const [persist, setPersist] = usePersist()

    useEffect (() => {
        if(isSuccess) {
            setTimeout(() => {
                console.log("cache cleared")
                dispatch(apiSlice.util.resetApiState())
            }, 1000) //making sure the cache is cleared by set timeout
            navigate('/')
        }
    }, [isSuccess, navigate])

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }


    if(isError){
        console.error(error.data?.message)
        return <p>Error: {error.data?.message}</p>
    } 

    const logoutButton = (
        <button
            className="icon-button"
            title="logout"
            onClick={()=>{
                setPersist(false)
                sendLogout();
            }}
        ><FontAwesomeIcon icon={faRightFromBracket}/></button>
    )

    let newUserButton = null
    if(USERS_REGEX.test(pathname)){
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let newNoteButton = null
    if(NOTES_REGEX.test(pathname)){
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let notesButton = null
    if(!NOTES_REGEX.test(pathname) && pathname.includes('/dash')){
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    let usersButton = null
    if(isAdmin || isManager){
        if(!USERS_REGEX.test(pathname) && pathname.includes('/dash')){
            usersButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    const navButton = (
        <>
        {usersButton}
        {notesButton}
        {newNoteButton}
        {newUserButton}
        {logoutButton}
        </>
    )


    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to='/dash'>
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {(isLoading)?<p>logging out...</p>: navButton}
                </nav>
            </div>
        </header>
    )
    return content
}

export default DashHeader