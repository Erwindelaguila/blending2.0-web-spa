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

  /**
   * Sanitiza entrada mientras el usuario escribe (modo edición).
   * Reglas solicitadas:
   * - Enteros: hasta 5 dígitos (ej: 12345)
   * - Decimales: hasta 4 dígitos parte entera + hasta 3 decimales (ej: 1234.000)
   * - Se permite teclear inicialmente '.' (se interpreta luego como 0.xxx)
   * - No se fuerzan ceros a la derecha hasta el blur (finalize).
   */
  static validateAndFormatNumber(value: string, finalize = false): string {
    if (value === '') return '';

    // Normalizar: quitar caracteres no numéricos salvo . y ,
    let cleaned = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');

    // Si empieza con '.' -> permitir y tratar como '0.' en modo finalize, en edición dejar '.'
    if (cleaned === '.') {
      return finalize ? '0.000' : '.';
    }

    // Mantener solo la primera ocurrencia de '.'
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
      // Eliminar puntos extra
      const before = cleaned.slice(0, firstDot + 1);
      const after = cleaned.slice(firstDot + 1).replace(/\./g, '');
      cleaned = before + after;
    }

    const hasDecimal = cleaned.includes('.');
    let [intPart, decPart = ''] = cleaned.split('.');

    // Limitar longitudes según reglas
    if (hasDecimal) {
      // Parte entera máxima 4 dígitos si hay decimales
      if (intPart.length > 4) intPart = intPart.slice(0, 4);
      if (decPart.length > 3) decPart = decPart.slice(0, 3);
    } else {
      // Entero puro máximo 5 dígitos
      if (intPart.length > 5) intPart = intPart.slice(0, 5);
    }

    // Evitar intPart vacío cuando usuario escribió solo '.' (ya manejado antes) o '.' seguido de decimales
    if (intPart === '' && hasDecimal) intPart = '0';

    if (!hasDecimal) {
      return intPart;
    }

    // Modo finalize: rellenar decimales a 3
    if (finalize) {
      decPart = (decPart + '000').slice(0, 3);
    }

    return decPart === '' ? `${intPart}.` : `${intPart}.${decPart}`;
  }

  /**
   * Valida formato FINAL (post blur / para enviar):
   * - Entero: 1-5 dígitos
   * - Decimal: 1-4 dígitos enteros + 3 decimales exactos
   */
  static isValidNumberFormat(value: string): boolean {
    if (!value) return true;
    // Permitimos estado intermedio de edición: '1234.' o '.'
    if (value === '.' || /^(\d{1,4})\.$/.test(value)) return true;
    const intRegex = /^\d{1,5}$/; // entero puro
    const decRegexLoose = /^\d{1,4}\.\d{1,3}$/; // durante edición (1-3 dec)
    const decRegexFinal = /^\d{1,4}\.\d{3}$/; // final (exactamente 3)
    return intRegex.test(value) || decRegexLoose.test(value) || decRegexFinal.test(value);
  }

  /** Aplica formateo final (blur): rellena decimales a 3 si existen o si termina en punto. */
  static finalizeNumber(value: string): string {
    if (value === '' || value === '.') return '';
    if (!value.includes('.')) return value; // entero
    const [i, d = ''] = value.split('.');
    if (i === '') return '';
    const padded = (d + '000').slice(0, 3);
    return `${i}.${padded}`;
  }

  /**
   * Handler para inputs de números que previene caracteres no válidos
   */
  static handleNumberInput(e: React.KeyboardEvent<HTMLInputElement>): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    // Permitir teclas de control
    if (allowedKeys.includes(e.key)) return;
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return;
    
    // Solo permitir números y un punto decimal
    if (!/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const input = e.currentTarget;
    const currentValue = input.value;
    const selectionStart = input.selectionStart ?? currentValue.length;
    const selectionEnd = input.selectionEnd ?? currentValue.length;
    const newValue = currentValue.slice(0, selectionStart) + e.key + currentValue.slice(selectionEnd);

    // Validación incremental custom
    if (newValue === '.' ) return; // permitir inicio con '.'
    const hasDot = newValue.includes('.');
    if (hasDot) {
      const [intP, decP = ''] = newValue.split('.');
      // parte entera <=4 y decimales <=3
      if (intP.length > 4 || decP.length > 3) e.preventDefault();
    } else {
      // entero puro <=5
      if (newValue.length > 5) e.preventDefault();
    }
  }
}
