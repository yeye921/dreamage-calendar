export default function formatKoreanTime(timeStr?: string) {
  if (!timeStr) return "";

  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const isPM = hour >= 12;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  const period = isPM ? "오후" : "오전";

  return minute === 0
    ? `${period} ${displayHour}시`
    : `${period} ${displayHour}시 ${minute}분`;
}
