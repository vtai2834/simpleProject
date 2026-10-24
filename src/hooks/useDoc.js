import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'

// Hook nền: lắng nghe một document hoặc query, trả { data, loading, error }
export function useSnapshot(refOrQuery, map) {
  const [value, setValue] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    return onSnapshot(
      refOrQuery,
      (snap) => setValue({ data: map(snap), loading: false, error: null }),
      (error) => setValue({ data: null, loading: false, error }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return value
}
