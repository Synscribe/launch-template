export const VISUAL_REVIEW_ENV = "VISUAL_REVIEW_ENABLED";

export function isVisualReviewEnabled(value: string | undefined): boolean {
  return value === "true";
}
