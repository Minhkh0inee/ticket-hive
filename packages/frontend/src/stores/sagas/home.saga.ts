import { all, call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";
import {
  loadHomePageRequest,
  setSectionLoading,
  fetchSectionSuccess,
  fetchSectionFailed,
  setHomepageLoading,
  setHomepageData,
  setHomepageFailed,
} from "../slices/home.slice";
import type { HomeSection } from "../slices/home.slice";
import type { Event } from "@/types/event.types";

function* fetchHomepageBatch() {
  yield put(setHomepageLoading())
  try {
    const response = (yield call(() =>
      axiosInstance.get('/events/home-page')
    )) as AxiosResponse
    yield put(setHomepageData(response.data.data ?? []))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(setHomepageFailed(error.response?.data?.message ?? 'Failed to load'))
  }
}

function* fetchCategorySection(
  section: HomeSection,
  category: string,
  limit: number,
) {
  yield put(setSectionLoading({ section }));
  try {
    const response = (yield call(() =>
      axiosInstance.get(`/events?category=${category}&limit=${limit}`),
    )) as AxiosResponse;
    const data: Event[] = response.data.data?.data ?? [];
    yield put(fetchSectionSuccess({ section, data }));
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    yield put(
      fetchSectionFailed({
        section,
        error: error.response?.data?.message ?? "Failed to load",
      }),
    );
  }
}

function* loadHomePageWorker() {
  yield all([
    call(fetchHomepageBatch),
    call(fetchCategorySection, 'music',      'am-nhac',   8),
    call(fetchCategorySection, 'theatre',    'kich',       8),
    call(fetchCategorySection, 'festival',   'le-hoi',     8),
    call(fetchCategorySection, 'conference', 'hoi-nghi',   8),
    call(fetchCategorySection, 'sports',     'the-thao',   8),
  ])
}

export function* homeWatcher() {
  yield takeLatest(loadHomePageRequest.type, loadHomePageWorker);
}
