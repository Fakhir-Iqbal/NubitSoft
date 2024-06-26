import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Table, Row } from "react-native-table-component";

function calculateTotalHours(timeIn: any, timeOut: any) {
  function convertTo24Hour(time12h: any) {
    const [time, period] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
    return `${hours}:${minutes}`;
  }

  const timeIn24 = convertTo24Hour(timeIn);
  const timeOut24 = convertTo24Hour(timeOut);

const timeInDate = new Date(`2000-01-01T${timeIn24}`).getTime();
const timeOutDate = new Date(`2000-01-01T${timeOut24}`).getTime();

  let diffMilliseconds = timeOutDate - timeInDate;

  let totalHours = diffMilliseconds / (1000 * 60 * 60);
  totalHours = Math.round(totalHours * 100) / 100;

  return totalHours;
}

const CustomTable = ({ data }: any) => {
  const [tableHead, setTableHead] = useState<string[]>([
    "#",
    "Date",
    "Time in",
    "Time out",
    "Total Time",
  ]);
  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    const formattedData = data.map((item: any, index: any) => [
      (index + 1).toString(),
      item.date,
      item.isAbsent ? "Absent" : item.timeIn,
      item.isAbsent ? "Absent" : item.timeOut,
      item.isAbsent
        ? "Absent"
        : calculateTotalHours(item.timeIn, item.timeOut) + " hrs",
      item.dayOfWeek,
      item.isHoliday,
      item.isAbsent,
    ]);

    setTableData(formattedData);
  }, [data]);

  const flexArr = [1, 4, 3, 3, 3];

  return (
    <View style={styles.container}>
      <Table>
        <Row
          data={tableHead}
          style={styles.head}
          textStyle={styles.text}
          flexArr={flexArr}
        />
        <ScrollView style={styles.dataWrapper}>
          {tableData?.map((rowData: any, index: any) => (
            <Row
              key={index}
              data={rowData.slice(0, 5)}
              flexArr={flexArr}
              style={{
                ...styles.row,
                ...(rowData[6] && { backgroundColor: "#E0FFB5" }),
                ...(rowData[7] && { backgroundColor: "#C94949" }),
                ...(rowData[5] === 6 && { backgroundColor: "#9ECAFB" }),
                ...(rowData[5] === 0 && { backgroundColor: "#9ECAFB" }),
              }}
              textStyle={styles.contentText}
            />
          ))}
        </ScrollView>
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, marginTop: 0, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#20588F" },
  text: { margin: 6, textAlign: "center", fontWeight: "bold", color: "#fff" },
  contentText: {
    margin: 6,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  dataWrapper: { marginTop: 0 },
  row: { height: 40, backgroundColor: "#fff" },
});

export default CustomTable;
