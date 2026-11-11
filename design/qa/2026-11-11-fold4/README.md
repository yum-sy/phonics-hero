# Fold4 펼친 화면 검증

실제 기기 결과가 아닌 데스크톱 Chrome 검증이다. standalone CSS와 상하 24px 가상 안전영역을 적용했다. 네 CSS 뷰포트는 기기 표시 크기 차이를 고려한 가정이다. 커버 화면과 반접힘은 지원 범위에서 제외했다.

- fold-layout.json: 4뷰포트 ×32화면, HUD 스크롤/잘림/넘침 및 콘솔 검사.
- ipad-regression.json: 기존 iPad 4설정 ×10화면.
- parent-partial.json / parent-complete.json: 각 16화면.
- rotation.json: 회전 중 그림·답안·진도·오디오 상태 보존.
- production-install.json: 배포 빌드의 설치 설정과 33챕터 ×4뷰포트 검수 목록.

포켓몬판의 최초 전체 실행 초반 7건은 CSS 적용 전 실행됐다. 최종 보고서는 적용 후 세로 32건 재실행과 나머지 96건을 합쳤으며 provenance에 기록했다.
