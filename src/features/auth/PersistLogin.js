import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import usePersist from "../../hooks/usePersist"
import { selectCurrentToken } from "./authSlice"
import { useRefreshMutation } from "./authApiSlice"

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken)
    const [persist] = usePersist()
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(true)

    const [refresh, {
        isUninitialized,
        isSuccess,
        isLoading,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if(effectRan.current === true || process.env.NODE_ENV !== "development"){//React 18 strictmode
            const verifyRefreshToken = async () => {
                try {
                    await refresh()
                    setTrueSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }
            if(!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true
    },[])

    let content
    if(!persist){ //persist: no
        console.log('no persist')
        content = <Outlet/>
    }else if (isLoading){ //persist: yes, token: no
        content = <p>Loading...</p>
    }else if(isError){ //persist: yes, token: no
        content = (
            <p className='errmsg'>
                {error?.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    }else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log("success")
        content = <Outlet/>
    }else if(token && isUninitialized){ //persist: yes, token: yes
        refresh()
        console.log('token and Uninitialized')
        console.log(isUninitialized)
        content = <Outlet/>
    }
    return content
}

export default PersistLogin