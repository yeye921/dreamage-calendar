## 📱 드림에이지이 외근 사원 일정 관리 앱

외근 근무를 하는 사원들을 위해 쉽게 일정을 관리하고 확인할 수 있는 모바일 달력 앱입니다.
Expo + React Native + Jotai 상태관리로 구현되었습니다.
<br/><br/>


## 👩‍💻 과제 개요

- 외근 근무자가 매일 이동하는 일정들을 한눈에 달력으로 확인할 수 있는 앱을 구현하는 과제입니다.

- 실사용자를 고려한 UI, 일정 추가·삭제·수정 기능을 포함하도록 제작하였습니다.
<br/><br/>

## ✨ 주요 기능 요약

### ✔️ 기본 달력 기능

- 년도/월 변경 가능 (〈 〉 버튼 또는 스와이프 제스처)

- 요일(일~토) 표시

- 선택된 날짜는 하이라이트로 표시

- 일정이 있는 날짜는 점(Dot) 으로 표시
---

### ✔️ 일정 목록 보기

- 날짜를 누르면, 해당 날짜의 일정 목록을 하단에서 확인 가능

- 일정은 시간 뱃지 + 제목 + 상세 내용 형태의 카드 UI로 표시
---
### ✔️ 일정 상세 페이지

일정 카드 선택 시 상세 페이지로 이동

시간 / 제목 / 상세내용 확인 가능

오른쪽 상단 쓰레기통 아이콘으로 일정 삭제 가능

---

### ✔️ 일정 추가

"+ 새 일정" 버튼 클릭 → event-form 페이지로 이동

제목 / 시간 / 상세 내용 / 날짜 입력 후 추가

Jotai 기반 전역 상태에 저장(eventsAtom)

---

### ✔️ 일정 수정

일정 상세 페이지에서 제목 / 시간 / 상세내용 수정 가능

수정한 내용은 Jotai 상태(updateEventAtom)를 통해 즉시 반영

---

### ✔️ 일정 삭제

상세 페이지 우측 상단 아이콘으로 삭제

removeEventAtom을 통해 전역 상태에서 제거

---
<br/><br/>
## 📁 폴더 구조 (요약)

```
/atoms
└─ events.ts
/components
├─ SummaryCard.tsx
├─ CalendarGrid.tsx
├─ EventList.tsx
└─ ...
/utils
├─ formatKoreanDate.ts
├─ formatKoreanTime.ts
└─ ...
/app
├─ calendar.tsx
├─ event-detail.tsx
└─ event-form.tsx
/assets
└─ dreamage-logo.png
```
<br/><br/>

## 🧱 사용된 기술 스택

- React Native

- Expo

- expo-router

- TypeScript

- Jotai (상태관리)

- React Native Gesture System (스와이프 기능)

<br/><br/>

## ▶️ 실행 방법 (Run)

### 1. 패키지 설치

```
npm install

# or

yarn install
```

### 2. Expo 개발 서버 실행

```
 expo start
```

### 3. 실행 방법

- QR 코드를 Expo Go 앱으로 스캔하여 실행
  
- 에뮬레이터에서 실행: iOS / Android
