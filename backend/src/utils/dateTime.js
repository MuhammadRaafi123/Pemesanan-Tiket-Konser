    export const formatToWIB = (date) => {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }
  ).format(new Date(date));
};