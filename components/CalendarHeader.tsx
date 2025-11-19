import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ year, month, onPrev, onNext }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrev}>
        <Text style={styles.navBtn}>〈</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        {year}년 {month + 1}월
      </Text>

      <TouchableOpacity onPress={onNext}>
        <Text style={styles.navBtn}>〉</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
