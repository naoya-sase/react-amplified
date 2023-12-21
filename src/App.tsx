import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { AuthUser } from 'aws-amplify/auth';
import { Button, ButtonGroup, ColorMode, Flex, Heading, Icon, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, ToggleButton, UseAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';

import { listTodos } from './graphql/queries';
import { onCreateTodo, onDeleteTodo, onUpdateTodo } from './graphql/subscriptions';
import { Todo } from './API';
import { DarkMode, Delete, Edit, LightMode } from '@mui/icons-material';
import TodoCreateDialog from './todo/TodoCreateDialog';
import TodoUpdateDialog from './todo/TodoUpdateDialog';
import TodoDeleteDialog from './todo/TodoDeleteDialog';

import theme from './theme';
import './App.css';

const client = generateClient();

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
  user?: AuthUser;
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [todoCreateDialogOpen, setTodoCreateDialogOpen] = useState(false);
  const [todoUpdateDialogOpen, setTodoUpdateDialogOpen] = useState(false);
  const [todoDeleteDialogOpen, setTodoDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos,
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  /** Todoが新規追加された場合、追加されたTodoをリストに追加する */
  useEffect(() => {
    const subscription = client.graphql({query: onCreateTodo}).subscribe({
      next: (message) => {
        setTodos(todos => [...todos, message.data.onCreateTodo]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  /** Todoが更新された場合、更新内容をリストに反映する */
  useEffect(() => {
    const subscription = client.graphql({query: onUpdateTodo}).subscribe(
      message => {
        const updatedTodo = message.data.onUpdateTodo;
        setTodos(todos => todos.map(value => value.id === updatedTodo.id ? updatedTodo : value));
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  /** Todoが削除された場合、削除されたTodoをリストから削除する */
  useEffect(() => {
    const subscription = client.graphql({query: onDeleteTodo}).subscribe(
      message => {
        setTodos(todos => todos.filter(value => value.id !== message.data.onDeleteTodo.id));
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  /** テーマを切り替える */
  function handleChangeTheme(mode: ColorMode) {
    setColorMode(mode);
  }

  /** Todo追加ダイアログを開く */
  function handleCreateTodoDialogOpen() {
    setTodoCreateDialogOpen(true);
  }

  /** Todo追加ダイアログを閉じる */
  function handleCreateTodoDialogClose() {
    setTodoCreateDialogOpen(false);
  }

  /** Todo更新ダイアログを開く */
  function handleUpdateTodoDialogOpen(todo: Todo) {
    setSelectedTodo(todo);
    setTodoUpdateDialogOpen(true);
  }

  /** Todo更新ダイアログを閉じる */
  function handleUpdateTodoDialogClose() {
    setTodoUpdateDialogOpen(false);
  }

  /** Todo削除ダイアログを開く */
  function handleDeleteTodoDialogOpen(todo: Todo) {
    setSelectedTodo(todo);
    setTodoDeleteDialogOpen(true);
  }

  /** Todo削除ダイアログを閉じる */
  function handleDeleteTodoDialogClose() {
    setTodoDeleteDialogOpen(false);
  }

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <Flex direction='column' gap="20px" style={style.view}>
        <ButtonGroup justifyContent="flex-end">
          <ToggleButton size="small" isPressed={colorMode == 'light'} onClick={() => handleChangeTheme('light')}>
            <Icon as={LightMode}></Icon>
          </ToggleButton>
          <ToggleButton size="small" isPressed={colorMode == 'dark'} onClick={() => handleChangeTheme('dark')}>
            <Icon as={DarkMode}></Icon>
          </ToggleButton>
        </ButtonGroup>

        <Flex direction='row'>
          <Heading level={1} flex="1">Hello {user?.username}</Heading>
          <Button onClick={signOut}>Sign out</Button>
        </Flex>

        <Heading level={2}>Amplify Todos</Heading>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Descriptoin</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo, index) => (
              <TableRow key={todo.id ? todo.id : index}>
                <TableCell>{todo.name}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell style={style.todoButtons}>
                  <ButtonGroup>
                    <Button size="small" onClick={() => handleUpdateTodoDialogOpen(todo)}><Icon as={Edit}></Icon></Button>
                    <Button size="small" onClick={() => handleDeleteTodoDialogOpen(todo)}><Icon as={Delete}></Icon></Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button variation="primary" onClick={handleCreateTodoDialogOpen}>Create Todo</Button>
      </Flex>

      <TodoCreateDialog open={todoCreateDialogOpen} onClose={handleCreateTodoDialogClose}></TodoCreateDialog>
      <TodoUpdateDialog open={todoUpdateDialogOpen} onClose={handleUpdateTodoDialogClose} todo={selectedTodo}></TodoUpdateDialog>
      <TodoDeleteDialog open={todoDeleteDialogOpen} onClose={handleDeleteTodoDialogClose} todo={selectedTodo}></TodoDeleteDialog>
    </ThemeProvider>
  );
};

const style = {
  view: {
    minHeight: '100vh',
    padding: '10px',
  },
  todoButtons: {
    width: '10rem',
  }
}
export default withAuthenticator(App);
