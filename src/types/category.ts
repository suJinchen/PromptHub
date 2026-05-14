export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  accent: string;
  coverImage?: string;
  thumbnail?: string;
  accentImage?: string;
  dailyImageMode?: string;
  promptCount?: number;
  count?: number;
  tags?: string[];
};
