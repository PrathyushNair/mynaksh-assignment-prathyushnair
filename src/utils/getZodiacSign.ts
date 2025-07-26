import { zodiac } from "../dataStore";

function parseDateFromString(date: string) {
  const [day, month, year] = date.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
export function getZodiacSign(birthDate: string) {
  const date = parseDateFromString(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const zodiacSign = zodiac.filter((el) => {
    return (
      (el.from[0] == month && day >= el.from[1]) ||
      (el.to[0] == month && day <= el.to[1])
    );
  });
  return zodiacSign[0].sign;
}
