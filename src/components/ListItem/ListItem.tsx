import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Todo } from '../../types'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons'; 
import { DocumentData, DocumentReference, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';




interface TodoListProps {
    item: Todo;
    onDelete: (ref: DocumentReference<DocumentData, DocumentData>) => void;
    onMark: (ref: DocumentReference<DocumentData, DocumentData>, item: Todo) => void;
}



const ListItem: FC<TodoListProps> = ({item, onDelete, onMark}) => {
  const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

  return (
    <View style={styles.todocontainer}>
      <TouchableOpacity onPress={() => onMark(ref, item)} style={styles.todo}>
        {item.done ? <Ionicons name='md-checkmark-circle' size={32} color={"green"} /> : <Entypo name="circle" size={30} color="black" />}
        <Text style={item.done ? styles.todotextdone : styles.todotext}>{item.title}</Text>
      </TouchableOpacity>
      {item.done && <Ionicons name='trash-bin-outline' size={24} color={"red"} onPress={() => onDelete(ref)}/>
}
    </View>
  )
};

export default ListItem;

const styles = StyleSheet.create({
    todocontainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4,
        borderRadius: 6,
    },
    todo:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    todotext:{
        flex: 1,
        paddingHorizontal: 4,
    },
    todotextdone:{
      flex: 1,
      paddingHorizontal: 4,
      textDecorationLine: 'line-through',
  },
})


