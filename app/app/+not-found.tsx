import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not found</Text>
      <Link href="/" style={styles.link}>
        Go back
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#E0E0E0",
    fontSize: 18,
    fontWeight: "300",
  },
  link: {
    color: "#666666",
    marginTop: 16,
    fontSize: 14,
  },
});
