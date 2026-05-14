import tagsData from "@/data/tags.json";
import type { TagItem } from "@/types/tag";

const tags = tagsData as TagItem[];

export function getAllTags() {
  return tags;
}
