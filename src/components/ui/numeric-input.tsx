"use client";

import { Input } from "@fluentui/react-components";
import { ValidationUtils } from "@/utils/validation-utils";
import React from "react";

interface NumericInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  // Configuración dinámica
  mode?: 'integer' | 'decimal' | 'auto'; // auto = depende de si incluye '.'
  integerMaxDigits?: number;            // para modo integer o auto (cuando no hay punto) - default 5
  decimalIntegerMaxDigits?: number;     // dígitos enteros cuando hay decimales - default 4
  decimalDigits?: number;               // dígitos decimales máximos - default 3
  padOnBlur?: boolean;                  // completar con ceros en blur si hay decimales - default true
  allowLeadingDot?: boolean;            // permitir empezar con '.' - default true
  allowEmpty?: boolean;                 // permitir vacío - default true
  onInvalidKeystroke?: (info: { attempted: string; reason: string }) => void; // hook opcional
}

export function NumericInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  style,
  className,
  mode = 'auto',
  integerMaxDigits = 5,
  decimalIntegerMaxDigits = 4,
  decimalDigits = 3,
  padOnBlur = true,
  allowLeadingDot = true,
  allowEmpty = true,
  onInvalidKeystroke,
}: NumericInputProps) {
  const stringValue = typeof value === 'number' ? value.toString() : value;

  const sanitize = (raw: string, finalize = false): string => {
    if (raw === '') return allowEmpty ? '' : '0';
    let v = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    if (v === '.' && allowLeadingDot) return finalize ? (padOnBlur ? `0.${'0'.repeat(decimalDigits)}` : '0.') : '.';

    const firstDot = v.indexOf('.');
    if (firstDot !== -1) {
      const before = v.slice(0, firstDot + 1);
      const after = v.slice(firstDot + 1).replace(/\./g, '');
      v = before + after;
    }

    const hasDot = v.includes('.');
    let [intPart, decPart = ''] = v.split('.');

    const effectiveMode: 'integer' | 'decimal' = mode === 'auto' ? (hasDot ? 'decimal' : 'integer') : mode;

    if (effectiveMode === 'integer') {
      if (hasDot) {
        intPart = intPart.replace(/\D/g, '');
        if (intPart.length > integerMaxDigits) intPart = intPart.slice(0, integerMaxDigits);
        return intPart;
      }
      if (intPart.length > integerMaxDigits) intPart = intPart.slice(0, integerMaxDigits);
      return intPart;
    }

    if (intPart.length > decimalIntegerMaxDigits) intPart = intPart.slice(0, decimalIntegerMaxDigits);
    if (decPart.length > decimalDigits) decPart = decPart.slice(0, decimalDigits);
    if (!hasDot) return intPart; 

    if (finalize) {
      if (padOnBlur) decPart = (decPart + '0'.repeat(decimalDigits)).slice(0, decimalDigits);
      else if (decPart === '' && !allowLeadingDot) return intPart; // no permitir final sin decimales
    }

    return decPart === '' ? `${intPart}${finalize && padOnBlur ? '.' + '0'.repeat(decimalDigits) : '.'}` : `${intPart}.${decPart}`;
  };

  const handleChange = (data: { value: string }) => {
    const formatted = sanitize(data.value, false);
    onChange(formatted);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const fin = sanitize(e.target.value, true);
    if (fin !== e.target.value) onChange(fin);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedControl = [
      'Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'
    ];
    if (allowedControl.includes(e.key)) return;
    if (e.ctrlKey && ['a','c','v','x','z'].includes(e.key.toLowerCase())) return;
    // Solo dígitos o punto
    if (!/[0-9.]/.test(e.key)) {
      e.preventDefault();
      onInvalidKeystroke?.({ attempted: e.key, reason: 'char-not-allowed' });
      return;
    }
    const el = e.currentTarget;
    const cur = el.value;
    const selStart = el.selectionStart ?? cur.length;
    const selEnd = el.selectionEnd ?? cur.length;
    const next = cur.slice(0, selStart) + e.key + cur.slice(selEnd);
    const test = sanitize(next, false);
    if (test !== next) {
      // Si la diferencia es solo porque se eliminó un segundo punto, dejamos pasar (para experiencia amigable)
      if (!(next.includes('..') && test === next.replace(/\.+/g, '.'))) {
        e.preventDefault();
        onInvalidKeystroke?.({ attempted: e.key, reason: 'exceeds-limits' });
      }
    }
  };

  return (
    <Input
      type="text"
      value={stringValue}
      onChange={(_, data) => handleChange(data)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
      className={className}
      inputMode="decimal"
    />
  );
}
