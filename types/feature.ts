export type Platform = "ios" | "android" | "both";

export interface Feature {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  screenshot?: string;
  platform: Platform;
}
