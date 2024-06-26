import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Button,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import API from "@/constants/Api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader";

// const router = useRouter();

async function requestWithMarked(data: any) {
  const {
    id,
    lat,
    lng,
    internetname,
    type,
    ip,
    details,
    date,
    reason,
    reqType,
  } = data;
  // const res = await API({}).MarkAttendanceOut(
  //   id,
  //   lat,
  //   lng,
  //   internetname,
  //   type,
  //   ip,
  //   details
  // );
  const res = {
    data: {
      message: "marked",
    },
  };
  if (res.data.message === "marked") {
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Success",
      textBody: "Your request is in pending",
    });
    return res;
  } else {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Error",
      textBody: "Something error",
    });
    return "error";
  }
}

function isAllKeysFilled(obj: any) {
  const emptyField = Object.keys(obj).find((key: any) => {
    const value = obj[key];
    return value === null || value === "" || value === undefined;
  });
  return emptyField;
}

export default function MarkAttendance() {
  const [location, setLocation] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);
  const [internetDetails, setInternetDetails] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(null);
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [text, onChangeText] = useState("");
  const [reqType, setReqType] = useState(null);
  const [months, setMonths] = useState([
    { label: "Leave Request", value: "leave request" },
    { label: "Late Request", value: "late request" },
  ]);

  const getData = async (value: any) => {
    try {
      let data = await AsyncStorage.getItem(value);
      setUser(data);
    } catch (e) {
      // saving error
    }
  };

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation(null);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }
  useEffect(() => {
    NetInfo.fetch().then((state : any) => {
      if (state.type === "wifi") {
        setInternetDetails({
          type: "WIFI",
          internetname: state.details.ssid,
          ip: state.details.ipAddress,
        });
      } else if (state.type === "cellular") {
        setInternetDetails({
          type: "Cellular",
          internetname: state.details.carrier,
          ip: state.details.cellularGeneration,
        });
      }
    });
    getData("user");
    getLocation();
  }, []);

  const showDatepicker = (type: any) => {
    setShowPicker(type);
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(null);
    setDate(currentDate);
  };

  const form: any = useMemo(() => {
    return {
      reqType,
      date: date.toDateString(),
      reason: text,
    };
  }, [reqType, date, text]);

  const submit = async () => {
    if (location == null) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "please allow location!",
        button: "close",
      });
      return;
    } else {
      const emptyField = isAllKeysFilled(form);

      if (emptyField) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "All fields are required",
          button: "close",
        });
      } else {
        setLoader(true);
        const data = {
          ...form,
          ...internetDetails,
          id: JSON.parse(user)["employeeid"],
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        await requestWithMarked(data);
        setLoader(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <AlertNotificationRoot>
          <View></View>
        </AlertNotificationRoot>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {loader ? (
          <View style={{ flex: 1 }}>
            <Loader />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://s.mustakbil.com/employers/d14def2517b8427cacd10fd53c247e21.jpg",
                }}
                style={styles.reactLogo}
              />
            </View>

            <View style={styles.content}>
              <View>
                <Text style={styles.requestText}>Request Type</Text>
                <View style={styles.picker}>
                  <DropDownPicker
                    open={dropdownOpen}
                    value={reqType}
                    items={months}
                    setOpen={setDropdownOpen}
                    setValue={setReqType}
                    setItems={setMonths}
                    placeholder="Select a month"
                    style={{
                      ...styles.dropdown,
                      backgroundColor: dropdownOpen ? "#BBC4CC" : "#F3F3F3",
                    }}
                    dropDownContainerStyle={styles.menu}
                    textStyle={{ fontSize: 16 }}
                  />
                </View>
              </View>

              <View style={{ marginTop: 18, flex: 1 }}>
                <Text style={styles.requestText}>Request Type</Text>
                <TextInput
                  style={styles.textArea}
                  onChangeText={onChangeText}
                  value={text}
                  numberOfLines={4}
                  placeholder="Description"
                  keyboardType="default"
                  textAlignVertical="top"
                  selectionColor="#000"
                />
              </View>

              <View style={styles.DateBox}>
                <Text style={styles.dateDoxText}>From :</Text>
                <View style={styles.boxDatePickerContainer}>
                  <Text style={styles.cornerText}>Date From</Text>
                  <TouchableOpacity
                    onPress={() => showDatepicker("from")}
                    style={styles.boxDatePicker}
                    activeOpacity={1}
                  >
                    <Text style={styles.buttonText}>{date.toDateString()}</Text>
                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              )}

              <TouchableOpacity style={styles.submitButton} onPress={submit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
  },
  reactLogo: {
    height: 130,
    width: 200,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginHorizontal: 24,
  },
  requestText: {
    marginBottom: 14,
    fontWeight: "bold",
    fontSize: 18,
  },
  picker: {
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 24,
  },
  menu: {
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textArea: {
    paddingVertical: 8,
    flex: 1,
    fontSize: 16,
    width: "100%",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    textAlignVertical: "top",
  },
  DateBox: {
    paddingVertical: 6,
  },
  dateDoxText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  boxDatePickerContainer: {
    borderWidth: 2,
    borderColor: "#808080",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "relative",
  },
  cornerText: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#808080",
    fontWeight: "bold",
  },
  boxDatePicker: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 0,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#295A97",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});