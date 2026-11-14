# 눈치페이 PoC

미국 채용 공고의 연봉 범위와 확신도를 알려주는 연봉 견적 PoC입니다. AI빅데이터프로젝트세미나 프로젝트 02(퇴근랩스)의 발표용 데모 페이지입니다.
서비스 이름 "눈치페이"는 가칭이며 상표 조사를 하지 않았습니다.

- 배포 주소: https://sgustjd2.github.io/nunchipay-poc/
- 사업 설명 랜딩(`#/`), 체험 도구(`#/app`), 시범 운영 안내(`#/pitch`)로 구성된 정적 페이지입니다. 서버가 없습니다.
- 견적은 실시간 모델 추론이 아니라 사전 계산한 견적표(`public/data/data.json`)를 조회합니다.
- 게시된 연봉을 정답으로 본 모의 계산이며 실제 절감액으로 검증되지 않았습니다.

## 데이터
미국 LinkedIn 공고(Kaggle, 2023·2024년 수집) 중 급여가 적힌 정규직 연봉 공고 29,064건에서 계산한 집계값(직무·지역·경력별 견적표, 기준선 비교표, 지표)만 담았습니다. 공고 원문과 개별 공고 행은 포함하지 않았습니다.
`data.json`은 팀 저장소의 원자료에서 `scripts/build-data.mjs`로 만든 결과물이며, 이 저장소에는 원자료가 없어 `npm run build:data`는 동작하지 않습니다.

## 실행
```bash
npm ci
npm run dev        # 개발 서버 (data.json이 있어야 합니다)
npm run test:ci    # 조회 규칙·지표 스모크 테스트
npm run build:pages
```
`main`에 푸시하면 GitHub Actions가 테스트와 빌드를 거쳐 GitHub Pages에 배포합니다.

## 구성
- `src/pages`: 랜딩, 체험 도구, 시범 운영 안내
- `src/features/quote/cards.tsx`: 체험 도구와 랜딩 데모가 함께 쓰는 견적 카드
- `src/lib/lookup.ts`: 견적 규칙(납품 사례 → 관측 범위 → 모델 보완 → 제공 보류)
- `harness/`: 스모크 테스트와 발표 전 체크리스트(`harness/README.md`)
- `src/kit/`: [stageshow](src/kit/NOTICE.md) 킷(MIT)
