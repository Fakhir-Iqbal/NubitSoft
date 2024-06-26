import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
// import { Role } from "@/constants/Api"; // Ensure you have Role defined properly

const signIn = async ({ username, password }: any) => {
  try {
    const res = await axios.post(
      "https://webapi.nubitsoft.com/api/Authenticate/Login",
      {
        Username: username,
        Password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error signing in:", error);
    Alert.alert("login error", "Wrong username or password!");
    throw error;
  }
};

//  this function is getting user data by using token which is provided by login api...
const authenticateMe = async (token: any) => {
  try {
    const res = await axios.get(
      "https://webapi.nubitsoft.com/api/Authenticate/Me",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.data;
    return result;
  } catch (error) {
    console.error("Error authenticate:", error);
    Alert.alert("Failed to load user data");
  }
};

interface AuthProps {
  authState: {
    authenticated: boolean | null;
    user: object | null;
  };
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
    user: object | null;
  }>({
    authenticated: null,
    user: null,
  });

  const onLogin = async (username: string, password: any) => {
    try {
      const userData = await signIn({ username, password });
      // Assuming your API response structure includes a token and status
      const { token, expiration, status } = userData;

      if (token) {
        console.log("successfully logged in");
        console.log("token", token);
        const res = await authenticateMe(token);

        // Save token and user to AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("expiration", expiration);
        await AsyncStorage.setItem("user", JSON.stringify(res));

        // Update authState with user details
        setAuthState({
          authenticated: true,
          user: res,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const onLogout = async () => {
    // Clear AsyncStorage and reset authState
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("expiration");
    await AsyncStorage.removeItem("user");
    setAuthState({
      authenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};