import { ThemeProvider } from "@aws-amplify/ui-react";
import { Dialog, DialogTitle } from "@mui/material";
import TodoCreateForm, { TodoCreateFormInputValues } from "../ui-components/TodoCreateForm";
import theme, { getColorMode } from "../theme";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export default function TodoCreateDialog(props: DialogProps) {
  const { open, onClose } = props;

  function handleClose() {
    onClose();
  }

  function handleSubmit(data: TodoCreateFormInputValues) {
    onClose();
    return data;
  }

  const colorMode = getColorMode();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TODOの追加</DialogTitle>
      <ThemeProvider theme={theme} colorMode={colorMode}>
        <TodoCreateForm onSubmit={handleSubmit}></TodoCreateForm>
      </ThemeProvider>
    </Dialog>
  )
}
