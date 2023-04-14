import { StyleSheet, Text, View, StatusBar, SafeAreaView } from "react-native";
import React from "react";

import SearchBar from "../components/SearchBar";

const Playlist = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>

      <SearchBar title={"Playlist"} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Playlist</Text>
      </View>
    </SafeAreaView>
  );
};

export default Playlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
