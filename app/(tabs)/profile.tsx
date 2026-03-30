import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { UserProfile } from "../../types";
import {
  calculateDailyCalories,
  calculateWaterIntake,
} from "../../utils/calculations";
import { getUserProfile, saveUserProfile } from "../../utils/storage";

type ActivityLevel = UserProfile["activityLevel"];
type Goal = UserProfile["goal"];
type Gender = UserProfile["gender"];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 25,
    weight: 70,
    height: 170,
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain",
    dailyCalorieGoal: 2000,
    dailyWaterGoal: 2500,
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    const savedProfile = await getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setHasProfile(true);
    } else {
      setIsEditing(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    const calorieGoal = calculateDailyCalories(profile);
    const waterGoal = calculateWaterIntake(profile.weight);

    const updatedProfile: UserProfile = {
      ...profile,
      dailyCalorieGoal: calorieGoal,
      dailyWaterGoal: waterGoal,
    };

    await saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setHasProfile(true);
    setIsEditing(false);
    Alert.alert("Success", "Profile saved successfully!");
  };

  const activityLevels: { value: ActivityLevel; label: string }[] = [
    { value: "sedentary", label: "Sedentary" },
    { value: "light", label: "Light" },
    { value: "moderate", label: "Moderate" },
    { value: "active", label: "Active" },
    { value: "veryActive", label: "Very Active" },
  ];

  const goals: { value: Goal; label: string; icon: string }[] = [
    { value: "lose", label: "Lose Weight", icon: "📉" },
    { value: "maintain", label: "Maintain", icon: "⚖️" },
    { value: "gain", label: "Gain Weight", icon: "📈" },
  ];

  const genders: { value: Gender; label: string; icon: string }[] = [
    { value: "male", label: "Male", icon: "👨" },
    { value: "female", label: "Female", icon: "👩" },
  ];

  if (!isEditing && hasProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>Your Profile</Text>
            <Text style={styles.headerTitle}>{profile.name}</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>
                  {profile.gender === "male" ? "👨" : "👩"}
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.metricValue}>{profile.age}</Text>
                <Text style={styles.metricLabel}>Years Old</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons
                  name="barbell-outline"
                  size={24}
                  color={Colors.accent}
                />
                <Text style={styles.metricValue}>{profile.weight}</Text>
                <Text style={styles.metricLabel}>kg</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons
                  name="resize-outline"
                  size={24}
                  color={Colors.warning}
                />
                <Text style={styles.metricValue}>{profile.height}</Text>
                <Text style={styles.metricLabel}>cm</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons
                  name="walk-outline"
                  size={24}
                  color={Colors.secondary}
                />
                <Text style={styles.metricValueSmall}>
                  {profile.activityLevel}
                </Text>
                <Text style={styles.metricLabel}>Activity</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Daily Goals</Text>

          <View style={styles.goalsCard}>
            <View style={styles.goalRow}>
              <View style={[styles.goalIconCircle, styles.goalIconPrimary]}>
                <Text style={styles.goalIconText}>🔥</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>Calorie Goal</Text>
                <Text style={[styles.goalValue, styles.goalValuePrimary]}>
                  {profile.dailyCalorieGoal} cal/day
                </Text>
              </View>
            </View>

            <View style={styles.goalRow}>
              <View style={[styles.goalIconCircle, styles.goalIconBlue]}>
                <Text style={styles.goalIconText}>💧</Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>Water Goal</Text>
                <Text style={[styles.goalValue, styles.goalValueBlue]}>
                  {profile.dailyWaterGoal} ml/day
                </Text>
              </View>
            </View>

            <View style={styles.goalRowNoMargin}>
              <View style={[styles.goalIconCircle, styles.goalIconAccent]}>
                <Text style={styles.goalIconText}>
                  {goals.find((g) => g.value === profile.goal)?.icon}
                </Text>
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalLabel}>Fitness Goal</Text>
                <Text style={[styles.goalValue, styles.goalValueAccent]}>
                  {goals.find((g) => g.value === profile.goal)?.label}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.primaryButton}>
            <Ionicons name="create-outline" size={24} color={Colors.text} />
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            {hasProfile ? "Edit Profile" : "Create Profile"}
          </Text>
          <Text style={styles.headerTitle}>Your Information</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textSecondary}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
          />

          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {genders.map((g, index) => (
              <TouchableOpacity
                key={g.value}
                onPress={() => setProfile({ ...profile, gender: g.value })}
                style={[
                  styles.genderButton,
                  index < genders.length - 1 && styles.genderButtonSpacing,
                  profile.gender === g.value
                    ? styles.choiceActive
                    : styles.choiceInactive,
                ]}>
                <Text style={styles.choiceEmoji}>{g.icon}</Text>
                <Text
                  style={
                    profile.gender === g.value
                      ? styles.choiceTextActive
                      : styles.choiceTextInactive
                  }>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={[styles.halfField, styles.halfFieldRightGap]}>
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput
                style={styles.inputNoBottom}
                placeholder="Age"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={profile.age.toString()}
                onChangeText={(text) =>
                  setProfile({ ...profile, age: parseInt(text, 10) || 0 })
                }
              />
            </View>
            <View style={[styles.halfField, styles.halfFieldLeftGap]}>
              <Text style={styles.fieldLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.inputNoBottom}
                placeholder="Weight"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={profile.weight.toString()}
                onChangeText={(text) =>
                  setProfile({ ...profile, weight: parseInt(text, 10) || 0 })
                }
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Height"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            value={profile.height.toString()}
            onChangeText={(text) =>
              setProfile({ ...profile, height: parseInt(text, 10) || 0 })
            }
          />

          <Text style={styles.fieldLabel}>Activity Level</Text>
          <View style={styles.activityWrap}>
            {activityLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                onPress={() =>
                  setProfile({ ...profile, activityLevel: level.value })
                }
                style={[
                  styles.activityChip,
                  profile.activityLevel === level.value
                    ? styles.choiceActive
                    : styles.choiceInactive,
                ]}>
                <Text
                  style={
                    profile.activityLevel === level.value
                      ? styles.choiceTextActive
                      : styles.choiceTextInactive
                  }>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Fitness Goal</Text>
          <View style={styles.goalChoiceRow}>
            {goals.map((g, index) => (
              <TouchableOpacity
                key={g.value}
                onPress={() => setProfile({ ...profile, goal: g.value })}
                style={[
                  styles.goalChoice,
                  index < goals.length - 1 && styles.goalChoiceSpacing,
                  profile.goal === g.value
                    ? styles.choiceActive
                    : styles.choiceInactive,
                ]}>
                <Text style={styles.choiceEmoji}>{g.icon}</Text>
                <Text
                  style={[
                    styles.goalChoiceText,
                    profile.goal === g.value
                      ? styles.choiceTextActive
                      : styles.choiceTextInactive,
                  ]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.primaryButtonCompact}>
          <Ionicons name="save-outline" size={24} color={Colors.text} />
          <Text style={styles.primaryButtonText}>Save Profile</Text>
        </TouchableOpacity>

        {hasProfile && (
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  avatarRow: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 48,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  metricValueSmall: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    textTransform: "capitalize",
  },
  metricLabel: {
    color: Colors.textSecondary,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  goalsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  goalRowNoMargin: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  goalIconPrimary: {
    backgroundColor: "rgba(249, 115, 22, 0.2)",
  },
  goalIconBlue: {
    backgroundColor: "rgba(251, 146, 60, 0.2)",
  },
  goalIconAccent: {
    backgroundColor: "rgba(253, 186, 116, 0.2)",
  },
  goalIconText: {
    fontSize: 24,
  },
  goalInfo: {
    marginLeft: 16,
    flex: 1,
  },
  goalLabel: {
    color: Colors.text,
    fontWeight: "600",
  },
  goalValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  goalValuePrimary: {
    color: Colors.primary,
  },
  goalValueBlue: {
    color: Colors.secondary,
  },
  goalValueAccent: {
    color: Colors.accent,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonCompact: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  fieldLabel: {
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
  inputNoBottom: {
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: 16,
    borderRadius: 12,
  },
  genderRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  genderButtonSpacing: {
    marginRight: 8,
  },
  choiceEmoji: {
    fontSize: 24,
  },
  choiceActive: {
    backgroundColor: Colors.primary,
  },
  choiceInactive: {
    backgroundColor: Colors.card,
  },
  choiceTextActive: {
    color: Colors.text,
  },
  choiceTextInactive: {
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  halfFieldRightGap: {
    marginRight: 8,
  },
  halfFieldLeftGap: {
    marginLeft: 8,
  },
  activityWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  activityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  goalChoiceRow: {
    flexDirection: "row",
  },
  goalChoice: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  goalChoiceSpacing: {
    marginRight: 8,
  },
  goalChoiceText: {
    fontSize: 12,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },
});
