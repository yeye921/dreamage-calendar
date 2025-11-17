import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 해당 달 일수
function getDaysInMonth(year: number, month: number) {
  // month: 0~11
  return new Date(year, month + 1, 0).getDate();
}

// 달력 셀 배열 만들기 (한 달 전체를 1차원 배열로)
function createCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay(); // 0=일, 6=토
  const daysInMonth = getDaysInMonth(year, month);
  console.log(firstDay, firstWeekday);

  const cells: (number | null)[] = [];

  // 1일 전 빈칸(null)
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }

  // 1일부터 마지막 날까지
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  // 마지막 줄이 7의 배수가 되도록 뒤에 null 채우기
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  console.log(cells);
  return cells;
}

export default function BasicCalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // 현재 year, month 기준 달력 셀 (1차원 배열)
  const calendarCells = useMemo(
    () => createCalendarCells(year, month),
    [year, month]
  );

  // 1차원 배열을 7개씩 끊어서 주(week) 단위로 변환
  const weeks = useMemo(() => {
    const result: (number | null)[][] = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
      result.push(calendarCells.slice(i, i + 7));
    }
    console.log(result);
    return result;
  }, [calendarCells]);

  const goPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* 헤더: 년/월 + 이전/다음 버튼 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goPrevMonth}>
              <Text style={styles.navBtn}>〈</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {year}년 {month + 1}월
            </Text>

            <TouchableOpacity onPress={goNextMonth}>
              <Text style={styles.navBtn}>〉</Text>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekRow}>
            {WEEK_LABELS.map((label) => (
              <Text key={label} style={styles.weekLabel}>
                {label}
              </Text>
            ))}
          </View>

          {/* 달력 그리드 (주 단위 + 셀) */}
          <View style={styles.calendarGrid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRowCells}>
                {week.map((day, index) => (
                  <View key={index} style={styles.dayCell}>
                    <Text
                      style={[styles.dayText, day === null && styles.dayEmpty]}
                    >
                      {day ?? ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
  },
  navBtn: { fontSize: 20, padding: 8 },

  weekRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekLabel: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },

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
    flex: 1, // 한 줄에서 7칸을 균등 분배
    aspectRatio: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 14 },
  dayEmpty: { color: "#ccc" },
});
