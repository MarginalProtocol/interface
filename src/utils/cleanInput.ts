export const cleanInput = (value: string): string => {
  return value === ""
    ? ""
    : value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1") ?? ""
}
