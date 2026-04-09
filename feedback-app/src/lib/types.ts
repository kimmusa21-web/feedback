export interface OnboardingData {
  vision: string;
  coreValues: string;
  orgGoals: string;
  performanceGoals: string;
  growthGoals: string;
  idealTalent: string;
  groundRules: string;
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
