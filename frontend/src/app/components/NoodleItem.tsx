import { useQuery, gql } from "@apollo/client";
import { View, Text, ScrollView } from "react-native";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      category {
        name
      }
      rating
    }
  }
`;

type Props = {
  id: string;
  name: string; // Optional: can be shown immediately before full details load
};

export function NoodleItem({ id, name }: Props) {
  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
  });

  if (loading) return <Text>{name} (Loading details...)</Text>;
  if (error) return <Text>Error loading {name}</Text>;

  const noodle = data.instantNoodle;

  return (
    <View style={{ padding: 8, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{noodle.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          noodle.brand,
          noodle.originCountry,
          `Spiciness: ${noodle.spicinessLevel}`,
          `Rating: ${noodle.rating}`,
        ]
          .filter(Boolean)
          .map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: "#eee",
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 6,
                borderRadius: 12,
              }}
            >
              <Text>{tag}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
