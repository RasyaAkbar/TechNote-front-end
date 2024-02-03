import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const userAdapter = createEntityAdapter({})

const initialstate = userAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            keepUnusedDataFor: 10,
            transformResponse: responseData => {
                const loadedUser = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return userAdapter.setAll(initialstate, loadedUser)
            },
            providesTags: (result, error, arg)=>{
                if(result?.ids){
                    return[{ type: 'User', id: 'LIST'}, ...result.ids.map(id => ({ type: 'User', id}))]
                } else {
                    return [{ type: 'User', id: 'LIST'}]
                }
            }
        }),
        addNewUser: builder.mutation ({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST'}
            ]
        }),
        updateUser: builder.mutation ({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                ({ type: 'User', id: arg.id})
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: ({ id })
            }),
            invalidatesTags: (result, error, arg) => [
                ({ type: 'User', id: arg.id})
            ]
        }),
    }),
})

export const { 
    useGetUsersQuery,
    useAddNewUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation
} = userApiSlice

export const selectUsersResult = userApiSlice.endpoints.getUsers.select()

const selectUserData = createSelector(selectUsersResult, userResult => userResult.data)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = userAdapter.getSelectors(state => selectUserData(state)??initialstate)