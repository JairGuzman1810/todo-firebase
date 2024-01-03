import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { FC, useState } from "react";
import { RootStackParamList } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ListProps = NativeStackNavigationProp<RootStackParamList, "Login">;

import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

const Login = () => {
  const { navigate } = useNavigation<ListProps>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const auth = FIREBASE_AUTH;

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) {
        // The user is authenticated successfully
        console.log("Login successful:", response.user);
        navigate("MyTodos");
      } else {
        // Something unexpected happened, and the user is not authenticated
        console.log("Unexpected response:", response);
        Alert.alert("Sign in failed", "Unexpected response. Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Sign in failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      signOut(FIREBASE_AUTH);
      Alert.alert("Check your email!");
    } catch (error) {
      console.log(error);
      Alert.alert("Account not created due a error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome!</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={"#CCCCCC"}
            style={styles.inputField}
            value={email}
            onChangeText={(text: string) => setEmail(text)}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={"#CCCCCC"}
            secureTextEntry
            style={styles.inputField}
            value={password}
            onChangeText={(text: string) => setPassword(text)}
          />
          {loading ? (
            // Show ActivityIndicator when loading is true
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            // Show buttons when loading is false
            <View>
              <TouchableOpacity
                disabled={email === "" || password === ""}
                style={
                  email === "" || password === ""
                    ? styles.buttondisable
                    : styles.button
                }
                onPress={SignIn}
              >
                <Text
                  style={
                    email === "" || password === ""
                      ? styles.buttonTextDisable
                      : styles.buttonText
                  }
                >
                  Sign in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={email === "" || password === ""}
                style={
                  email === "" || password === ""
                    ? styles.buttondisable
                    : styles.button
                }
                onPress={createAccount}
              >
                <Text
                  style={
                    email === "" || password === ""
                      ? styles.buttonTextDisable
                      : styles.buttonText
                  }
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F0F8FF", // Light blue
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF", // Slightly darker shade
    borderRadius: 5,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#000", // White
    fontWeight: "300",
    marginBottom: 10,
  },
  inputField: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3498DB", // Primary brand color (blue)
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White
    fontSize: 16,
    fontWeight: "bold",
  },
  buttondisable: {
    backgroundColor: "#e0e0e0", // Primary brand color (blue)
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonTextDisable: {
    color: "#808080", // White
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
