import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Api = "https://webapi.nubitsoft.com/api"; // SYSTEM ACCESS IP
const Api2 = "https://api.nubitsoft.com"; // SYSTEM ACCESS IP
// const Api2 = 'http://192.168.100.5:8000'; // SYSTEM ACCESS IP
// https://nubitapi.stockguess.com

const fetchJSONwithouttoken = async ({ url }: any) => {
  const res = await axios(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return axios.get(url);
};

const fetchJSONPOSTwithbodywithouttoken = async ({ url, body }: any) => {
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  return axios.post(url, JSON.stringify(body), axiosConfig);
};
const fetchJSON = async ({ url }: any) => {
  let res;
  await AsyncStorage.getItem("token").then(async (e: any) => {
    // console.log(e, 'check token');
    let res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        'Accept': 'application/json',
        // prettier-ignore
        'Authorization': `Bearer ${e}`,
      },
    });
    res = await res.json();
  });
  return res;
};
const fetchJSONPOSTwithbody = async ({ url, body }: any) => {
  let res;
  await AsyncStorage.getItem("token").then(async (e: any) => {
    // console.log(e, 'chekingToken');
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        'Authorization': `Bearer ${e}`,
        // prettier-ignore
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    res = res.json();
  });
  // console.log(res, 'cccccccccccsssssss');
  return res;
};

const API = (credentials: any) => ({
  // ############################
  // ######## Get Apies #########
  // ############################
  getlanguage: (value: any) =>
    fetchJSONwithouttoken({ url: `${Api}/language?lang=${value}` }),
  getUserprofile: (id: any) =>
    fetchJSON({ url: `${Api}/user_profile_details/${id}` }),
  getMydetails: () => fetchJSON({ url: `${Api}/Authenticate/Me` }),
  getAttendaceDetails: (_id: any) =>
    fetchJSONwithouttoken({ url: `${Api2}/Attendancedetail?id=${_id}` }),
  getPayslip: (_mail: any, _month: any, _year: any) =>
    fetchJSONwithouttoken({
      url: `${Api2}/payslip?mail=${_mail}&month_name=${_month}&year=${_year}`,
    }),
  getTask: (_id: any, _date: any) =>
    fetchJSONwithouttoken({
      url: `${Api2}/gettask?id=${_id}`,
    }),

  updatestatus: (_status: any, _id: any) =>
    fetchJSONwithouttoken({
      url: `${Api2}/updatestatus?status=${_status}&id=${_id}`,
    }),
  updateFCM: (token: any, _mail: any, _id: any) =>
    fetchJSONwithouttoken({
      url: `${Api2}/fcm?token=${token}&mail=${_mail}&id=${_id}`,
    }),
  // ############################
  // ######## Post Apies ########
  // ############################

  Signin: (_email: any, _password: any) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api}/Authenticate/Login`,
      body: {
        Username: _email,
        Password: _password,
      },
    }),
  getMonthDetails: (_fromdate: any, _todate: any, _userid: any) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api2}/GetMonthsdetail`,
      body: {
        fromdate: _fromdate,
        todate: _todate,
        userid: _userid,
      },
    }),

  GetLeaves: (_todaydate: any, _userid: any) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api2}/GetLeaves`,
      body: {
        todaydate: _todaydate,
        userid: _userid,
      },
    }),
  UpdateError: (_userID: any, _details: any) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api2}/ErrorLogs`,
      body: {
        id: _userID,
        det: _details,
      },
    }),

  MarkAttendanceIn: (
    _id: any,
    _lat: any,
    _long: any,
    nameinternet: any,
    typeinternet: any,
    _ip: any,
    _userid: any
  ) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api2}/Attendancein`,
      body: {
        id: _id,
        internetname: nameinternet,
        internettype: typeinternet,
        Latitudße: _lat,
        Longitude: _long,
        ip: _ip,
        userid: _userid,
      },
    }),
  MarkAttendanceOut: (
    _id: any,
    _lat: any,
    _long: any,
    nameinternet: any,
    typeinternet: any,
    _ip: any,
    det: any
  ) =>
    fetchJSONPOSTwithbodywithouttoken({
      url: `${Api2}/Attendanceout`,
      body: {
        id: _id,
        TimeOutInternetName: nameinternet,
        TimeOutInternetType: typeinternet,
        TimeOutlatitude: _lat,
        TimeOutlongitute: _long,
        ip: _ip,
        workDetail: det,
      },
    }),
});

export default API;
