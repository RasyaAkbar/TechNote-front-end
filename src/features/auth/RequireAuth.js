import { Outlet, useLocation, Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    console.log(roles.length)
    const content = 
        (roles.length === 0||roles.some(role => allowedRoles.includes(role) )? 
                <Outlet/>: <Navigate to='/login' state={{ from: location }} replace /> //replace is to not include the route in their browser history
        )

    

    return content
}

export default RequireAuth