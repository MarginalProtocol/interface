import _ from "lodash"
import { useMemo, useEffect } from "react"
import { useLazyGetPositionQuery } from "../services/subgraph/generated"

export const usePositionQuery = (positionKey: string | undefined) => {
  const [fetchPosition, fetchedPosition] = useLazyGetPositionQuery()

  useEffect(() => {
    if (positionKey) {
      fetchPosition({ id: positionKey })
    }
  }, [positionKey])

  return useMemo(
    () => ({
      positionQueryData: fetchedPosition?.data?.position,
    }),
    [fetchedPosition?.data?.position],
  )
}
