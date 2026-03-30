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
import { DailyLog, UserProfile, WaterEntry } from "../../types";
import { getProgressPercentage } from "../../utils/calculations";
import {
    addWaterEntry,
    getDailyLog,
    getTodayDate,
    getUserProfile,
    saveUserProfile,
} from "../../utils/storage";

const WATER_AMOUNTS = [
  { amount: 250, label: "Glass", icon: "🥛" },
  { amount: 500, label: "Bottle", icon: "🍼" },
  { amount: 750, label: "Large", icon: "🫗" },
  { amount: 1000, label: "1 Liter", icon: "💧" },
];

const DEFAULT_PROFILE: UserProfile = {
  name: "User",
  age: 25,
  weight: 70,
  height: 170,
  gender: "male",
  activityLevel: "moderate",
  goal: "maintain",
  dailyCalorieGoal: 2000,
  dailyWaterGoal: 2500,
};

export default function WaterScreen() {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [waterGoalInput, setWaterGoalInput] = useState("");

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

  const handleAddWater = async (amount: number) => {
    const now = new Date();
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      date: getTodayDate(),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedLog = await addWaterEntry(getTodayDate(), newEntry);
    setDailyLog(updatedLog);
  };

  const waterGoal = profile?.dailyWaterGoal || 2500;
  const currentWater = dailyLog?.totalWater || 0;
  const progress = getProgressPercentage(currentWater, waterGoal);
  const remaining = Math.max(waterGoal - currentWater, 0);
  const glassesRemaining = Math.ceil(remaining / 250);

  const openWaterGoalEditor = () => {
    setWaterGoalInput(String(waterGoal));
    setGoalModalVisible(true);
  };

  const handleSaveWaterGoal = async () => {
    const parsedGoal = parseInt(waterGoalInput, 10);
    if (isNaN(parsedGoal) || parsedGoal < 500 || parsedGoal > 6000) {
      Alert.alert(
        "Invalid Goal",
        "Enter a water goal between 500 and 6000 ml.",
      );
      return;
    }

    const baseProfile = profile ?? DEFAULT_PROFILE;
    const updatedProfile: UserProfile = {
      ...baseProfile,
      dailyWaterGoal: parsedGoal,
    };

    await saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setGoalModalVisible(false);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const getMotivationalMessage = () => {
    if (progress >= 100) return "🎉 Amazing! You've reached your goal!";
    if (progress >= 75) return "💪 Almost there! Keep it up!";
    if (progress >= 50) return "👍 Halfway done! Stay hydrated!";
    if (progress >= 25) return "🚀 Good start! Keep drinking!";
    return "💧 Start hydrating your body!";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Good {getTimeOfDay()}</Text>
          <Text style={styles.headerTitle}>Water Intake</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.goalRow}>
            <View>
              <Text style={styles.goalLabel}>Daily Goal</Text>
              <Text style={styles.goalValue}>{waterGoal} ml</Text>
            </View>
            <TouchableOpacity
              onPress={openWaterGoalEditor}
              style={styles.goalButton}>
              <Ionicons name="create-outline" size={16} color={Colors.text} />
              <Text style={styles.goalButtonText}>Set Goal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.centeredRow}>
            <View style={styles.waterCircle}>
              <View
                style={[
                  styles.waterFill,
                  { height: `${Math.min(progress, 100)}%` },
                ]}
              />
              <View style={styles.waterCenterContent}>
                <Text style={styles.waterEmoji}>💧</Text>
                <Text style={styles.waterValue}>{currentWater}</Text>
                <Text style={styles.waterMeta}>of {waterGoal} ml</Text>
              </View>
            </View>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{getMotivationalMessage()}</Text>
            {remaining > 0 && (
              <Text style={styles.messageSubText}>
                {glassesRemaining} glass{glassesRemaining > 1 ? "es" : ""} to go
              </Text>
            )}
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor:
                    progress >= 100 ? Colors.accent : Colors.secondary,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>0 ml</Text>
            <Text style={styles.progressLabelText}>{waterGoal} ml</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Add</Text>

        <View style={styles.quickAddGrid}>
          {WATER_AMOUNTS.map((item) => (
            <TouchableOpacity
              key={item.amount}
              onPress={() => handleAddWater(item.amount)}
              style={styles.quickAddCard}>
              <Text style={styles.quickAddIcon}>{item.icon}</Text>
              <Text style={styles.quickAddLabel}>{item.label}</Text>
              <Text style={styles.quickAddAmount}>{item.amount} ml</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitleLogs}>Today's Log</Text>

        {dailyLog?.waterEntries && dailyLog.waterEntries.length > 0 ? (
          [...dailyLog.waterEntries].reverse().map((entry) => (
            <View key={entry.id} style={styles.logCard}>
              <View style={styles.logIconCircle}>
                <Ionicons name="water" size={24} color={Colors.secondary} />
              </View>
              <View style={styles.logInfo}>
                <Text style={styles.logAmount}>{entry.amount} ml</Text>
                <Text style={styles.logTime}>{entry.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="water-outline"
              size={48}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyTextPrimary}>No water logged today</Text>
            <Text style={styles.emptyTextSecondary}>
              Tap above to add water intake
            </Text>
          </View>
        )}

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.textSecondary}
            />
            <Text style={styles.tipHeaderText}>Hydration Tips</Text>
          </View>
          <Text style={styles.tipBody}>
            • Drink water first thing in the morning{"\n"}• Keep a water bottle
            with you{"\n"}• Set reminders to drink regularly{"\n"}• Drink more
            during workouts
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={goalModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setGoalModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Water Goal</Text>
              <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                <Ionicons name="close" size={28} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Daily Goal (ml)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3000"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={waterGoalInput}
              onChangeText={setWaterGoalInput}
            />

            <TouchableOpacity
              onPress={handleSaveWaterGoal}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Save Goal</Text>
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
    paddingBottom: 24,
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
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    textTransform: "uppercase",
  },
  goalValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  goalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  goalButtonText: {
    color: Colors.text,
    fontWeight: "600",
    marginLeft: 6,
  },
  centeredRow: {
    alignItems: "center",
  },
  waterCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  waterFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(249, 115, 22, 0.2)",
  },
  waterCenterContent: {
    alignItems: "center",
    zIndex: 1,
  },
  waterEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  waterValue: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "700",
  },
  waterMeta: {
    color: Colors.textSecondary,
  },
  messageCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  messageText: {
    color: Colors.text,
    textAlign: "center",
    fontSize: 18,
  },
  messageSubText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  progressTrack: {
    height: 16,
    backgroundColor: Colors.card,
    borderRadius: 999,
    marginTop: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabelText: {
    color: Colors.textSecondary,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  quickAddGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAddCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  quickAddIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  quickAddLabel: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 18,
  },
  quickAddAmount: {
    color: Colors.textSecondary,
  },
  sectionTitleLogs: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
  },
  logCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  logIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(249, 115, 22, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  logInfo: {
    marginLeft: 16,
    flex: 1,
  },
  logAmount: {
    color: Colors.text,
    fontWeight: "600",
  },
  logTime: {
    color: Colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyTextPrimary: {
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyTextSecondary: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  tipCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipHeaderText: {
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: "600",
  },
  tipBody: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
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
