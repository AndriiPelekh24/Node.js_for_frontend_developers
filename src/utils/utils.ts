export function isValidDateString(dateStr: string): boolean {

  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!regex.test(dateStr)) {
    return false;
  }

 
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
}
