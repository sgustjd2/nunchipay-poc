// 발표 대본(발표대본.md)에 적힌 값. 데이터에서 다시 계산하지 못하는 것만 여기에 둔다.
// 데이터로 계산되는 값(오차 감소율, 포함률 등)은 public/data/data.json의 kpi를 쓴다.
export const FACTS = {
  funnel: { raw: '약 12만 4천', withPay: '3만 6천', used: 29064, share: '23.5%' },
  timeValidation: { cutPct: 18.1, newCompanyPostings: 4104 },
  overCutPct: 27.9, // 과대 책정액 감소 (모의)
  underCutPct: 13.7, // 과소 책정액 감소 (모의)
  confidenceMae: { high: 19000, low: 34000 }, // 확신도 등급별 평균 오차 (약)
  k: { low: 0.55, high: 1.67 },
  pilot: { months: 6, hires: 2600, perArm: 1300, phases: [2, 3, 1] }, // 준비 2개월, 운영 3개월, 판정 1개월
  socAccuracy: 73.5,
  // 발표자료 14쪽 모의 기업 사례: 학습에 없던 AT&T 2024년 4월 공고 51건에 두 견적을 적용, 연간 정규직 채용 1,000명 가정
  attCase: { postings: 51, hires: 1000, savingUsd: 2440000, cutPct: 25.4, delayCutPct: 17.3, avgSavingUsd: 3470000 },
} as const
