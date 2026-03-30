import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { DAYS, getWorkoutByDay } from "../../constants/workouts";

export default function HomeScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayWorkout = getWorkoutByDay(today);

  const getDayIcon = (day: string) => {
    const workout = getWorkoutByDay(day);
    if (!workout) return "📅";
    if (workout.muscle.includes("Chest")) return "💪";
    if (workout.muscle.includes("Back")) return "🦾";
    if (workout.muscle.includes("Shoulders")) return "🏋️";
    if (workout.muscle.includes("Legs")) return "🦵";
    if (workout.muscle.includes("Arms")) return "💥";
    if (workout.muscle.includes("Abs")) return "🔥";
    return "💪";
  };

  const handleDayPress = (day: string) => {
    router.push(`/workout/${day}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Welcome Back</Text>
          <Text style={styles.headerTitle}>Select Your Workout</Text>
        </View>

        <View style={styles.todayCard}>
          <View style={styles.todayIconCircle}>
            <Ionicons name="today-outline" size={28} color={Colors.text} />
          </View>
          <View style={styles.todayTextContainer}>
            <Text style={styles.todayLabel}>Today is</Text>
            <Text style={styles.todayValue}>{today}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDayPress(todayWorkout ? today : DAYS[0])}
            style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Weekly Schedule</Text>

        {DAYS.map((day) => {
          const workout = getWorkoutByDay(day);
          const isToday = day === today && !!todayWorkout;

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDayPress(day)}
              style={[
                styles.dayCard,
                isToday ? styles.dayCardToday : styles.dayCardDefault,
              ]}>
              <View
                style={[
                  styles.dayIconContainer,
                  isToday ? styles.dayIconToday : styles.dayIconDefault,
                ]}>
                <Text style={styles.dayEmoji}>{getDayIcon(day)}</Text>
              </View>
              <View style={styles.dayInfo}>
                <View style={styles.dayTitleRow}>
                  <Text
                    style={[
                      styles.dayTitle,
                      isToday ? styles.dayTitleToday : styles.dayTitleDefault,
                    ]}>
                    {day}
                  </Text>
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>TODAY</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.dayMuscle}>
                  {workout?.muscle || "Rest Day"}
                </Text>
                <Text style={styles.dayExercises}>
                  {workout?.exercises.length || 0} exercises
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}

        <View style={styles.bottomSpacer} />
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
  todayCard: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todayIconCircle: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  todayTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  todayLabel: {
    color: Colors.textSecondary,
  },
  todayValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  startButtonText: {
    color: Colors.text,
    fontWeight: "600",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayCardDefault: {
    backgroundColor: Colors.surface,
  },
  dayCardToday: {
    backgroundColor: "rgba(249, 115, 22, 0.16)",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dayIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dayIconDefault: {
    backgroundColor: Colors.card,
  },
  dayIconToday: {
    backgroundColor: Colors.primary,
  },
  dayEmoji: {
    fontSize: 24,
  },
  dayInfo: {
    marginLeft: 16,
    flex: 1,
  },
  dayTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  dayTitleDefault: {
    color: Colors.text,
  },
  dayTitleToday: {
    color: Colors.primary,
  },
  todayBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  todayBadgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  dayMuscle: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  dayExercises: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 16,
  },
});
