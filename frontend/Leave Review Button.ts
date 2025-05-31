import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";

const GET_NOODLE = gql`
  query GetNoodle($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      reviewsCount
      // ...other fields as needed
    }
  }
`;

const UPDATE_REVIEWS_COUNT = gql`
  mutation UpdateReviewsCount($id: ID!, $reviewsCount: Int!) {
    updateInstantNoodle(where: { id: $id }, data: { reviewsCount: $reviewsCount }) {
      id
      reviewsCount
    }
  }
`;

export default function NoodleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_NOODLE, { variables: { id } });
  const [updateReviewsCount] = useMutation(UPDATE_REVIEWS_COUNT);

  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading noodle.</Text>;

  const noodle = data.instantNoodle;
  const reviewsCount = optimisticCount ?? noodle.reviewsCount;

  const handleLeaveReview = async () => {
    const newCount = reviewsCount + 1;
    setOptimisticCount(newCount);
    try {
      await updateReviewsCount({
        variables: { id, reviewsCount: newCount },
        optimisticResponse: {
          updateInstantNoodle: {
            id,
            reviewsCount: newCount,
            __typename: "InstantNoodle",
          },
        },
      });
    } catch {
      setOptimisticCount(noodle.reviewsCount); // revert on error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{noodle.name}</Text>
      <Text style={styles.count}>Reviews: {reviewsCount}</Text>
      <Button title="Leave Review" onPress={handleLeaveReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  count: { fontSize: 18, marginVertical: 12 },
});