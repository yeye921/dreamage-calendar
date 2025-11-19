import { eventsAtom, EventType, removeEventAtom } from "@/atoms/events";
import CalendarGrid from "@/components/CalendarGrid";
import CalendarHeader from "@/components/CalendarHeader";
import EventList from "@/components/EventList";
import SummaryCard from "@/components/SummaryCard";
import { WEEK_LABELS } from "@/constants/date";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
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
        <SummaryCard todaysEventCount={todaysEventCount} userName="김예원" />

        {/* 헤더: 년/월 + 이전/다음 버튼 */}
        <CalendarHeader
          year={year}
          month={month}
          onPrev={goPrevMonth}
          onNext={goNextMonth}
        />

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
          <CalendarGrid
            weeks={weeks}
            year={year}
            month={month}
            today={today}
            selectedDate={selectedDate}
            eventsByDateMap={eventsByDateMap}
            formatDate={formatDate}
            onSelectDate={(d) => setSelectedDate(d)}
          />
        </View>

        {/* 선택된 날짜의 일정 목록 */}
        <EventList
          selectedDate={selectedDate}
          events={selectedDateEvents}
          onPressAdd={() =>
            router.push({
              pathname: "/event-form",
              params: { date: selectedDate ?? todayKey },
            })
          }
        />
      </View>
    </SafeAreaView>
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
});
