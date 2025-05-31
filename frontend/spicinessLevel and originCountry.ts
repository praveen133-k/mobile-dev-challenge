import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack } from "expo-router";

// Replace with your actual backend enum options if different
const ORIGIN_COUNTRIES = [
  "All",
  "Japan",
  "Korea",
  "China",
  "Thailand",
  "Other",
];

export default function NoodleListScreen() {
  const [spicinessLevel, setSpicinessLevel] = useState<string>("");
  const [originCountry, setOriginCountry] = useState<string>("All");

  // Prepare variables for the query
  const variables: any = {};
  if (spicinessLevel) variables.spicinessLevel = parseInt(spicinessLevel, 10);
  if (originCountry && originCountry !== "All")
    variables.originCountry = originCountry;

  const { loading, error, data } = useQuery<{
    instantNoodles: { id: string; name: string }[];
  }>(GET_NOODLES, { variables });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Noodles" }} />

      {/* Filter UI */}
      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.label}>Spiciness Level:</Text>
          <TextInput
            style={styles.input}
            placeholder="Any"
            keyboardType="numeric"
            value={spicinessLevel}
            onChangeText={setSpicinessLevel}
          />
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.label}>Origin Country:</Text>
          <Picker
            selectedValue={originCountry}
            style={styles.picker}
            onValueChange={setOriginCountry}
          >
            {ORIGIN_COUNTRIES.map((country) => (
              <Picker.Item key={country} label={country} value={country} />
            ))}
          </Picker>
        </View>
      </View>

      <FlatList
        data={data?.instantNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoodleItem {...item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
      />
      {loading && <ActivityIndicator style={styles.loader} size="large" />}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", padding: 16 },
  filters: { marginBottom: 16 },
  filterRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: { width: 120 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
  },
  picker: { flex: 1, marginLeft: 8 },
});