import { all, call, put, takeLatest } from 'redux-saga/effects'
import type { AxiosResponse } from 'axios'
import axiosInstance from '@/lib/axios'
import {
  loadHomePageRequest,
  setSectionLoading,
  fetchSectionSuccess,
  fetchSectionFailed,
} from '../slices/home.slice'
import type { HomeSection } from '../slices/home.slice'
import type { Event } from '@/types/event.types'

interface FetchSectionParams {
  section: HomeSection
  tag?: string
  category?: string
  limit: number
  ignoreIds?: string[]
}

function buildUrl(params: Omit<FetchSectionParams, 'section'>): string {
  const qs = new URLSearchParams()
  qs.append('limit', String(params.limit))
  if (params.tag) qs.append('tag', params.tag)
  if (params.category) qs.append('category', params.category)
  if (params.ignoreIds) params.ignoreIds.forEach(id => qs.append('ignoreIds', id))
  return `/events?${qs.toString()}`
}

function* fetchSection(params: FetchSectionParams) {
  yield put(setSectionLoading({ section: params.section }))
  try {
    const response = (yield call(() =>
      axiosInstance.get(buildUrl(params))
    )) as AxiosResponse
    const data: Event[] = response.data.data?.data ?? response.data.data ?? []
    yield put(fetchSectionSuccess({ section: params.section, data }))
    return data
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(
      fetchSectionFailed({
        section: params.section,
        error: error.response?.data?.message ?? 'Failed to load',
      })
    )
    return []
  }
}

function* loadHomePageWorker() {
  // Sequential tagged sections — accumulate ignoreIds to avoid duplicates
  const featuredData: Event[] = yield* fetchSection({ section: 'featured', tag: 'featured', limit: 6 })
  const featuredIds = featuredData.map(e => e.id)

  const specialData: Event[] = yield* fetchSection({
    section: 'special',
    tag: 'special',
    limit: 12,
    ignoreIds: featuredIds,
  })
  const specialIds = specialData.map(e => e.id)

  const trendingData: Event[] = yield* fetchSection({
    section: 'trending',
    tag: 'trending',
    limit: 4,
    ignoreIds: [...featuredIds, ...specialIds],
  })
  const trendingIds = trendingData.map(e => e.id)

  yield* fetchSection({
    section: 'newEvents',
    tag: 'new',
    limit: 8,
    ignoreIds: [...featuredIds, ...specialIds, ...trendingIds],
  })

  // Category sections (null tag) — fetched in parallel
  yield all([
    call(fetchSection, { section: 'music', category: 'music', limit: 8 }),
    call(fetchSection, { section: 'theatre', category: 'theatre', limit: 8 }),
    call(fetchSection, { section: 'festival', category: 'festival', limit: 8 }),
    call(fetchSection, { section: 'conference', category: 'conference', limit: 8 }),
    call(fetchSection, { section: 'sports', category: 'sports', limit: 8 }),
  ])
}

export function* homeWatcher() {
  yield takeLatest(loadHomePageRequest.type, loadHomePageWorker)
}
