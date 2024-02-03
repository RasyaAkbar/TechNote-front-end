import { Outlet } from "react-router-dom";
import { noteApiSlice } from "../notes/noteApiSlice";
import { userApiSlice } from "../users/userApiSlice";
import { useEffect } from 'react'
import { store } from "../../app/store";



const Prefetch = () => {
    useEffect (()=>{
        //avoid uneccessary re-render when we have the data
        store.dispatch(noteApiSlice.util.prefetch('getNotes', 'notesList', { force: true })) 
        store.dispatch(userApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        //it will re-fetch based on designed interval in notes and users list

        /*
        console.log("subscribing")
        const user = store.dispatch(userApiSlice.endpoints.getUsers.initiate())
        const note = store.dispatch(noteApiSlice.endpoints.getNotes.initiate())

        return () =>{
            console.log("unsubscribing")
            user.unsubscribe()
            note.unsubscribe()
        }
        */
    }, [])
    return <Outlet/>
}

export default Prefetch