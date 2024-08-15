import * as React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

export default function Details() {
  const { item: itemParam } = useLocalSearchParams();

  const itemString = Array.isArray(itemParam) ? itemParam[0] : itemParam;

  let item;
  try {
    item = itemString ? JSON.parse(itemString) : null;
  } catch (error) {
    console.error("Error parsing item:", error);
    item = null;
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No se encontraron detalles para mostrar.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.numberOfDays}>
        Número de días: {item.numberOfDays}
      </Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        commodo, urna eu suscipit convallis, dolor turpis pulvinar velit, ut
        consequat libero turpis a leo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 16,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  image: {
    width: width - 48,
    height: width - 48,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#e1e4e8",
  },
  location: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 10,
  },
  numberOfDays: {
    fontSize: 20,
    color: "#7f8c8d",
    marginBottom: 18,
  },
  description: {
    fontSize: 17,
    color: "#34495e",
    textAlign: "center",
    lineHeight: 26,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
  },
});
