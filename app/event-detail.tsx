import formatKoreanDate from "@/utils/formatKoreanDate";
import formatKoreanTime from "@/utils/formatKoreanTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
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

  const { title, detail, date, time } = params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 헤더 구역 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>〈 일정 목록</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>일정 상세</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* 내용 카드 */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* 제목 */}
            <Text style={styles.title}>
              {time ? `${formatKoreanTime(time)} ` : ""}
              {title}
            </Text>

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
            <Text style={styles.sectionLabel}>상세 내용</Text>
            <Text style={styles.detail}>{detail}</Text>
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
});
