import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loader = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#1E5890" />
  </View>
);

const Loader_S = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator color="#1e5890" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default Loader;
export { Loader_S };
