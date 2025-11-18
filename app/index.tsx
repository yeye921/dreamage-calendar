import React, { useMemo, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 일정(이벤트) 정보 예시
const EVENTS = [
  {
    id: "1",
    date: "2025-11-17",
    title: "고객 미팅",
    detail: "강남역 2시, 제안서 리뷰",
    time: "14:00",
  },
  {
    id: "2",
    date: "2025-11-17",
    title: "현장 점검",
    detail: "구로디지털단지 현장 — 장비 설치 상태 확인 및 담당자 면담",
    time: "14:00",
  },
  {
    id: "3",
    date: "2025-11-18",
    title: "팀 회의",
    detail: "외근 일정 공유 및 조율",
    time: "09:00",
  },
];

// 해당 달 일수
function getDaysInMonth(year: number, month: number) {
  // month: 0~11
  return new Date(year, month + 1, 0).getDate();
}

// 날짜를 "YYYY-MM-DD"로 변환
function formatDate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// 달력 셀 배열 만들기 (한 달 전체를 1차원 배열로)
function createCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay(); // 0=일, 6=토
  const daysInMonth = getDaysInMonth(year, month);

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
  return cells;
}

export default function BasicCalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // 선택된 날짜 ("YYYY-MM-DD")
  const [selectedDate, setSelectedDate] = useState<string | null>(
    formatDate(today.getFullYear(), today.getMonth(), today.getDate())
  );

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
    return result;
  }, [calendarCells]);

  // 날짜별 이벤트 묶기
  const eventsByDateMap = useMemo(() => {
    const map: Record<string, (typeof EVENTS)[number][]> = {};
    EVENTS.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, []);

  // 선택된 날짜의 일정 목록
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDateMap[selectedDate] || [];
  }, [selectedDate, eventsByDateMap]);

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

  // 날짜 클릭 시 선택 처리
  const handlePressDay = (day: number | null) => {
    if (!day) return;
    const dateKey = formatDate(year, month, day);
    setSelectedDate(dateKey);
  };

  // 스와이프 제스처 추가 (왼/오른쪽)
  const SWIPE_THRESHOLD = 50; // 얼마나 많이 밀었을 때 “스와이프”로 볼지

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
    },
    onPanResponderRelease: (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      const { dx } = gestureState;

      if (dx > SWIPE_THRESHOLD) {
        goPrevMonth();
      } else if (dx < -SWIPE_THRESHOLD) {
        goNextMonth();
      }
    },
  });

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
          <View style={styles.swipeContainer} {...panResponder.panHandlers}>
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
                  {week.map((day, index) => {
                    const dateKey =
                      day !== null ? formatDate(year, month, day) : null;

                    // 해당 날짜에 이벤트가 있는지 여부
                    const hasEvent =
                      !!dateKey && !!eventsByDateMap[dateKey]?.length;

                    // 오늘 날짜 여부
                    const isToday =
                      day &&
                      today.getFullYear() === year &&
                      today.getMonth() === month &&
                      today.getDate() === day;

                    // 선택된 날짜 여부
                    const isSelected = !!dateKey && selectedDate === dateKey;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.dayCell}
                        activeOpacity={day ? 0.7 : 1}
                        onPress={() => handlePressDay(day)}
                        disabled={!day}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            !!isToday && styles.todayCell,
                            !isToday && isSelected && styles.selectedCell,
                            day === null && styles.dayEmpty,
                          ]}
                        >
                          {day ?? ""}
                        </Text>

                        {/* 이벤트가 있으면 점 표시 */}
                        {hasEvent && <View style={styles.eventDot} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* 선택된 날짜의 일정 목록 */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>
              {selectedDate ? `${selectedDate} 일정` : "날짜를 선택하세요"}
            </Text>

            {selectedDateEvents.length === 0 ? (
              <Text style={styles.emptyText}>일정이 없습니다.</Text>
            ) : (
              <FlatList
                data={selectedDateEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.eventItem}>
                    <Text style={styles.eventTitle}>
                      {item.time ? `${item.time} ` : ""}
                      {item.title}
                    </Text>
                    <Text style={styles.eventDetail}>{item.detail}</Text>
                  </View>
                )}
              />
            )}
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

  // 스와이프 영역 (요일 + 달력 전체 감싸는 용도)
  swipeContainer: {
    flex: 0, // 높이는 내용만큼
  },

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
    borderRadius: "50%",
  },

  // 선택된 날짜
  selectedCell: {
    width: 25,
    height: 25,
    textAlign: "center",
    lineHeight: 25,
    color: "white",
    backgroundColor: "#999",
    borderRadius: "50%",
  },

  // 아래 일정 목록
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#999",
  },
  eventItem: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
    backgroundColor: "#eeeeee", // #fff
  },
  eventTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  eventDetail: {
    color: "#555",
    fontSize: 13,
  },
});
