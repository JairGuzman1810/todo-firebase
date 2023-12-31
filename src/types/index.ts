export type RootStackParamList = {
    MyTodos: undefined; // Screen with no parameters
    Details: undefined; // Screen with no parameters
    // Add more screens as needed
  };

export type Todo = {
    id?: string,
    title: string,
    done: boolean,
  }