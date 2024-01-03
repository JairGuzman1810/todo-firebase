import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { RootStackParamList, Todo } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import ListItem from "../../components/ListItem";

const List = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, "todos");
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const todosSnapshot: Todo[] = [];
        snapshot.docs.forEach((doc) => {
          todosSnapshot.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
          //Se convierte as Todo para que cumpla con la estructura del tipo
        });
        setTodos(todosSnapshot);
      },
    });

    return () => subscriber();
  }, []);
  const addNewTodo = async () => {
    await addDoc(collection(FIRESTORE_DB, "todos"), {
      title: todo,
      done: false,
    });
    setTodo("");
  };

  const handleDelete = (ref: DocumentReference<DocumentData, DocumentData>) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // User clicked on "Delete"
            await deleteDoc(ref);
            Alert.alert("Task deleted successfully");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMark = async (
    ref: DocumentReference<DocumentData, DocumentData>,
    item: Todo
  ) => {
    await updateDoc(ref, { done: !item.done });
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={todo}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
        />
        <View style={styles.buttoncontainer}>
          <Button
            title="Add todo"
            onPress={addNewTodo}
            disabled={todo === ""}
          ></Button>
        </View>
      </View>
      <View style={styles.scrollcontainer}>
        {/* Se pasan los elementos a la función que se hace cargo de proyectarlos y en data se pasan los elementos. */}
        <FlatList
          data={todos}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyExtractor={(todo: Todo) => todo.id}
          renderItem={({ item }) => (
            <ListItem item={item} onDelete={handleDelete} onMark={handleMark} />
          )}
        />
      </View>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
    padding: 10,
  },
  buttoncontainer: {
    marginLeft: 12,
  },
  scrollcontainer: {
    flex: 1,
  },
});
