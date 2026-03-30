import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailyLog, FoodEntry, UserProfile, WaterEntry } from "../types";

const KEYS = {
  USER_PROFILE: "user_profile",
  DAILY_LOGS: "daily_logs",
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const getDailyLog = async (date: string): Promise<DailyLog> => {
  const logs = await getAllDailyLogs();
  return (
    logs[date] || {
      date,
      totalCalories: 0,
      totalWater: 0,
      foods: [],
      waterEntries: [],
    }
  );
};

export const getAllDailyLogs = async (): Promise<Record<string, DailyLog>> => {
  const data = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
  return data ? JSON.parse(data) : {};
};

export const saveDailyLog = async (log: DailyLog): Promise<void> => {
  const logs = await getAllDailyLogs();
  logs[log.date] = log;
  await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs));
};

export const addFoodEntry = async (
  date: string,
  food: FoodEntry,
): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  log.foods.push(food);
  log.totalCalories = log.foods.reduce((sum, f) => sum + f.calories, 0);
  await saveDailyLog(log);
  return log;
};

export const removeFoodEntry = async (
  date: string,
  foodId: string,
): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  log.foods = log.foods.filter((f) => f.id !== foodId);
  log.totalCalories = log.foods.reduce((sum, f) => sum + f.calories, 0);
  await saveDailyLog(log);
  return log;
};

export const addWaterEntry = async (
  date: string,
  water: WaterEntry,
): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  log.waterEntries.push(water);
  log.totalWater = log.waterEntries.reduce((sum, w) => sum + w.amount, 0);
  await saveDailyLog(log);
  return log;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};
