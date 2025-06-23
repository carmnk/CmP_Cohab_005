import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/** Definitions and Types  */
/** ********************** */

/** HTTP Query method + 2 custom Response types with File (response=blob) */
export enum QUERY_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  GET_FILE = 'GET_FILE', // GET with responseType: 'blob'
  POST_GET_FILE = 'POST_GET_FILE', // POST with responseType: 'blob'
}

/** initial timeouts per method */
enum QUERY_TIMEOUT {
  POST = 1000 * 60 * 2,
  POST_GET_FILE = 1000 * 60 * 5,
  GET = 1000 * 60 * 2,
  GET_FILE = 1000 * 60 * 5,
  PUT = 1000 * 60 * 2,
  DELETE = 1000 * 60 * 2,
}

/** Unknown Query Payload */
export type UnknownQueryPayloadType = Record<string, unknown>

/** AxiosConfig with some minor adjustments */
export type QueryConfigType = Omit<
  AxiosRequestConfig,
  'data' | 'url' | 'method'
> & {
  disableRedirectToLogin?: boolean
}

export type QueryParamType<PayloadType> = QueryConfigType & {
  url: string
  payload?: PayloadType
}

/** The type of the query functions */
export type QueryFnType<
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown
> = (
  params: QueryParamType<PayloadType>
) => Promise<AxiosResponse<ResponseType>>

export type QueryResponseType<ResponseType = unknown> = {
  data: ResponseType | null
  status: number | string
  statusText: string
  headers: Record<string, string>
  error?: unknown
}

/** utilities for queries */
/** ******************* */

/** Get the content-type header for the payload based on payload (FormData -> multipart/form-data)*/
const getContentHeader = (payload: unknown) => {
  const contentType =
    payload && payload instanceof FormData
      ? 'multipart/form-data'
      : 'application/json'
  const contentHeader = { 'Content-Type': contentType }
  return contentHeader
}

/** utility to merge external and default headers */
const getHeaders = (
  payload: unknown,
  queryHeaders?: AxiosRequestConfig['headers']
) => {
  return {
    ...getContentHeader(payload),
    ...(queryHeaders ?? {}),
  }
}

/** utility to prepare the axios config object for the queries (all methods) */
const makeAxiosQueryConfig = <PayloadType>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
) => {
  // const
  const { url, headers: queryHeaders, payload, ...queryConfig } = params
  const headers: AxiosRequestConfig['headers'] = getHeaders(
    payload,
    queryHeaders
  )
  const responseTypeInjection =
    method === QUERY_METHOD.GET_FILE || method === QUERY_METHOD.POST_GET_FILE
      ? { responseType: 'blob' as const }
      : {}

  const methodLower = method.toLowerCase()
  const methodAdj = methodLower.includes('post')
    ? 'post'
    : methodLower.includes('get')
    ? 'get'
    : methodLower.includes('put')
    ? 'put'
    : methodLower.includes('delete')
    ? 'delete'
    : 'get'

  const axiosQueryConfig: AxiosRequestConfig = {
    timeout: QUERY_TIMEOUT[method],
    ...queryConfig,
    data: payload,
    method: methodAdj,
    headers,
    url,
    ...responseTypeInjection,
  }
  return axiosQueryConfig
}

/** the raw query for all methods */
const genericMethodQuery = async <
  PayloadType = UnknownQueryPayloadType,
  ResponseType = unknown
>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
): ReturnType<QueryFnType<PayloadType, ResponseType>> => {
  const axiosQueryConfig = makeAxiosQueryConfig(method, params)
  return axios(axiosQueryConfig)
}

/** the query for all methods */
export const query = async <PayloadType = unknown, ResponseType = unknown>(
  method: QUERY_METHOD,
  params: QueryParamType<PayloadType>
): Promise<QueryResponseType<ResponseType>> => {
  try {
    const res = await genericMethodQuery<PayloadType, ResponseType>(
      method,
      params
    )
    const response = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res?.headers as Record<string, string>,
    }
    return response
  } catch (e) {
    const error: AxiosError<ResponseType | null> =
      e as AxiosError<ResponseType | null>
    const axiosResponse: AxiosError['response'] | null =
      (axios.isAxiosError(e) ? error?.response : error?.response) ?? null
    const altErrorCode =
      (typeof e === 'object' && !!e && 'code' in e && (e?.code as string)) ||
      null
    const altMessage =
      (typeof e === 'object' &&
        !!e &&
        'message' in e &&
        (e?.message as string)) ||
      null
    const response = {
      data: error?.response?.data ?? null,
      error: e,
      status: axiosResponse?.status ?? altErrorCode ?? 'unknown',
      statusText: axiosResponse?.statusText ?? altMessage ?? 'unknown',
      headers: (axiosResponse?.headers as Record<string, string>) ?? {},
    }
    return response
  }
}
