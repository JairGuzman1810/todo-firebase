import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { RootStackParamList, Todo } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
type ListProps = NativeStackScreenProps<RootStackParamList, 'MyTodos'>;

const List: FC<ListProps> = ({navigation}) => {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>('');
  

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const todosSnapshot: Todo[] = [];
        snapshot.docs.forEach(doc => {
          todosSnapshot.push({
            id: doc.id,
            ...doc.data() as Todo
          });
        });
        setTodos(todosSnapshot);
        console.log(todosSnapshot);
      }
    });

    return () => subscriber();
  }, []);
  const addNewTodo = async () => {
    const doc = await addDoc(collection(FIRESTORE_DB, 'todos'), {title: todo, done: false})
    console.log(doc);
    setTodo('');
  }


  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput 
        style={styles.input}  
        value={todo}
        placeholder="Add new todo"
        onChangeText={(text:string) => setTodo(text)}/>
        <View style={styles.buttoncontainer}>
        <Button title="Add todo" onPress={addNewTodo} disabled={todo === ''}></Button>
        </View>
      </View>
      
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container:{
    marginHorizontal: 20,
    
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  input: {
    flex:1,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 10,
  },
  buttoncontainer:{
    marginLeft: 12,
  }
})
