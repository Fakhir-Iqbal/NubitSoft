import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import "react-native-reanimated";

import CustomDrawerContent from "@/components/CustomDrawerContent";
import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    console.error("Fonts not loaded!");
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props): any => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }: any) => (
              <MaterialCommunityIcons
                name="tablet-dashboard"
                size={size}
                color={color}
              />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
        {/* <Drawer.Screen
          name="(home)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }: any) => (
              <MaterialCommunityIcons
                name="tablet-dashboard"
                size={size}
                color={color}
              />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        /> */}
        <Drawer.Screen
          name="(paySlip)"
          options={{
            drawerLabel: "Pay Slip",
            title: "Pay Slip",
            drawerIcon: ({ color, size }: any) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
        <Drawer.Screen
          name="(myTask)"
          options={{
            drawerLabel: "My Task",
            title: "Assigned Tasks",
            drawerIcon: ({ color, size }: any) => (
              <MaterialIcons name="add-task" size={size} color={color} />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
        <Drawer.Screen
          name="(markAttendance)"
          options={{
            drawerLabel: "Mark Attendance",
            title: "Attendance",
            drawerIcon: ({ color, size }: any) => (
              <FontAwesome5 name="marker" size={size} color={color} />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
        <Drawer.Screen
          name="(attendanceReport)"
          options={{
            drawerLabel: "Attendance Report",
            title: "Attendance Report",
            drawerIcon: ({ color, size }: any) => (
              <Entypo name="area-graph" size={size} color={color} />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
        <Drawer.Screen
          name="(request)"
          options={{
            drawerLabel: "Request",
            title: "Request",
            drawerIcon: ({ color, size }: any) => (
              <FontAwesome6 name="user-clock" size={size} color={color} />
            ),
            drawerActiveBackgroundColor: "#175E96",
            drawerActiveTintColor: "white",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
