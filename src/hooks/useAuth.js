import { jwtDecode } from "jwt-decode"
import { selectCurrentToken } from "../features/auth/authSlice"
import { useSelector } from "react-redux"

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let isManager = false
    let status = "Employee"

    if(token){
        const decode = jwtDecode(token)
        const { username, roles } = decode.UserInfo

        isManager = roles.includes("Manager")
        isAdmin = roles.includes("Admin")

        if(isManager) status = "Manager"
        if(isAdmin) status = "Admin"

        return { username, roles, status, isManager, isAdmin }
    }

    return { username: '', roles: [], status, isManager, isAdmin}
}

export default useAuth