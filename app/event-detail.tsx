import { eventsAtom, removeEventAtom, updateEventAtom } from "@/atoms/events";
import formatKoreanDate from "@/utils/formatKoreanDate";
import formatKoreanTime from "@/utils/formatKoreanTime";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id: string;
    date: string;
    title: string;
    detail: string;
    time?: string;
  }>();

  const { id, title, detail, date, time } = params;

  // jotai 전역 상태
  const events = useAtomValue(eventsAtom);
  const updateEvent = useSetAtom(updateEventAtom);
  const removeEvent = useSetAtom(removeEventAtom);

  // 전역에서 최신 이벤트 정보 가져오기 (params보다 우선)
  const currentEvent = events.find((ev) => ev.id === id);

  // 편집용 로컬 state
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(
    currentEvent?.title ?? (title as string) ?? ""
  );
  const [timeInput, setTimeInput] = useState(
    currentEvent?.time ?? (time as string) ?? ""
  );
  const [detailInput, setDetailInput] = useState(
    currentEvent?.detail ?? (detail as string) ?? ""
  );

  // 전역 이벤트가 바뀌었을 때 동기화
  useEffect(() => {
    if (currentEvent) {
      setTitleInput(currentEvent.title);
      setTimeInput(currentEvent.time ?? "");
      setDetailInput(currentEvent.detail);
    }
  }, [currentEvent?.title, currentEvent?.time, currentEvent?.detail]);

  const handleToggleEdit = () => {
    // 저장 단계
    if (isEditing && id && date) {
      const updated = {
        id: id as string,
        date: date as string,
        title: titleInput.trim(),
        time: timeInput.trim(),
        detail: detailInput.trim(),
      };
      updateEvent(updated);
    }
    setIsEditing((prev) => !prev);
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      "일정 삭제",
      "해당 일정을 정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            removeEvent(String(id)); // jotai로 삭제
            router.back(); // 메인으로 돌아가기
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 헤더 구역 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>〈 일정 목록</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>일정 상세</Text>

          <View style={styles.headerRight}>
            {/* 편집/저장 버튼 */}
            <TouchableOpacity onPress={handleToggleEdit}>
              <Text style={[styles.editText, isEditing && styles.editActive]}>
                {isEditing ? "저장" : "편집"}
              </Text>
            </TouchableOpacity>

            {/* 삭제 아이콘 (오른쪽 상단) */}
            <TouchableOpacity
              onPress={handleDelete}
              disabled={!id}
              style={styles.trashButton}
            >
              <Feather name="trash-2" size={18} color={"#ff4d4f"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 내용 카드 */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* 제목 / 시간 */}
            {isEditing ? (
              <>
                <Text style={styles.label}>제목</Text>
                <TextInput
                  value={titleInput}
                  onChangeText={setTitleInput}
                  placeholder="제목을 입력하세요"
                  style={styles.input}
                />

                <Text style={[styles.label, { marginTop: 14 }]}>시간</Text>
                <TextInput
                  value={timeInput}
                  onChangeText={setTimeInput}
                  placeholder="예) 14:00"
                  style={[styles.input, { marginBottom: 5 }]}
                />
              </>
            ) : (
              <Text style={styles.title}>
                {timeInput ? `${formatKoreanTime(timeInput)} ` : ""}
                {titleInput}
              </Text>
            )}

            {/* 날짜 뱃지 */}
            {!!date && (
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>
                  {formatKoreanDate(date)}
                </Text>
              </View>
            )}

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 상세 내용 섹션 */}
            {isEditing ? (
              <TextInput
                value={detailInput}
                onChangeText={setDetailInput}
                placeholder="상세 내용을 입력하세요"
                style={[styles.input, styles.detailInput]}
                multiline
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.detail}>{detailInput}</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  backText: {
    fontSize: 13,
    color: "#555",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  dateBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eef3ff",
    marginBottom: 16,
  },
  dateBadgeText: {
    fontSize: 12,
    color: "#4a6aff",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
  detail: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    fontSize: 13,
    color: "#4a6aff",
    padding: 3,
  },
  editActive: {
    fontWeight: "700",
  },
  trashButton: {
    marginLeft: 12,
    padding: 3,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: "#555",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  detailInput: {
    minHeight: 100,
  },
});
