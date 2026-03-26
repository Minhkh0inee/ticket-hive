import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Event } from '@/types/event.types'

type HomeSection =
  | 'featured'
  | 'special'
  | 'trending'
  | 'newEvents'
  | 'music'
  | 'theatre'
  | 'festival'
  | 'conference'
  | 'sports'

interface SectionState {
  data: Event[]
  loading: boolean
  error: string | null
}

interface HomeState {
  featured: SectionState
  special: SectionState
  trending: SectionState
  newEvents: SectionState
  music: SectionState
  theatre: SectionState
  festival: SectionState
  conference: SectionState
  sports: SectionState
}

const emptySection = (): SectionState => ({ data: [], loading: false, error: null })

const initialState: HomeState = {
  featured: emptySection(),
  special: emptySection(),
  trending: emptySection(),
  newEvents: emptySection(),
  music: emptySection(),
  theatre: emptySection(),
  festival: emptySection(),
  conference: emptySection(),
  sports: emptySection(),
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    loadHomePageRequest(_state) {},
    setSectionLoading(state, action: PayloadAction<{ section: HomeSection }>) {
      state[action.payload.section].loading = true
      state[action.payload.section].error = null
    },
    fetchSectionSuccess(
      state,
      action: PayloadAction<{ section: HomeSection; data: Event[] }>
    ) {
      state[action.payload.section].loading = false
      state[action.payload.section].data = action.payload.data
    },
    fetchSectionFailed(
      state,
      action: PayloadAction<{ section: HomeSection; error: string }>
    ) {
      state[action.payload.section].loading = false
      state[action.payload.section].error = action.payload.error
    },
  },
})

export type { HomeSection }
export const { loadHomePageRequest, setSectionLoading, fetchSectionSuccess, fetchSectionFailed } =
  homeSlice.actions
export default homeSlice.reducer
