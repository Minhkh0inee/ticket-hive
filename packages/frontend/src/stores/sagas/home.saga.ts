import { all, call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";
import {
  loadHomePageRequest,
  setSectionLoading,
  fetchSectionSuccess,
  fetchSectionFailed,
} from "../slices/home.slice";
import type { HomeSection } from "../slices/home.slice";
import type { Event } from "@/types/event.types";

function* fetchTagSection(section: HomeSection, tag: string, limit: number) {
  yield put(setSectionLoading({ section }));
  try {
    const response = (yield call(() =>
      axiosInstance.get(`/events/${tag}?limit=${limit}`),
    )) as AxiosResponse;
    const data: Event[] = response.data.data ?? [];
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
    call(fetchTagSection, "featured", "featured", 6),
    call(fetchTagSection, "special", "special", 12),
    call(fetchTagSection, "trending", "trending", 4),
    call(fetchTagSection, "newEvents", "new", 8),

    call(fetchCategorySection, "music", "am-nhac", 8),
    call(fetchCategorySection, "theatre", "kich", 8),
    call(fetchCategorySection, "festival", "le-hoi", 8),
    call(fetchCategorySection, "conference", "hoi-nghi", 8),
    call(fetchCategorySection, "sports", "the-thao", 8),
  ]);
}

export function* homeWatcher() {
  yield takeLatest(loadHomePageRequest.type, loadHomePageWorker);
}
