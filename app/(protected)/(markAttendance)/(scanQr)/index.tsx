import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/constants/Api";
import NetInfo from "@react-native-community/netinfo";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function App() {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState<any>(false);
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [internetType, setInternettype] = useState<any>(null);
  const [load, setLoad] = useState<any>(true);
  const [sendto, setSendto] = useState<any>("");
  const [allAttendanceKey, setAllAttendanceKey] = useState<any>(null);


  const router = useRouter();
  const getData = async (value: any) => {
    try {
      let data = await AsyncStorage.getItem(value);
      setUser(data);
    } catch (e) {
      // saving error
    }
  };

  const checkDetails = async () => {
    if (!user) return;
    try {
      const res = await API({}).getAttendaceDetails(
        JSON.parse(user).employeeid
      );
      console.log(res);
      if (res.data.message === "timein") {
        setSendto("TimeIn");
      } else if (res.data.message === "timeout") {
        setSendto("TimeOut");
      } else if (res.data.message === "Already Marked") {
        setSendto("Already Marked");
      }
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onSuccess = async (e: any) => {
    if (e === "MARKATTENDANCENUBITHOME") {
      if (sendto === "TimeOut") {
        const res = await API({}).MarkAttendanceIn(
          allAttendanceKey.employeeId,
          allAttendanceKey.longitude,
          allAttendanceKey.latitude,
          allAttendanceKey.internetname,
          allAttendanceKey.type,
          allAttendanceKey.ip,
          allAttendanceKey.userId
        );
        if (res.data.message === "marked") {
          Alert.alert("Attendance Marked", "Successfully Timed In", [
            {
              text: "Ok",
              style: "cancel",
              onPress: () => setScanned(true),
            },
          ]);
          router.push("/(protected)");
        } else if (res.data.message === "Location is outside of branch") {
          Alert.alert("Location Error", "Location Is Out Of Branch", [
            {
              text: "Ok",
              style: "cancel",
              onPress: () => setScanned(true),
            },
          ]);
        }
      } else if (sendto === "Already Marked") {
        Alert.alert("Already Marked", "You Have Already Marked Attendance");
      }
    } else {
      Alert.alert(
        "Validation Error !",
        "Invalid QR. Please scan valid QR for Attendance.",
        [
          {
            text: "Ok",
            style: "cancel",
            onPress: () => setScanned(true),
          },
        ]
      );
    }
  };

  function call() {
    if (!user || !location || !internetType) {
      Alert.alert("Error", "Please allow location and internet permissions");
      return;
    }

    checkDetails();

    const { employeeid, userid } = JSON.parse(user);
    const val = {
      ...internetType,
      deviceName: Device.brand,
      deviceModel: Device.modelName,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      employeeId: employeeid,
      userId: userid,
    };
    setAllAttendanceKey(val);
  }

  useEffect(() => {
    getData("user");
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "This app needs camera access to scan QR codes.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
      setHasPermission(status === "granted");
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
    })();
    NetInfo.fetch().then((state) => {
      if (state.type === "wifi") {
        setInternettype({
          type: "WIFI",
          internetname: state.details.ssid,
          ip: state.details.ipAddress,
        });
      } else if (state.type === "cellular") {
        setInternettype({
          type: "Cellular",
          internetname: state.details.carrier,
          ip: state.details.cellularGeneration,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user && location && internetType) {
      call();
    }
  }, [user, location, internetType]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    onSuccess("MARKATTENDANCENUBITHOME");
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.qrImageContainer}>
          <Image
            source={{
              uri: "https://t3.ftcdn.net/jpg/02/23/88/58/360_F_223885881_Zotk7yyvWJDvq6iWq2A9XU60iVJEnrzC.jpg",
            }}
            style={styles.qrImage}
          />
          <Text style={styles.text}>Scan me</Text>
        </View>
      </View>
      {renderCamera()}
      {/* <TouchableOpacity style={styles.button} onPress={call}>
        <Text style={styles.buttonText}>Mark</Text>
      </TouchableOpacity> */}
      <View style={styles.bottomImageContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYM3FDaXQWS9nxHYKLIxR-bBu6Z0P8BwGMug&s",
          }}
          style={styles.bottomImage}
        />
        <Text style={styles.BottomText}>Powered by Nubit Soft</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    aspectRatio: 1,
    flex: 1,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "#1E5890",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
    marginVertical: 24,
  },
  qrImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  qrImage: {
    height: 40,
    width: 40,
    marginRight: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#000",
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