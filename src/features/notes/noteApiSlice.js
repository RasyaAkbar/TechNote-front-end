import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1: -1
})

const initialstate = notesAdapter.getInitialState()

export const noteApiSlice = apiSlice.injectEndpoints({
    endpoints:builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => {
                const loadedNotes = responseData.map(note =>{
                    note.id = note._id
                    return note
                })
                return notesAdapter.setAll(initialstate, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                //setting tags for cache purpose
                if(result?.ids){
                    return [{ type: 'Note', id: 'LIST' }, ...result.ids.map(id => ({ type: 'Note', id}))]
                } else {
                    return [{ type: 'Note', id: 'LIST'}]
                }
            }
        }),
        addNewNote: builder.mutation ({
            query: initialNoteData => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNoteData
                }
            }),
            //invalidate cache (tags) when new component added
            invalidatesTags: [
                { type: 'Note', id: 'LIST'}
            ]
        }),
        updateNote: builder.mutation ({
            query: initialNoteData => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNoteData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                ({ type: 'Note', id: arg.id})
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/notes',
                method: 'DELETE',
                body: ({ id })
            }),
            invalidatesTags: (result, error, arg) => [
                ({ type: 'Note', id: arg.id})
            ]
        }),
    }),
})

export const { 
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = noteApiSlice

export const selectNotesResult = noteApiSlice.endpoints.getNotes.select()

const selectNotesData = createSelector(selectNotesResult, notesData => notesData.data) 

export const {
    selectAll: selectAllNotes,
    selectById: selectNotesById,
    selectIds: selectNotesIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialstate)