import axiosInstance from "@/lib/axios";
import { fetchCategoryFailed, fetchCategoryRequest, fetchCategorySuccess } from "../slices/category.slice";
import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";

function* fetchCategoryWorker() {
    try {
        const response = (yield call(
      () => axiosInstance.get(`/categories`)
    )) as AxiosResponse

    yield put(fetchCategorySuccess(response.data.data))
    } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        yield put(fetchCategoryFailed(error.response?.data?.message ?? 'Failed'))
    }
}

export function* catetgoriesWatcher() {
  yield takeLatest(fetchCategoryRequest.type, fetchCategoryWorker)

}