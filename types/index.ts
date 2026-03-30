export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  image: string;
  description: string;
}

export interface DayWorkout {
  day: string;
  muscle: string;
  exercises: Exercise[];
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  goal: "lose" | "maintain" | "gain";
  dailyCalorieGoal: number;
  dailyWaterGoal: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface WaterEntry {
  id: string;
  amount: number;
  date: string;
  time: string;
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  totalWater: number;
  foods: FoodEntry[];
  waterEntries: WaterEntry[];
}
