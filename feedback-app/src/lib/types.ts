export interface OnboardingData {
  vision: string;              // 회사 미션 or 비전 (선택)
  orgGoals: string;            // 조직 목표 (선택)
  performanceGoals: string;    // 성과목표 (필수)
  growthGoals: string;         // 성장목표 (필수)
  coreValuesOrTalent: string;  // 핵심가치 또는 인재상 (필수)
  groundRules: string;         // 행동규범 (필수)
}

export type Mode = 'self-review' | 'leader-feedback' | 'attitude-fit';

export interface SelfReviewInput {
  content: string;
}

export interface FeedbackInput {
  selfReview: string;
  purpose: '칭찬' | '성장지원' | '개선요청' | '경고';
  tone: '단호' | '중립' | '코칭형' | '성장형';
}

export interface FitInput {
  content: string;
  writingPurpose: '자기소개형' | '평가문구형' | '조직적합성 설명형' | '리더 코멘트용';
}

export interface GenerateRequest {
  onboardingData: OnboardingData;
  mode: Mode;
  selfReviewInput?: SelfReviewInput;
  feedbackInput?: FeedbackInput;
  fitInput?: FitInput;
}

export interface GenerateResponse {
  success: boolean;
  result?: string;
  error?: string;
  debug?: string;
}
