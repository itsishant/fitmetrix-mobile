import { UserProfile } from "../types";

export const calculateBMR = (profile: UserProfile): number => {
  if (profile.gender === "male") {
    return (
      88.362 +
      13.397 * profile.weight +
      4.799 * profile.height -
      5.677 * profile.age
    );
  }
  return (
    447.593 +
    9.247 * profile.weight +
    3.098 * profile.height -
    4.33 * profile.age
  );
};

export const getActivityMultiplier = (
  level: UserProfile["activityLevel"],
): number => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return multipliers[level];
};

export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const multiplier = getActivityMultiplier(profile.activityLevel);
  return Math.round(bmr * multiplier);
};

export const calculateDailyCalories = (profile: UserProfile): number => {
  const tdee = calculateTDEE(profile);
  switch (profile.goal) {
    case "lose":
      return Math.round(tdee - 500);
    case "gain":
      return Math.round(tdee + 500);
    default:
      return tdee;
  }
};

export const calculateWaterIntake = (weight: number): number => {
  return Math.round(weight * 0.033 * 1000);
};

export const getProgressPercentage = (
  current: number,
  goal: number,
): number => {
  if (goal === 0) return 0;
  const percentage = (current / goal) * 100;
  return Math.min(percentage, 100);
};
