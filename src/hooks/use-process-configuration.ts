"use client"

import { useState } from "react"
import { LIMITS } from "@/lib/constants/quality-matrix.constants"
import { ValidationUtils } from "@/utils/validation-utils"

export const useProcessConfiguration = () => {
  const [numeroRumas, setNumeroRumas] = useState<number>(LIMITS.MIN_RUMAS)
  const [divisionRumas, setDivisionRumas] = useState<number>(LIMITS.MAX_DIVISION)

  const incrementRumas = () => setNumeroRumas((prev) => prev + 1)
  const decrementRumas = () => setNumeroRumas((prev) => Math.max(LIMITS.MIN_RUMAS, prev - 1))
  const incrementDivision = () => setDivisionRumas((prev) => Math.min(LIMITS.MAX_DIVISION, prev + 1))
  const decrementDivision = () => setDivisionRumas((prev) => Math.max(LIMITS.MIN_DIVISION, prev - 1))

  const updateRumasFromInput = (value: string) => {
    const numValue = Number.parseInt(value) || LIMITS.MIN_RUMAS
    if (numValue >= LIMITS.MIN_RUMAS) setNumeroRumas(numValue)
  }

  const updateDivisionFromInput = (value: string) => {
    const numValue = Number.parseInt(value) || LIMITS.MIN_DIVISION
    const clampedValue = ValidationUtils.clampNumber(numValue, LIMITS.MIN_DIVISION, LIMITS.MAX_DIVISION)
    setDivisionRumas(clampedValue)
  }

  return {
    numeroRumas,
    divisionRumas,
    incrementRumas,
    decrementRumas,
    incrementDivision,
    decrementDivision,
    updateRumasFromInput,
    updateDivisionFromInput,
  }
}
