import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useState } from "react";

import { FontAwesome } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/core";

const Search = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.searchBar}>
        {/* title */}
        <TouchableOpacity
          style={{ paddingHorizontal: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        {/* search button */}
        <TextInput
          style={[
            styles.searchInput,
            {
              borderColor: isFocused ? "#ff8216" : null,
              backgroundColor: isFocused ? "#fff5ed" : "#f5f5f6",
              borderWidth: isFocused ? 1 : 0,
            },
          ]}
          placeholder="Bài hát, nghệ sĩ,..."
          autoFocus={true}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchBar: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 20,
    paddingVertical: 10,
    height: 60,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 15,
  },
});
