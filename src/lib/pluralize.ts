/**
 * Плюрализация слов
 * @example
 * pluralize(12.21, ['рубль', 'рубля', 'рублей']);
 * pluralize(7, ['арбуз', 'арбуза', 'арбузов']);
 * pluralize(-121, ['штука', 'штуки', 'штук']);
 */
export const pluralize = (
  value: number,
  words: [string, string, string],
): string => {
  value = Math.abs(value) % 100;
  const num = value % 10;

  if (value > 10 && value < 20) return words[2];

  if (num > 1 && num < 5) return words[1];

  if (num === 1) return words[0];

  return words[2];
};
