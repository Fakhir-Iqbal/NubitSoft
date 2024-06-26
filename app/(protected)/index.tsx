import { useAuth } from "../AuthContext";

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Button,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  const { authState, onLogout } = useAuth();
  const [user, setUser] = useState<any>({});

  const getdata = async (value: any) => {
    try {
      let data = await AsyncStorage.getItem(value);
      setUser(data);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    getdata("user");
  }, []);

  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://www.softwaredoit.es/logotipos/nubit-consulting.jpg?t=2023-03-29_15_43_10",
            }}
            style={styles.image}
          />
        </View>

        <Link href="/(markAttendance)" asChild>
          <Pressable style={styles.item}>
            <FontAwesome5 name="marker" size={24} color="#fff" />
            <Text style={styles.title}>Mark Attendance</Text>
          </Pressable>
        </Link>

        <Link href="/(attendanceReport)" asChild>
          <Pressable style={styles.item}>
            <FontAwesome6 name="chart-line" size={24} color="#fff" />
            <Text style={styles.title}>Attendance Report</Text>
          </Pressable>
        </Link>

        <Link href="/(myTask)" asChild>
          <Pressable style={styles.item}>
            <FontAwesome5 name="tasks" size={24} color="#fff" />
            <Text style={styles.title}>My Task</Text>
          </Pressable>
        </Link>

        <Link href="/(paySlip)" asChild>
          <Pressable style={styles.item}>
            <Ionicons name="document-text" size={24} color="#fff" />
            <Text style={styles.title}>Payslip</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.bottomImageContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYM3FDaXQWS9nxHYKLIxR-bBu6Z0P8BwGMug&s",
          }}
          style={styles.bottomImage}
        />
        <Text style={styles.bottomText}>powered by Nubit Soft</Text>
      </View>
    </SafeAreaView>
  );
};

export default Page;

const defaultColor = "#20588F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: defaultColor,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginVertical: 8,
    marginHorizontal: 34,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    width: "80%",
    fontWeight: "bold",
    fontSize: 22,
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  imageContainer: {
    marginHorizontal: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 148,
    resizeMode: "contain",
    width: "100%",
  },
  bottomImageContainer: {
    marginVertical: 16,
    marginHorizontal: 62,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bottomImage: {
    height: 58,
    width: 58,
    marginRight: 12,
  },
  bottomText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
