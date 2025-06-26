import { REGEX } from "@/lib/constants/quality-matrix.constants"

export class ValidationUtils {
  static isValidPositiveDecimal(value: string): boolean {
    return REGEX.DECIMAL.test(value) || value === ""
  }

  static isValidSignedDecimal(value: string): boolean {
    return REGEX.SIGNED_DECIMAL.test(value) || value === "" || value === "-"
  }

  static parseNumberSafely(value: string, fallback = 0): number {
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }

  static clampNumber(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }
}
