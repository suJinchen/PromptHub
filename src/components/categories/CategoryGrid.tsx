import type { CategoryItem } from "@/types/category";
import { CategoryCard } from "./CategoryCard";

type CategoryGridProps = { categories: CategoryItem[] };

export function CategoryGrid({ categories }: CategoryGridProps) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</div>;
}
