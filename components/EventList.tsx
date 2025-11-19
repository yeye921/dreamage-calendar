import { EventType } from "@/atoms/events";
import formatKoreanDate from "@/utils/formatKoreanDate";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  selectedDate: string | null;
  events: EventType[];
  onPressAdd: () => void;
}

export default function EventList({ selectedDate, events, onPressAdd }: Props) {
  const router = useRouter();

  return (
    <View style={styles.listContainer}>
      {/* 상단 헤더 */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.sectionTitle}>
          {selectedDate
            ? `${formatKoreanDate(selectedDate)} 일정`
            : "날짜를 선택하세요"}
        </Text>

        {/* + 새 일정 */}
        <TouchableOpacity onPress={onPressAdd}>
          <Text style={styles.addButtonText}>+ 새 일정</Text>
        </TouchableOpacity>
      </View>

      {/* 일정 없음 */}
      {events.length === 0 ? (
        <Text style={styles.emptyText}>일정이 없습니다.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventListContent}
          ItemSeparatorComponent={() => <View style={styles.eventSeparator} />}
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
                <View style={styles.eventTimeBadge}>
                  <Text style={styles.eventTimeText}>
                    {item.time ?? "시간"}
                  </Text>
                </View>

                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.eventDetail} numberOfLines={1}>
                    {item.detail}
                  </Text>
                </View>

                <Text style={styles.eventChevron}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
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
  eventChevron: {
    marginLeft: 6,
    fontSize: 18,
    color: "#ccc",
  },
});
