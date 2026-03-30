import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";
import { UserProfile } from "../types";
import { getUserProfile } from "../utils/storage";

export default function LandingScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    const userProfile = await getUserProfile();
    setProfile(userProfile);
    setLoading(false);
  };

  const handleGetStarted = () => {
    if (profile) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.heroIconWrapper}>
            <Text style={styles.heroIcon}>💪</Text>
          </View>
          <Text style={styles.title}>FitMetrix</Text>
          <Text style={styles.subtitle}>Your Personal Fitness Companion</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View
              style={[styles.featureIconWrapper, styles.featureIconPrimary]}>
              <Text style={styles.featureIconText}>🏋️</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Daily Workouts</Text>
              <Text style={styles.featureDescription}>
                Structured exercises for every day
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, styles.featureCardSpacing]}>
            <View style={[styles.featureIconWrapper, styles.featureIconAccent]}>
              <Text style={styles.featureIconText}>🍎</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Calorie Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor your daily nutrition
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, styles.featureCardSpacing]}>
            <View
              style={[styles.featureIconWrapper, styles.featureIconSecondary]}>
              <Text style={styles.featureIconText}>💧</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Water Intake</Text>
              <Text style={styles.featureDescription}>
                Stay hydrated throughout the day
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleGetStarted} style={styles.ctaButton}>
          <Text style={styles.ctaText}>
            {profile ? "Continue to App" : "Get Started"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: Colors.text,
    fontSize: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  heroIconWrapper: {
    width: 128,
    height: 128,
    backgroundColor: Colors.primary,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heroIcon: {
    fontSize: 60,
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  featureCardSpacing: {
    marginTop: 16,
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureIconPrimary: {
    backgroundColor: "rgba(249, 115, 22, 0.2)",
  },
  featureIconAccent: {
    backgroundColor: "rgba(251, 146, 60, 0.2)",
  },
  featureIconSecondary: {
    backgroundColor: "rgba(253, 186, 116, 0.2)",
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: Colors.text,
    fontWeight: "600",
    fontSize: 18,
  },
  featureDescription: {
    color: Colors.textSecondary,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
});
