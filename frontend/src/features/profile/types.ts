export interface UserProfile {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "customer";
  tickets_count?: number;
  orders_count?: number;
  favorite_genre?: string;
  joined_date?: string;
}
