import { View, Text, Button, StyleSheet, TextInput, Alert, FlatList } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { RootStackParamList, Todo } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import ListItem from "../../components/ListItem";
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
            ...doc.data() 
          } as Todo);
          //Se convierte as Todo para que cumpla con la estructura del tipo
        });
        setTodos(todosSnapshot);
      }
    });

    return () => subscriber();
  }, []);
  const addNewTodo = async () => {
    const doc = await addDoc(collection(FIRESTORE_DB, 'todos'), {title: todo, done: false})
    console.log(doc);
    setTodo('');
  }

  const handleDelete = async () => {
    Alert.alert('Deleteado');

  }

  const handleMark = async () => {
    Alert.alert('Marcado');

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
      <View style={styles.scrollcontainer}>
        {/* Se pasan los elementos a la función que se hace cargo de proyectarlos y en data se pasan los elementos. */}
        <FlatList
          data={todos}
          keyExtractor={(todo: Todo) => todo.id}          
          renderItem={({item}) => (
            <ListItem
              item={item}
              onDelete={handleDelete}
              onMark={handleMark}
            />
          )}
        />
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
  },
  scrollcontainer: {
    marginTop: 20,
  },
})
