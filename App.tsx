import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import List from "./src/views/List";
import Login from "./src/views/Login";
import { RootStackParamList } from "./src/types";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
      // If you want to close the listener after the first call, you can unsubscribe here
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []); // Pass an empty dependency array to run the effect only once

  const handleLogOut = () => {
    signOut(FIREBASE_AUTH);
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="MyTodos"
            component={List}
            options={{
              headerTitle: "MyTodos",
              headerRight: () => (
                <TouchableOpacity
                  onPress={handleLogOut}
                  style={styles.logoutButton}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              ),
            }}
          ></Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: "#007bff", // Button background color
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  logoutButtonText: {
    color: "#fff", // Text color
  },
});
