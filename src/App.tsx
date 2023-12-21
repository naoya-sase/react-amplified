import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { AuthUser } from 'aws-amplify/auth';
import { Button, ButtonGroup, ColorMode, Flex, Heading, Icon, Table, TableBody, TableCell, TableHead, TableRow, TextField, ThemeProvider, ToggleButton, UseAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';

import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { type CreateTodoInput, type Todo } from './API';
import theme from './theme';
import { DarkMode, LightMode } from '@mui/icons-material';
import './App.css';

const initialState: CreateTodoInput = { name: '', description: '' };
const client = generateClient();

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
  user?: AuthUser;
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const [formState, setFormState] = useState<CreateTodoInput>(initialState);
  const [todos, setTodos] = useState<Todo[] | CreateTodoInput[]>([]);

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

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo,
        },
      });
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  /** テーマを切り替える */
  function handleChangeTheme(mode: ColorMode) {
    setColorMode(mode);
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

        <Flex direction="column" gap="10px">
          <TextField
            label="Name"
            errorMessage="This field is required"
            required={true}
            value={formState.name}
            onChange={(event) =>
              setFormState({ ...formState, name: event.target.value })
            }
          />
          <TextField
            label="Description"
            errorMessage="This field is required"
            required={true}
            value={formState.description as string}
            onChange={(event) =>
              setFormState({ ...formState, description: event.target.value })
            }
          />
          <ButtonGroup justifyContent="flex-end">
            <Button variation="primary" onClick={addTodo}>
              Create Todo
            </Button>
          </ButtonGroup>
        </Flex>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Descriptoin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo, index) => (
              <TableRow key={todo.id ? todo.id : index}>
                <TableCell>{todo.name}</TableCell>
                <TableCell>{todo.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flex>
    </ThemeProvider>
  );
};

const style = {
  view: {
    minHeight: '100vh',
    padding: '10px',
  },
}
export default withAuthenticator(App);
