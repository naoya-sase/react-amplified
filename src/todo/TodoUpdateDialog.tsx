import { ThemeProvider } from "@aws-amplify/ui-react";
import { Dialog, DialogTitle } from "@mui/material";
import { Todo, UpdateTodoInput } from "../API";
import theme, { getColorMode } from "../theme";
import TodoUpdateForm, { TodoUpdateFormInputValues } from "../ui-components/TodoUpdateForm";

export interface DialogProps {
  open: boolean;
  onClose: (todo?: UpdateTodoInput) => void;
  todo?: Todo,
}

export default function TodoUpdateDialog(props: DialogProps) {
  const { open, onClose, todo } = props;

  function handleClose() {
    onClose();
  }

  function handleSubmit(data: TodoUpdateFormInputValues) {
    onClose();
    return data;
  }

  const colorMode = getColorMode();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TODOの更新</DialogTitle>
      <ThemeProvider theme={theme} colorMode={colorMode}>
        <TodoUpdateForm onSubmit={handleSubmit} todo={todo}></TodoUpdateForm>
      </ThemeProvider>
    </Dialog>
  )
}
