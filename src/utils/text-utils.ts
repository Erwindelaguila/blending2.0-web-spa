import { LIMITS } from "@/lib/constants/quality-matrix.constants"

export class TextUtils {
  static shouldTruncateBasedOnSpace(text: string, availableColumns: number): boolean {
    if (availableColumns <= 3) return text.length > 12
    if (availableColumns <= 6) return text.length > 8
    return text.length > LIMITS.PARAM_MAX_LENGTH
  }

  static getTruncatedText(text: string, availableColumns: number): string {
    if (!this.shouldTruncateBasedOnSpace(text, availableColumns)) return text

    // Declarar maxLength como number para evitar problemas de tipos literales
    let maxLength: number = LIMITS.PARAM_MAX_LENGTH
    if (availableColumns <= 3) maxLength = 12
    else if (availableColumns <= 6) maxLength = 8

    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  static truncateCalidad(text: string): string {
    return text.length > LIMITS.CALIDAD_MAX_LENGTH ? `${text.substring(0, LIMITS.CALIDAD_MAX_LENGTH)}...` : text
  }

  static shouldShowTooltipCalidad(text: string): boolean {
    return text.length > LIMITS.CALIDAD_MAX_LENGTH
  }

  static shouldShowTooltip(text: string, maxLength: number = LIMITS.PARAM_MAX_LENGTH): boolean {
    return text.length > maxLength
  }
}
