export type Interest = "nature" | "photography" | "food" | "adventure" | "shopping" | "history";
export type BudgetLevel = "Low" | "Medium" | "High";
export type Season = "Winter" | "Summer" | "Monsoon" | "Year-round";

export interface Destination {
  id: number;
  name: string;
  state: string;
  category: string;
  budget_level: string;
  best_season: string;
  family_friendly: boolean;
  adventure_score: number;
  food_score: number;
  shopping_score: number;
  nature_score: number;
  historical_score: number;
  description: string;
  image_url: string;
}

export interface MatchBreakdown {
  interest: number;
  budget: number;
  season: number;
}

export interface RecommendRequest {
  interests: Interest[];
  budget_level: BudgetLevel;
  season: Season;
  trip_days: number;
}

export interface RecommendResult {
  destination: Destination;
  match_score: number;
  match_breakdown: MatchBreakdown;
}

export interface BudgetCalculateRequest {
  destination: string;
  days: number;
  budget_tier: BudgetLevel;
}

export interface BudgetBreakdown {
  hotel_total: number;
  food_total: number;
  transport_total: number;
  activities_total: number;
  grand_total: number;
  cost_saving_tip: string | null;
}

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget_level: BudgetLevel;
  interests: Interest[];
}

export interface ItineraryDay {
  day: number;
  activities: string[];
  meals: string[];
  notes: string;
}

export interface ItineraryOut {
  destination: string;
  days: ItineraryDay[];
}

export interface TripCreate {
  trip_name: string;
  destination: string;
  budget_tier: BudgetLevel;
  days: number;
  traveler_name?: string | null;
  itinerary: ItineraryDay[];
}

export interface TripListItem {
  id: number;
  trip_name: string;
  destination: string;
  budget_tier: string;
  days: number;
  traveler_name: string | null;
  created_at: string;
  user_id: number | null;
}

export interface TripOut extends TripListItem {
  itinerary: ItineraryDay[];
}

export interface CollaboratorOut {
  user_id: number;
  email: string;
  username: string;
}

export interface CompareRequest {
  destination_a: string;
  destination_b: string;
}

export interface ComparisonRow {
  metric: string;
  value_a: string;
  value_b: string;
}

export interface CompareOut {
  destination_a: Destination;
  destination_b: Destination;
  comparison_table: ComparisonRow[];
  ai_summary: string | null;
}

export interface HiddenGem {
  name: string;
  reason: string;
}

export interface HiddenGemsOut {
  destination: string;
  gems: HiddenGem[];
}

export interface PackingListOut {
  destination: string;
  items: string[];
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenOut {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AccessTokenOut {
  access_token: string;
  token_type: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface UserOut {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  hobbies: string[];
  home_city: string | null;
  bio: string | null;
  created_at: string;
}

export interface ProfileUpdateRequest {
  full_name?: string | null;
  hobbies: string[];
  home_city?: string | null;
  bio?: string | null;
}

export interface BudgetRateOut {
  tier: string;
  hotel_per_day: number;
  food_per_day: number;
  transport_per_day: number;
  activities_per_day: number;
}

export interface BudgetRateWrite {
  hotel_per_day: number;
  food_per_day: number;
  transport_per_day: number;
  activities_per_day: number;
}

export interface DestinationWrite {
  name: string;
  state: string;
  category: string;
  budget_level: BudgetLevel;
  best_season: string;
  family_friendly: boolean;
  adventure_score: number;
  food_score: number;
  shopping_score: number;
  nature_score: number;
  historical_score: number;
  description: string;
  image_url: string;
}
