import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import API from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";

export default function MarkAttendance() {
  const [user, setUser] = useState<any>(null);
  const [load, setLoad] = useState<any>(true);
  const [sendto, setSendto] = useState<any>("");

  const getData = async (value: any) => {
    try {
      let data = await AsyncStorage.getItem(value);
      setUser(data);
    } catch (e) {}
  };

  const checkDetails = async () => {
    if (!user) return;
    try {
      const employeeID = JSON.parse(user).employeeid;
      const res = await API({}).getAttendaceDetails(employeeID);
      if (res?.data?.message === "timein") {
        setSendto("TimeIn");
      } else if (res?.data?.message === "timeout") {
        setSendto("TimeOut");
      } else if (res?.data?.message === "Already Marked") {
        setSendto("Already Marked");
      }
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData("user");
    checkDetails();
  }, []);
  useEffect(() => {
    checkDetails();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://s.mustakbil.com/employers/d14def2517b8427cacd10fd53c247e21.jpg",
          }}
          style={styles.reactLogo}
        />

        <View style={styles.qrImageContainer}>
          <Image
            source={{
              uri: "https://t3.ftcdn.net/jpg/02/23/88/58/360_F_223885881_Zotk7yyvWJDvq6iWq2A9XU60iVJEnrzC.jpg",
            }}
            style={styles.reactLogo}
          />
          {!sendto ? (
            <Loader />
          ) : (
            <>
              {sendto === "TimeIn" && (
                <Link style={styles.button} href="/(outQr)">
                  <Text style={styles.text}>Mark Check out</Text>
                </Link>
              )}
              {sendto === "TimeOut" && (
                <Link style={styles.button} href="/(scanQr)">
                  <Text style={styles.text}>Mark Attendance</Text>
                </Link>
              )}
              {sendto === "Already Marked" && (
                <Text style={styles.button}>
                  <Text style={styles.text}>Already Marked</Text>
                </Text>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.bottomImageContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYM3FDaXQWS9nxHYKLIxR-bBu6Z0P8BwGMug&s",
          }}
          style={styles.bottomImage}
        />
        <Text style={styles.BottomText}>powered by Nubit Soft</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  imageContainer: {
    // backgroundColor : "yellow",
    alignItems: "center",
    width: "100%",
    marginTop: 44,
  },
  reactLogo: {
    height: 140,
    width: 220,
    marginBottom: 12,
  },
  qrImageContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  button: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 68,
    borderRadius: 100,
    elevation: 3,
    backgroundColor: "#1E5890",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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
  BottomText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
