export function obtenerAnioActual(): number {
  return new Date().getFullYear();
}
export const onFormatDate = (date?: Date): string => {
  return !date
    ? ""
    : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};