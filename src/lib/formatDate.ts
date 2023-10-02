export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions,
): string => {
  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString('ru-RU', options);
};
