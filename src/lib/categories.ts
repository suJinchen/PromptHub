import categoriesData from "@/data/categories.json";
import type { CategoryItem } from "@/types/category";

const categories = categoriesData as CategoryItem[];

export function getAllCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}