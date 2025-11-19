// app/event-form.tsx

import { addEventAtom, EventType } from "@/atoms/events";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 오늘 날짜 "YYYY-MM-DD" 형태로 만드는 헬퍼
function getTodayKey() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function EventFormScreen() {
  const router = useRouter();
  const addEvent = useSetAtom(addEventAtom);

  // 캘린더에서 선택한 날짜를 넘겨줄 수도 있음 (옵션)
  const params = useLocalSearchParams<{ date?: string }>();
  const initialDate =
    typeof params.date === "string" ? params.date : getTodayKey();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(""); // "14:00" 같은 문자열
  const [detail, setDetail] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }
    if (!date.trim()) {
      Alert.alert("알림", "날짜를 입력해주세요. (예: 2025-11-17)");
      return;
    }

    const newEvent: EventType = {
      id: String(Date.now()), // 간단한 id 생성
      title: title.trim(),
      date: date.trim(),
      time: time.trim() || undefined,
      detail: detail.trim(),
    };

    addEvent(newEvent);
    router.back(); // 저장 후 메인 캘린더로 돌아가기
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* 상단 헤더 */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>〈 돌아가기</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>새 일정 추가</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* 폼 카드 */}
          <View style={styles.card}>
            {/* 제목 */}
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 고객 미팅"
              value={title}
              onChangeText={setTitle}
            />

            {/* 날짜 */}
            <Text style={styles.label}>날짜</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 2025-11-17"
              value={date}
              onChangeText={setDate}
            />

            {/* 시간 */}
            <Text style={styles.label}>시간 (선택)</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 14:00"
              value={time}
              onChangeText={setTime}
            />

            {/* 상세 내용 */}
            <Text style={styles.label}>상세 내용 (선택)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="상세 내용을 입력하세요."
              value={detail}
              onChangeText={setDetail}
              multiline
            />
          </View>

          {/* 하단 버튼 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ff6b6b",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4a6aff",
  },
  cancelText: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
