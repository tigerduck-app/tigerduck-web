import type { Feature } from "@/types/feature";

export const features: Feature[] = [
  {
    id: "homework",
    icon: "📚",
    titleKey: "features.homework.title",
    descriptionKey: "features.homework.description",
    screenshot: "/screenshots/homework-ios.png",
    platform: "both",
  },
  {
    id: "classtable",
    icon: "📋",
    titleKey: "features.classtable.title",
    descriptionKey: "features.classtable.description",
    screenshot: "/screenshots/classtable-ios.png",
    platform: "both",
  },
  {
    id: "calendar",
    icon: "🗓️",
    titleKey: "features.calendar.title",
    descriptionKey: "features.calendar.description",
    platform: "both",
  },
  {
    id: "library",
    icon: "🏛️",
    titleKey: "features.library.title",
    descriptionKey: "features.library.description",
    screenshot: "/screenshots/library-ios.png",
    platform: "both",
  },
  {
    id: "customize",
    icon: "🎨",
    titleKey: "features.customize.title",
    descriptionKey: "features.customize.description",
    screenshot: "/screenshots/customize-settings-ios.png",
    platform: "both",
  },
  {
    id: "platform",
    icon: "⚙️",
    titleKey: "features.platform.title",
    descriptionKey: "features.platform.description",
    platform: "both",
  },
];
