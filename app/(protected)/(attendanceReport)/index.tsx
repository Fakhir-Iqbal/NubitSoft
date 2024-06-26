import React, { useState, useEffect, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTable from "@/components/Table";
import API from "@/constants/Api";

const fromDate = "31-02-2024";
const toDate = "2024-04-31";
const userId = "1037.0";

// Call the getMonthDetails function
// const callGetMonthDetails = async () => {
//   console.log("success called");
//   try {
//     const api = API({}); // You may need to provide credentials here if required by your API setup
//     const response = await api.getMonthDetails(fromDate, toDate, userId);
//     // const results = await response.data;
//     console.log("Month Details:", response);
//   } catch (error) {
//     console.error("Error fetching month details:", error);
//   }
// };

export default function AttendanceReport() {
  const isFirstRender = useRef(true);
  const [data, setAllData] = useState([
    {
      date: "01-may-2024",
      timeIn: "10:00 am",
      timeOut: "06:00 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
      dayOfWeek: 0,
    },
    {
      date: "02-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: true,
      isAbsent: false,
    },
    {
      date: "03-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "04-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "05-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: true,
      isAbsent: false,
    },
    {
      date: "06-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "07-May-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "08-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "09-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
    },
    {
      date: "10-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
      dayOfWeek: 6,
    },
    {
      date: "11-may-2024",
      timeIn: "10:29 am",
      timeOut: "06:34 pm",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: false,
      dayOfWeek: 0,
    },
    {
      date: "12-may-2024",
      timeIn: "00:00",
      timeOut: "00:00",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: true,
    },
    {
      date: "13-Apr-2024",
      timeIn: "00:00",
      timeOut: "00:00",
      totalHours: "8 hrs",
      isHoliday: false,
      isAbsent: true,
    },
  ]);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const showDatepicker = (type: any) => {
    setShowPicker(type);
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dateFrom;
    setShowPicker(null);
    if (showPicker === "from") {
      setDateFrom(currentDate);
    } else if (showPicker === "to") {
      setDateTo(currentDate);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = item.date;
      const fromDate = formatMe(dateFrom.toString());
      const toDate = formatMe(dateTo.toString());
      return fromDate <= itemDate && toDate >= itemDate;
    });
    setFilteredData(filtered);
  }, [dateFrom, dateTo]);

  const formatDate = (date: any) => {
    // this function format date by pakistani mind set
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function formatMe(date: any) {
    // this function format date "form" to "to" by pakistani mind set
    const d: any = date.split(" ");
    const time: any = `${d[2]}-${d[1]}-${d[3]}`.toLocaleLowerCase();
    return time;
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text style={styles.boxText}>Annual Leaves</Text>
          <Text style={styles.boxText}>
            <Text style={styles.danger}>5</Text> / -1
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxText}>Sick Leaves</Text>
          <Text style={styles.boxText}>0 / 1</Text>
        </View>
      </View>
      <View style={{ ...styles.boxContainer, marginVertical: 14 }}>
        <View style={styles.DateBox}>
          <Text style={styles.dateDoxText}>From :</Text>
          <View style={styles.boxDatePickerContainer}>
            <Text style={styles.cornerText}>Date From</Text>
            <TouchableOpacity
              onPress={() => showDatepicker("from")}
              style={styles.boxDatePicker}
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{formatDate(dateFrom)}</Text>
              <MaterialIcons name="calendar-today" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.DateBox}>
          <Text style={styles.dateDoxText}>To :</Text>
          <View style={styles.boxDatePickerContainer}>
            <Text style={styles.cornerText}>Date To</Text>
            <TouchableOpacity
              onPress={() => showDatepicker("to")}
              style={styles.boxDatePicker}
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{formatDate(dateTo)}</Text>
              <MaterialIcons name="calendar-today" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.tableContainer}>
        <CustomTable data={filteredData} />
      </View>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={showPicker === "from" ? dateFrom : dateTo}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  boxContainer: {
    marginHorizontal: 18,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  box: {
    borderWidth: 2,
    borderColor: "#20588F",
    borderRadius: 6,
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  boxText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  danger: {
    color: "red",
  },
  DateBox: {
    flex: 1,
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
    color: "#808080",
    fontSize: 16,
    paddingVertical: 4,
  },
  tableContainer: {
    flex: 1,
  },
});
