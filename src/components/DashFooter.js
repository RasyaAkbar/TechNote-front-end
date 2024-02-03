import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const DashFooter = () => {

    const { username, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClick = () => navigate("/dash")

    let  homeButton = null
    if(pathname !== '/dash'){
        homeButton = (
            <button
                className="dash-footer__button icon-button"
                title="home"
                onClick={onGoHomeClick}
            >
                <FontAwesomeIcon icon={faHouse}/>
            </button>
        )
    } 
    const content = (
        <footer className="dash-footer">
            {homeButton}
            <p>Current user: {username}</p>
            <p>Status: {status}</p>
        </footer>
    )
    return content
}

export default DashFooter