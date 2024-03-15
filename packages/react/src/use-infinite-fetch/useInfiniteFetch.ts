import { useCallback, useRef, useState } from 'react'

export interface UseInfiniteFetchOptions<TQueryFnData = unknown, TPageParam = unknown> {
  queryFn: ({ pageParam }: { pageParam: TPageParam }) => Promise<TQueryFnData>
  initialPageParam: TPageParam
  getNextPageParam: ({
    pageParam,
    lastPage,
  }: {
    pageParam: TPageParam
    lastPage: TQueryFnData
  }) => TPageParam | undefined
}

export interface UseInfniteFetchBaseResult<TQueryFnData = unknown, TError = unknown> {
  data: { pages: TQueryFnData[] } | undefined
  error: TError | null
  isLoading: boolean
  hasNextPage: boolean
  fetchNextPage: () => Promise<void>
}
export interface UseInfiniteFetchLoadingResult<TQueryFnData = unknown, TError = unknown>
  extends UseInfniteFetchBaseResult<TQueryFnData, TError> {
  data: undefined
  error: null
  isLoading: true
}
export interface UseInfiniteFetchErrorResult<TQueryFnData = unknown, TError = unknown>
  extends UseInfniteFetchBaseResult<TQueryFnData, TError> {
  data: undefined
  error: TError
  isLoading: false
}
export interface UseInfiniteFetchSuccessResult<TQueryFnData = unknown, TError = unknown>
  extends UseInfniteFetchBaseResult<TQueryFnData, TError> {
  data: { pages: TQueryFnData[] }
  error: null
  isLoading: false
}
export type UseInfiniteFetchResult<TQueryFnData = unknown, TError = unknown> =
  | UseInfiniteFetchLoadingResult<TQueryFnData, TError>
  | UseInfiniteFetchErrorResult<TQueryFnData, TError>
  | UseInfiniteFetchSuccessResult<TQueryFnData, TError>

export function useInfiniteFetch<TQueryFnData, TError = unknown, TPageParam = unknown>(
  options: UseInfiniteFetchOptions<TQueryFnData, TPageParam>,
): UseInfiniteFetchResult<TQueryFnData, TError> {
  const { queryFn, initialPageParam, getNextPageParam } = options
  const [data, setData] = useState<{ pages: TQueryFnData[] }>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TError | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const queryFnRef = useRef(queryFn)
  const nextPageParamRef = useRef<TPageParam | undefined>(initialPageParam)
  const getNextPageParamRef = useRef(getNextPageParam)

  const fetchNextPage = useCallback(async () => {
    if (!nextPageParamRef.current) {
      return
    }
    setIsLoading(true)
    try {
      const res = await queryFnRef.current({ pageParam: nextPageParamRef.current })
      nextPageParamRef.current = getNextPageParamRef.current({
        pageParam: nextPageParamRef.current,
        lastPage: res,
      })
      if (!nextPageParamRef.current) {
        setHasNextPage(false)
      }
      const newData = { pages: [res] }
      setData((prev) => (prev ? { ...prev, pages: prev.pages.concat(res) } : newData))
      setError(null)
    } catch (error) {
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { fetchNextPage, data, isLoading, error, hasNextPage } as UseInfiniteFetchResult<
    TQueryFnData,
    TError
  >
}
