import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const TabIcon = ({
  name,
  color,
  focused,
  label,
}: {
  name: IconName;
  color: string;
  focused: boolean;
  label: string;
}) => {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={name} size={20} color={color} />
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={[
          styles.tabIconLabel,
          focused ? styles.tabIconLabelFocused : styles.tabIconLabelInactive,
        ]}>
        {label}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.card,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarItemStyle: {
          paddingHorizontal: 2,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="fitness-outline"
              color={color}
              focused={focused}
              label="Workout"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calories"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="restaurant-outline"
              color={color}
              focused={focused}
              label="Calories"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="water"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="water-outline"
              color={color}
              focused={focused}
              label="Water"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="person-outline"
              color={color}
              focused={focused}
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    width: 68,
  },
  tabIconLabel: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 2,
    textAlign: "center",
  },
  tabIconLabelFocused: {
    color: Colors.primary,
  },
  tabIconLabelInactive: {
    color: Colors.textSecondary,
  },
});
