import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
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
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [internetType, setInternettype] = useState<any>(null);
  const [load, setLoad] = useState<any>(true);
  const [sendto, setSendto] = useState<any>("");
  const [allAttendanceKey, setAllAttendanceKey] = useState<any>(null);
  const [details, setDetails] = useState<any>("");
  const [showQr, setShowQr] = useState<any>(false);

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

  //  userData.employeeid,
  //         location.latitude,
  //         location.longitude,
  //         internettype.name,
  //         internettype.type,
  //         internettype.myip,
  //         details,
  //         userData.userid,

  const onSuccess = async (e: any) => {
    if (e === "MARKATTENDANCENUBITHOME") {
      if (sendto === "TimeOut") {
        const res = await API({}).MarkAttendanceOut(
          allAttendanceKey.employeeId,
          allAttendanceKey.latitude,
          allAttendanceKey.longitude,
          allAttendanceKey.internetname,
          allAttendanceKey.type,
          allAttendanceKey.ip,
          details
        );
        if (res.data.message === "marked") {
          Alert.alert("Attendance Marked", "Successfully Timed Out", [
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
      } else if (sendto == "TimeIn") {
        router.push("/(scanQr)"); // if out go to anotherr
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
        setErrorMsg("Permission to access location was denied");
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
    setScanned(true);
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

  const isFilledDetails = () => {
    if (details && details.trim().length > 0) {
      setShowQr(true);
    } else {
      Alert.alert(
        "Incomplete Submission",
        "Please provide details of today's work before submitting."
      );
    }
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
      {showQr ? (
        <>
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
        </>
      ) : (
        <View style={styles.topContainer}>
          {/* <View style={styles.InputContainer}> */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter description of what is done today"
            value={details}
            onChangeText={(text) => setDetails(text)}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={isFilledDetails}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          {/* </View> */}
        </View>
      )}
      {/* <View>
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
      </View>
      <View style={styles.topContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter description of what is done today"
          value={details}
          onChangeText={(text) => setDetails(text)}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={call}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View> */}
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
  // InputContainer: {
  //   borderColor: "gray",
  //   borderWidth: 1,
  //   padding: 6,
  //   borderRadius: 6,
  // },
  textInput: {
    borderRadius: 4,
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
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
    borderRadius: 6,
    marginTop: 12,
    backgroundColor: "#1E5890",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    textAlign: "center",
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
  topContainer: {
    width: "90%",
    justifyContent: "center",
    flex: 1,
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
