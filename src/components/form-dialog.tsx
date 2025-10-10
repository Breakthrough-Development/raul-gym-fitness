import { cloneElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type FormDialogArgs = {
  trigger: React.ReactElement;
  title: string;
  form: React.ReactElement;
};

export const useFormDialog = ({ trigger, title, form }: FormDialogArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSuccess = () => {
    setIsOpen(false);
  };
  const dialogTrigger = cloneElement(trigger, {
    onClick: () => setIsOpen((state) => !state),
    className: "cursor-pointer",
  } as React.HTMLAttributes<HTMLElement>);

  const formElement = cloneElement(
    form as React.ReactElement,
    {
      onSuccess: handleSuccess,
    } as React.HTMLAttributes<HTMLElement>
  );

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        {formElement}
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};
