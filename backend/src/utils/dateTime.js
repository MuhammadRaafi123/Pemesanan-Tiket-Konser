export const formatToWIB = (date) => {
  if (!date) {
    return null;
  }

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null;
    }

    const formatted = new Intl.DateTimeFormat(
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
    ).format(d);

    return `${formatted.replace(" ", "T")}+07:00`;
  } catch {
    return null;
  }
};
