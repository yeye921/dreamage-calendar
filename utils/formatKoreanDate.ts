import { WEEK_LABELS } from "@/constants/date";

export default function formatKoreanDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const dateObj = new Date(dateStr);
  const weekday = WEEK_LABELS[dateObj.getDay()];
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(
    day,
    10
  )}일 (${weekday})`;
}
