export type RoadmapStatus = "done" | "in-progress" | "planned";
export type RoadmapCategory = "academic" | "course" | "library" | "campus" | "life";

export interface RoadmapItem {
  id: string;
  category: RoadmapCategory;
  titleZh: string;
  titleEn: string;
  descriptionZh?: string;
  descriptionEn?: string;
  status: RoadmapStatus;
  platform?: "ios" | "android" | "both";
}
