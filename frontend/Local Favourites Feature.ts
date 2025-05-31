import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavouritesContextType = {
  favourites: string[];
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
};

const FavouritesContext = createContext<FavouritesContextType>({
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
});

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("favourites").then((data) => {
      if (data) setFavourites(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (id: string) => {
    setFavourites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((fav) => fav !== id));
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
// ...existing imports...
import { FavouritesProvider } from "./context/FavouritesContext";

// ...existing code...
export default function RootLayout() {
  return (
    <FavouritesProvider>
      {/* ...your navigation/components... */}
    </FavouritesProvider>
  );
}
import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "./queries";
import { NoodleItem } from "./components/NoodleItem";
import { Stack, useRouter } from "expo-router";
import { useFavourites } from "./context/FavouritesContext";

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
  const router = useRouter();

  const variables: any = {};
  if (spicinessLevel) variables.spicinessLevel = parseInt(spicinessLevel, 10);
  if (originCountry && originCountry !== "All")
    variables.originCountry = originCountry;

  const { loading, error, data } = useQuery<{ instantNoodles: { id: string; name: string }[] }>(
    GET_NOODLES,
    { variables }
  );

  React.useLayoutEffect(() => {
    router.setOptions?.({
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/favourites")}>
          <Text style={{ marginRight: 16, fontSize: 18 }}>★</Text>
        </TouchableOpacity>
      ),
    });
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Noodles" }} />
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
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import { useFavourites } from "../context/FavouritesContext";
import { GET_NOODLE } from "../queries";

export default function NoodleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_NOODLE, { variables: { id } });
  const { favourites, addFavourite, removeFavourite } = useFavourites();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading noodle.</Text>;

  const noodle = data.instantNoodle;
  const isFavourite = favourites.includes(noodle.id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{noodle.name}</Text>
      {/* ...other details... */}
      <Button
        title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
        onPress={() =>
          isFavourite ? removeFavourite(noodle.id) : addFavourite(noodle.id)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
});
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useFavourites } from "../context/FavouritesContext";
import { useQuery } from "@apollo/client";
import { GET_NOODLES } from "../queries";
import { NoodleItem } from "../components/NoodleItem";

export default function FavouritesScreen() {
  const { favourites, removeFavourite } = useFavourites();

  const { data, loading, error } = useQuery(GET_NOODLES, {
    variables: { ids: favourites },
    skip: favourites.length === 0,
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading favourites.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.instantNoodles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoodleItem {...item}>
            <Text
              style={styles.remove}
              onPress={() => removeFavourite(item.id)}
            >
              Remove
            </Text>
          </NoodleItem>
        )}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  remove: { color: "red", marginTop: 8 },
});
