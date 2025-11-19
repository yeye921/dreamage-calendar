import { EventType } from "@/atoms/events";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type CalendarGridProps = {
  weeks: (number | null)[][];
  year: number;
  month: number;
  today: Date;
  selectedDate: string | null;
  eventsByDateMap: Record<string, EventType[]>;
  formatDate: (y: number, m: number, d: number) => string;
  onSelectDate: (date: string) => void;
};

export default function CalendarGrid({
  weeks,
  year,
  month,
  today,
  selectedDate,
  eventsByDateMap,
  formatDate,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <View style={styles.calendarGrid}>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRowCells}>
          {week.map((day, index) => {
            const dateKey = day !== null ? formatDate(year, month, day) : null;

            const hasEvent = !!dateKey && !!eventsByDateMap[dateKey]?.length;

            const isToday =
              day &&
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;

            const isSelected = !!dateKey && selectedDate === dateKey;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, isSelected && styles.selectedCell]}
                activeOpacity={day ? 0.7 : 1}
                onPress={() => day && onSelectDate(dateKey!)}
                disabled={!day}
              >
                <Text
                  style={[
                    styles.dayText,
                    !!isToday && styles.todayCell,
                    day === null && styles.dayEmpty,
                  ]}
                >
                  {day ?? ""}
                </Text>

                {hasEvent && <View style={styles.eventDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarGrid: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  // 한 주 (일~토 7칸)
  weekRowCells: {
    flexDirection: "row",
  },
  // 그 주 안의 하루 (셀)
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 14 },
  dayEmpty: { color: "#ccc" },
  // 이벤트 표시
  eventDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    bottom: 4,
    backgroundColor: "#4A90E2",
  },
  // 오늘 날짜
  todayCell: {
    width: 25,
    height: 25,
    textAlign: "center",
    lineHeight: 25,
    color: "white",
    backgroundColor: "#ff6b6b",
    borderRadius: 15,
  },
  // 선택된 날짜
  selectedCell: {
    backgroundColor: "#e2e2e2",
  },
});
