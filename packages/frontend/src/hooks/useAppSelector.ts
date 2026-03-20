import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '../stores/rootReducer'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
