import { create } from 'zustand'

const useGlobalStore = create((set) => ({
    permissions: null,
    setPermissions: (value) => set((state) => ({ permissions: value })),
    marks: [],
    setMarks: (value) => set((state) => ({ marks: value })),
    local:null,
    setLocal:(value) => set((state) => ({local:value}))
}))


export default useGlobalStore;