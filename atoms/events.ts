// atoms/events.ts
import { atom } from "jotai";

export type EventType = {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  detail: string;
  time?: string; // "14:00"
};

// 전역 일정 리스트 atom
export const eventsAtom = atom<EventType[]>([
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
    time: "09:30",
  },
]);

// 일정 추가
export const addEventAtom = atom(null, (get, set, newEvent: EventType) => {
  const prev = get(eventsAtom);
  set(eventsAtom, [...prev, newEvent]);
});

// 일정 수정
export const updateEventAtom = atom(null, (get, set, updated: EventType) => {
  const prev = get(eventsAtom);
  set(
    eventsAtom,
    prev.map((ev) => (ev.id === updated.id ? updated : ev))
  );
});

// 일정 삭제
export const removeEventAtom = atom(null, (get, set, id: string) => {
  const prev = get(eventsAtom);
  set(
    eventsAtom,
    prev.filter((ev) => ev.id !== id)
  );
});
