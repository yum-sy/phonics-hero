# 부모 모드 7탭 + PIN 검증

2026-11-16, 데스크톱 Chrome 자동 검사. 실제 iPad/Fold4 검증은 아님.

- unit.json: 탭·PIN 26개
- state.json: 진행 상태 19개
- browser.json: 진입·PIN 변경·빠른/느린 탭·터치·키보드 15묶음
- progress-browser.json: 진도 편집·잠금·Undo 13묶음
- modal-layout.json: 6개 PIN 상태 × 6개 화면 크기
- controls-layout.json: 제목/부모 버튼 44px 이상 및 겹침 16건
- parent-hud.json: 부모 화면 HUD 16건
- normal-hud-before-correction.json: 일반 화면 24건 중 작은 Fold 챕터 화면 4px 넘침 발견
- normal-hud-correction.json: 해당 간격 수정 후 마지막 사례 재검증 통과
- production-browser.json: 최종 배포용 빌드 진입 검사

재현: scripts/check-parent-command.mjs, check-parent-progress.mjs,
check-parent-command-browser.mjs, check-parent-progress-browser.mjs,
check-parent-pin-layout.mjs, check-parent-controls-layout.mjs, check-safe-layout.mjs.
레이아웃 스크립트는 개발 서버용. 브라우저 스크립트는 배포 base 경로도 지원.
