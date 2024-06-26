import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../app/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawer(props: any) {
  const navigation = useNavigation();
  const { authState, onLogout } = useAuth();
  const [user, setUser] = useState<any>();

  const onLogoutPressed = () => {
    onLogout!();
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        const data = await AsyncStorage.getItem("user");

        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* Top content of drawer */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://s.mustakbil.com/employers/d14def2517b8427cacd10fd53c247e21.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileTitle}>{user ? user.name : "Adham"}</Text>
          {/* <Text style={styles.profileBio}>
            Software Developer at Nubit Software
          </Text> */}
        </View>
        {/* Drawer items */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.bottomContainer}>
        {/* Bottom content of drawer */}
        <TouchableOpacity style={styles.signOutBtn} onPress={onLogoutPressed}>
          <MaterialIcons
            name="logout"
            size={24}
            color="#2F2F2F"
            style={styles.signOutIcon}
          />
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>
        <Image
          source={{
            uri: "https://www.softwaredoit.es/logotipos/nubit-consulting.jpg?t=2023-03-29_15_43_10",
          }}
          style={styles.bottomImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  profileImage: {
    width: 140,
    height: 80,
  },
  profileTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  profileBio: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: "#2F2F2F", // Default color for item text
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  signOutBtnText: {
    color: "#2F2F2F",
    marginLeft: 10,
  },
  signOutIcon: {
    marginRight: 10,
  },
  bottomImage: {
    width: "100%",
    height: 80,
    marginTop: 10,
  },
});