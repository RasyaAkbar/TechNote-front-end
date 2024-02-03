import { apiSlice } from "../../app/api/apiSlice";
import { logout,  setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints ({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }){
                try {
                    await queryFulfilled
                    //after clean up on the backend, initiate cleanup on frontend
                    dispatch(logout())
                    console.log("logging out")
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted (arg, { dispatch, queryFulfilled}){
                try{
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice