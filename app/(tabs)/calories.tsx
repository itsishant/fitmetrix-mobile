import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { DailyLog, FoodEntry, UserProfile } from "../../types";
import { getProgressPercentage } from "../../utils/calculations";
import {
    addFoodEntry,
    getDailyLog,
    getTodayDate,
    getUserProfile,
    removeFoodEntry,
} from "../../utils/storage";

export default function CaloriesScreen() {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [mealType, setMealType] = useState<FoodEntry["mealType"]>("breakfast");

  const loadData = async () => {
    const today = getTodayDate();
    const log = await getDailyLog(today);
    const userProfile = await getUserProfile();
    setDailyLog(log);
    setProfile(userProfile);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleAddFood = async () => {
    if (!foodName.trim() || !foodCalories.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const calories = parseInt(foodCalories, 10);
    if (isNaN(calories) || calories <= 0) {
      Alert.alert("Error", "Please enter valid calories");
      return;
    }

    const newFood: FoodEntry = {
      id: Date.now().toString(),
      name: foodName.trim(),
      calories,
      date: getTodayDate(),
      mealType,
    };

    const updatedLog = await addFoodEntry(getTodayDate(), newFood);
    setDailyLog(updatedLog);
    setModalVisible(false);
    setFoodName("");
    setFoodCalories("");
    setMealType("breakfast");
  };

  const handleDeleteFood = async (foodId: string) => {
    Alert.alert("Delete Food", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedLog = await removeFoodEntry(getTodayDate(), foodId);
          setDailyLog(updatedLog);
        },
      },
    ]);
  };

  const calorieGoal = profile?.dailyCalorieGoal || 2000;
  const currentCalories = dailyLog?.totalCalories || 0;
  const progress = getProgressPercentage(currentCalories, calorieGoal);
  const remaining = calorieGoal - currentCalories;
  const ringColor =
    progress >= 100
      ? remaining < 0
        ? Colors.danger
        : Colors.accent
      : Colors.primary;

  const mealTypes: FoodEntry["mealType"][] = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ];

  const getMealIcon = (type: FoodEntry["mealType"]) => {
    switch (type) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "☀️";
      case "dinner":
        return "🌙";
      case "snack":
        return "🍿";
    }
  };

  const getMealFoods = (type: FoodEntry["mealType"]) => {
    return dailyLog?.foods.filter((f) => f.mealType === type) || [];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Daily Nutrition</Text>
          <Text style={styles.headerTitle}>Calorie Tracker</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.centeredRow}>
            <View style={styles.calorieRing}>
              <View
                style={[
                  styles.calorieRingProgress,
                  {
                    borderColor: ringColor,
                    borderTopColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomColor:
                      progress < 50 ? "transparent" : ringColor,
                    transform: [{ rotate: "-90deg" }],
                  },
                ]}
              />
              <Text style={styles.calorieValue}>{currentCalories}</Text>
              <Text style={styles.calorieMeta}>of {calorieGoal} cal</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statValueAccent]}>
                {remaining > 0 ? remaining : 0}
              </Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statValuePrimary]}>
                {currentCalories}
              </Text>
              <Text style={styles.statLabel}>Consumed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statValueSecondary]}>
                {calorieGoal}
              </Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.text} />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>

        {mealTypes.map((type) => {
          const foods = getMealFoods(type);
          const mealCalories = foods.reduce((sum, f) => sum + f.calories, 0);

          return (
            <View key={type} style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <View style={styles.mealHeaderLeft}>
                  <Text style={styles.mealIcon}>{getMealIcon(type)}</Text>
                  <Text style={styles.mealTitle}>{type}</Text>
                </View>
                <Text style={styles.mealCalories}>{mealCalories} cal</Text>
              </View>

              {foods.length > 0 ? (
                foods.map((food) => (
                  <View key={food.id} style={styles.foodCard}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDetail}>
                        {food.calories} calories
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteFood(food.id)}
                      style={styles.deleteButton}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={Colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyMealCard}>
                  <Text style={styles.emptyMealText}>No {type} logged yet</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter food name"
              placeholderTextColor={Colors.textSecondary}
              value={foodName}
              onChangeText={setFoodName}
            />

            <Text style={styles.inputLabel}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter calories"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={foodCalories}
              onChangeText={setFoodCalories}
            />

            <Text style={styles.inputLabel}>Meal Type</Text>
            <View style={styles.mealTypeRow}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMealType(type)}
                  style={[
                    styles.mealTypeButton,
                    mealType === type
                      ? styles.mealTypeButtonActive
                      : styles.mealTypeButtonInactive,
                  ]}>
                  <Text
                    style={[
                      styles.mealTypeButtonText,
                      mealType === type
                        ? styles.mealTypeButtonTextActive
                        : styles.mealTypeButtonTextInactive,
                    ]}>
                    {getMealIcon(type)} {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddFood}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  centeredRow: {
    alignItems: "center",
  },
  calorieRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  calorieRingProgress: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
  },
  calorieValue: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "700",
  },
  calorieMeta: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statValueAccent: {
    color: Colors.accent,
  },
  statValuePrimary: {
    color: Colors.primary,
  },
  statValueSecondary: {
    color: Colors.secondary,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  mealSection: {
    marginTop: 16,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mealHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  mealTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  mealCalories: {
    color: Colors.textSecondary,
  },
  foodCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    color: Colors.text,
    fontWeight: "600",
  },
  foodDetail: {
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyMealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  emptyMealText: {
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 24,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  inputLabel: {
    color: Colors.text,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  mealTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  mealTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  mealTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  mealTypeButtonInactive: {
    backgroundColor: Colors.card,
  },
  mealTypeButtonText: {
    textTransform: "capitalize",
  },
  mealTypeButtonTextActive: {
    color: Colors.text,
  },
  mealTypeButtonTextInactive: {
    color: Colors.textSecondary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 18,
  },
});
