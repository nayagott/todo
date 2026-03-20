# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 시작 (http://localhost:5173)
npm run build      # 타입 검사 + 프로덕션 빌드
npm run preview    # 프로덕션 빌드 미리보기
```

## 기술 스택

React 18 + TypeScript + Vite SPA. 백엔드 없음 — 데이터는 `localStorage`에 저장.

## 아키텍처

```
src/
  hooks/useTodos.ts       # 모든 상태 로직 + localStorage 영속성
  components/
    TodoInput.tsx          # 새 할 일 입력(텍스트 + 기한) + 전체 토글 버튼
    TodoItem.tsx           # 체크박스, 라벨, 기한 배지, 인라인 편집, 삭제
    Footer.tsx             # 필터 탭, 남은 항목 수, 완료 항목 삭제
  App.tsx                  # 컴포넌트 조합 및 빈 상태 메시지 처리
  types.ts                 # Todo 인터페이스, Filter 타입, getDueDateStatus 유틸
  index.css                # 단일 전역 스타일시트 (CSS 모듈 미사용)
```

**상태 흐름**: `useTodos`가 모든 상태를 소유하고 핸들러를 노출. `App`이 props로 전달 — Context나 외부 상태 라이브러리 없음.

## 데이터 모델

```typescript
interface Todo {
  id: string;        // crypto.randomUUID()
  text: string;      // 할 일 내용
  completed: boolean;
  dueDate?: string;  // 기한 'YYYY-MM-DD' (선택)
}

type Filter = 'all' | 'active' | 'completed';
```

## 기한 색상 규칙

`getDueDateStatus(dueDate)` → `'overdue' | 'today' | 'upcoming'`

| 상태 | 조건 | 배지 색상 |
|------|------|-----------|
| `overdue` | 기한 < 오늘 | 빨간색 |
| `today` | 기한 = 오늘 | 오렌지 |
| `upcoming` | 기한 > 오늘 | 회색 |

완료된 항목에는 기한 배지를 표시하지 않음.

## 구현된 기능

- 할 일 추가 (텍스트 입력 후 Enter, 기한 선택 선택 사항)
- 완료 토글 (체크박스)
- 삭제 (hover 시 × 버튼)
- 인라인 편집: 라벨 더블클릭 → Enter로 저장, Esc로 취소, blur로 저장. 빈 텍스트 저장 시 삭제
- 기한 설정 및 상태별 색상 경고 (기한 초과/오늘/예정)
- 필터링: 전체 / 진행 중 / 완료
- 전체 토글 (▾ 버튼)
- 완료 항목 일괄 삭제
- localStorage 자동 저장
- 모바일 반응형 (480px 이하)

## 범위 외

사용자 인증, 클라우드 동기화, 다중 사용자 기능은 이 앱의 범위에 포함되지 않음.
