import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Todo } from '../../types'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons'; 




interface TodoListProps {
    item: Todo;
    onDelete: () => void;
    onMark: () => void;
}



const ListItem: FC<TodoListProps> = ({item, onDelete, onMark}) => {
  return (
    <View style={styles.todocontainer}>
      <TouchableOpacity onPress={onMark} style={styles.todo}>
        {item.done ? <Ionicons name='md-checkmark-circle' size={24} /> : <Entypo name="circle" size={24} color="black" />}
        <Text style={styles.todotext}>{item.title}</Text>
      </TouchableOpacity>
    <Ionicons name='trash-bin-outline' size={24} color={"red"} onPress={onDelete}/>

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
        fontWeight: 'bold',
        flex: 1,
        paddingHorizontal: 4,
    },
})


