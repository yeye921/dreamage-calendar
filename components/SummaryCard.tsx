import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  todaysEventCount: number;
  userName: string;
};

export default function SummaryCard({
  todaysEventCount,
  userName = "김예원",
}: Props) {
  return (
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
          {userName}님, 오늘 예정된 일정이{" "}
          <Text style={styles.summaryHighlight}>{todaysEventCount}개</Text>{" "}
          있습니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
