import { Button, ButtonGroup, Flex, TextField, ThemeProvider } from "@aws-amplify/ui-react";
import { Dialog, DialogTitle } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { Todo } from "../API";
import theme, { getColorMode } from "../theme";
import { deleteTodo } from "../graphql/mutations";

const client = generateClient();

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  todo?: Todo,
}

export default function TodoDeleteDialog(props: DialogProps) {
  const { open, onClose, todo } = props;

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    doDeleteTodo();
    onClose();
  }

  async function doDeleteTodo() {
    if (todo) {
      await client.graphql({
        query: deleteTodo,
        variables: {
          input: {
            id: todo.id,
          },
        },
      });
    }
  }

  const colorMode = getColorMode();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TODOの削除</DialogTitle>
      <ThemeProvider theme={theme} colorMode={colorMode}>
        <Flex direction='column' gap="20px" style={style.container}>
          <TextField label="Name" value={todo?.name} readOnly></TextField>
          <TextField label="Description" value={todo?.description ?? ''} readOnly></TextField>
          <ButtonGroup justifyContent='space-between'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variation="destructive">Delete</Button>
          </ButtonGroup>
        </Flex>
      </ThemeProvider>
    </Dialog>
  )
}

const style = {
  container: {
    padding: '20px',
  },
};