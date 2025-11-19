import { eventsAtom, EventType, removeEventAtom } from "@/atoms/events";
import { WEEK_LABELS } from "@/constants/date";
import formatKoreanDate from "@/utils/formatKoreanDate";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  Image,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const todayKey = formatDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events] = useAtom(eventsAtom); // 전역 일정
  const [, removeEvent] = useAtom(removeEventAtom);

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
    const map: Record<string, EventType[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  // 선택된 날짜의 일정 목록
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDateMap[selectedDate] || [];
  }, [selectedDate, eventsByDateMap]);

  // 오늘 일정 개수
  const todaysEventCount = eventsByDateMap[todayKey]?.length ?? 0;

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
  const SWIPE_THRESHOLD = 50;

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 드림에이지이 로고 + 개인 일정 정보 헤더 */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryBrandRow}>
              <Image
                source={require("@/assets/images/dreamage-logo.png")}
                style={styles.summaryLogo}
                resizeMode="contain"
              />
              <Text style={styles.summaryBrandName}>드림에이지이</Text>
            </View>

            <Text style={styles.summaryTitle}>외근 일정</Text>
            <Text style={styles.summaryText}>
              김예원님, 오늘 예정된 일정이{" "}
              <Text style={styles.summaryHighlight}>{todaysEventCount}개</Text>{" "}
              있습니다.
            </Text>
          </View>
        </View>

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
                      style={[
                        styles.dayCell,
                        isSelected && styles.selectedCell,
                      ]}
                      activeOpacity={day ? 0.7 : 1}
                      onPress={() => handlePressDay(day)}
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
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionTitle}>
              {selectedDate
                ? `${formatKoreanDate(selectedDate)} 일정`
                : "날짜를 선택하세요"}
            </Text>

            {/* 새 일정 추가 버튼 (event-form 화면으로 이동) */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/event-form",
                  params: {
                    date: selectedDate ?? todayKey,
                  },
                })
              }
            >
              <Text style={styles.addButtonText}>+ 새 일정</Text>
            </TouchableOpacity>
          </View>

          {selectedDateEvents.length === 0 ? (
            <Text style={styles.emptyText}>일정이 없습니다.</Text>
          ) : (
            <FlatList
              data={selectedDateEvents}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.eventListContent} // 리스트 전체 여백
              ItemSeparatorComponent={() => (
                <View style={styles.eventSeparator} />
              )} //  카드 사이 간격
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/event-detail",
                      params: {
                        id: item.id,
                        date: item.date,
                        title: item.title,
                        detail: item.detail,
                        time: item.time ?? "",
                      },
                    })
                  }
                >
                  <View style={styles.eventItem}>
                    {/* 왼쪽 시간 뱃지 */}
                    <View style={styles.eventTimeBadge}>
                      <Text style={styles.eventTimeText}>
                        {item.time ?? "시간"}
                      </Text>
                    </View>

                    {/* 가운데 텍스트 영역 */}
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.eventDetail} numberOfLines={1}>
                        {item.detail}
                      </Text>
                    </View>

                    {/* 오른쪽 화살표 */}
                    <Text style={styles.eventChevron}>›</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },

  /*  브랜드 헤더 */
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  brandCompany: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },
  brandSub: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  brandRight: {
    alignItems: "flex-end",
  },
  brandGreetingName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a6aff",
    marginBottom: 2,
  },
  brandGreetingText: {
    fontSize: 12,
    color: "#555",
  },

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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    backgroundColor: "#e2e2e2",
  },

  // 아래 일정 목록
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#999",
  },
  addButtonText: {
    fontSize: 13,
    color: "#4a6aff",
    fontWeight: "600",
  },

  // FlatList 전체 패딩
  eventListContent: {
    paddingBottom: 24,
  },

  // 아이템 간 간격
  eventSeparator: {
    height: 8,
  },

  // 카드 전체
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    // 그림자
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  // 왼쪽 시간 뱃지
  eventTimeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#eef3ff",
    marginRight: 10,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  eventTimeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b5bdb",
  },

  // 가운데 텍스트 영역
  eventTextContainer: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: "700",
    marginBottom: 3,
    fontSize: 14,
    color: "#222",
  },
  eventDetail: {
    color: "#777",
    fontSize: 12,
  },

  // 오른쪽 화살표
  eventChevron: {
    marginLeft: 6,
    fontSize: 18,
    color: "#ccc",
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryLeft: {
    flex: 1,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4a6aff",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  summaryHighlight: {
    fontWeight: "700",
    color: "#ff6b6b",
  },
  summaryBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLogo: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  summaryBrandName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
});
