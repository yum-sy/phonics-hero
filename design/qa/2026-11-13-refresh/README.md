# 2026-11-13 디자인 개편 검증

데스크톱 Chrome 검사이며 실제 iPad/Fold4 확인이 아니다.

- iPad 전체128/128.
- Fold 최종128/128: 최초127/128 이후 작은 가로 합체3건 재검증, fold-layout-final.json에 합침. 원래 실패 보고서도 보존.
- 부모 레이아웃 최초11/12 이후 세로월드1건 수정 재검증.
- 부모 제스처10/10, 진행 편집13/13; production제스처10/10 및 설치/검수5/5.
- art-browser.json: 갤러리296identity,14atlas,실제게임12화면. atlas-alpha.json: 투명4atlas38셀 경계검증. silhouette이미지는 brightness(0) 검수.
- 기존 학습계약/히어로순환/언어정책 통과. 이미지/폰트 변경이며 음원 변경 없음.

생성은 내장image_gen; 프롬프트 design/concepts/2026-11-13-refresh/production-prompts.json. 첫 dino-worlds의 불투명 배경은 도구로 제거 후 검증했다. 실제사용34종+예비4셀.
