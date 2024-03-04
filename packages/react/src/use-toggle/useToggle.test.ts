import { describe, expect, it } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'

import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('should default value work (1)', () => {
    const { result } = renderHook(() => useToggle())

    expect(result.current[0]).toBe(false)
  })

  it('should default value work (2)', () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current[0]).toBe(true)
  })

  it('should update state from false to true when toggle is called', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should update state from true to false when toggle is called', () => {
    const { result } = renderHook(() => useToggle(true))

    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(false)
  })
})
