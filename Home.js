import React, { useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import Response from "./response"; // Ensure the path is correct based on your project structure
import Message from "./message"; // Ensure the path is correct based on your project structure

const HomeScreen = () => {
  const [inputText, setInputText] = useState("");
  const [listData, setListData] = useState([]);

  const SearchInput = () => {
    if (inputText.trim()) {
      setListData((prevList) => [...prevList, inputText]);
      setInputText("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 300} 
    >
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/robot.png")} style={styles.icon} />
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#323232" }}>AgriGuard</Text>
      </View>

      {/* Content */}
      <FlatList
        style={{ paddingHorizontal: 16, marginBottom: 80 }}
        data={listData}
        renderItem={({ item }) => (
          <View>
            <Message message={item} />
            <Response prompt={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Search-Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Ask for farming insights..."
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          selectionColor={"#323232"}
        />
        <TouchableOpacity onPress={SearchInput}>
          <Image source={require("../assets/right-arrow.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 8,
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    width: "100%",
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 0.1,
  },
});

export default HomeScreen;
