export type ContributorPlatform = "ios" | "android";

export interface Contributor {
  login: string;
  avatar: string;
  html_url: string;
  contributions: number;
  platform: ContributorPlatform;
}
