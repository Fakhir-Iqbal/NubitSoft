import React, { useState } from "react";
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { useAuth } from "./AuthContext";

const Page = () => {
  const [username, setUsername] = useState("Gohar");
  const [password, setPassword] = useState("123");

  const { onLogin } = useAuth();

  const onSignInPress = async () => {
    onLogin!(username, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <Text style={styles.header}>My Epic App</Text> */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://s.mustakbil.com/employers/d14def2517b8427cacd10fd53c247e21.jpg",
          }}
          style={styles.image}
        />
      </View>

      <TextInput
        autoCapitalize="none"
        placeholder="admin"
        value={username}
        onChangeText={setUsername}
        style={styles.inputField}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={{ color: "#fff" }}>Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingHorizontal: "20%",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 40,
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#175E96",
    padding: 12,
    borderRadius: 4,
  },
});
export default Page;
