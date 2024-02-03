import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState })=>{
        const token = getState().auth.token
        if(token){
            // setting the header with the token
            headers.set("authorization", `Bearer ${token}`)
            console.log("headers set")
        }
        return headers
    }
})

const baseQueryWithReauth = async (arg, api, extraOptions) => {
    //try from the base query
    let result = await baseQuery(arg, api, extraOptions)

    //if no token
    if(result?.error?.status === 403){
        console.log("sending refresh token")
        
        //get the token from auth/refresh
        let refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        
        //refresh token should issue access token unless it has expired
        if(refreshResult?.data){
            api.dispatch(setCredentials({...refreshResult.data}))
        
            //retry with refresh token
            result = await baseQuery(arg, api, extraOptions)
        } else {
            if(refreshResult?.error?.status === 403){
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }
    //return result if access token has been issued
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})