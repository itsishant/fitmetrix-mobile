import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { getWorkoutByDay } from "../../constants/workouts";
import { DayWorkout, Exercise } from "../../types";

const FALLBACK_WORKOUT_IMAGE =
  "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function DayWorkoutScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const navigation = useNavigation();
  const [workout, setWorkout] = useState<DayWorkout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [imageFallbackIds, setImageFallbackIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (day) {
      const dayWorkout = getWorkoutByDay(day);
      setWorkout(dayWorkout || null);
      navigation.setOptions({ headerTitle: `${day} - ${dayWorkout?.muscle}` });
    }
  }, [day]);

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const onExerciseImageError = (exerciseId: string) => {
    setImageFallbackIds((prev) => {
      if (prev.has(exerciseId)) return prev;
      const next = new Set(prev);
      next.add(exerciseId);
      return next;
    });
  };

  if (!workout) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>No workout found</Text>
      </View>
    );
  }

  const completedCount = completedExercises.size;
  const totalCount = workout.exercises.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>{workout.muscle}</Text>
          <Text style={styles.summaryCount}>
            {completedCount}/{totalCount} Done
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {workout.exercises.map((exercise: Exercise) => {
        const isCompleted = completedExercises.has(exercise.id);

        return (
          <View
            key={exercise.id}
            style={[
              styles.exerciseCard,
              isCompleted && styles.exerciseCardCompleted,
            ]}>
            <Image
              source={{
                uri: imageFallbackIds.has(exercise.id)
                  ? FALLBACK_WORKOUT_IMAGE
                  : exercise.image,
              }}
              style={styles.exerciseImage}
              resizeMode="cover"
              onError={() => onExerciseImageError(exercise.id)}
            />
            <View style={styles.exerciseContent}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseTitleWrap}>
                  <Text
                    style={[
                      styles.exerciseTitle,
                      isCompleted
                        ? styles.exerciseTitleCompleted
                        : styles.exerciseTitleDefault,
                    ]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleExercise(exercise.id)}
                  style={[
                    styles.checkButton,
                    isCompleted
                      ? styles.checkButtonCompleted
                      : styles.checkButtonDefault,
                  ]}>
                  <Ionicons
                    name={isCompleted ? "checkmark" : "checkmark-outline"}
                    size={24}
                    color={
                      isCompleted ? Colors.background : Colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Sets</Text>
                  <Text style={styles.metaValue}>{exercise.sets}</Text>
                </View>
                <View style={[styles.metaCard, styles.metaCardSpacing]}>
                  <Text style={styles.metaLabel}>Reps</Text>
                  <Text style={styles.metaValue}>{exercise.reps}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}

      {completedCount === totalCount && totalCount > 0 && (
        <View style={styles.completeCard}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Workout Complete!</Text>
          <Text style={styles.completeText}>
            Great job finishing your {workout.muscle} workout!
          </Text>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: Colors.text,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  summaryCount: {
    color: Colors.primary,
    fontWeight: "600",
  },
  progressTrack: {
    height: 12,
    backgroundColor: Colors.card,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  exerciseCardCompleted: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  exerciseImage: {
    width: "100%",
    height: 192,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exerciseTitleWrap: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  exerciseTitleDefault: {
    color: Colors.text,
  },
  exerciseTitleCompleted: {
    color: Colors.accent,
  },
  exerciseDescription: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonDefault: {
    backgroundColor: Colors.card,
  },
  checkButtonCompleted: {
    backgroundColor: Colors.accent,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  metaCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  metaCardSpacing: {
    marginLeft: 12,
  },
  metaLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  metaValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  completeCard: {
    backgroundColor: "rgba(249, 115, 22, 0.18)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  completeEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  completeTitle: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: "700",
  },
  completeText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  bottomSpacer: {
    height: 16,
  },
});
