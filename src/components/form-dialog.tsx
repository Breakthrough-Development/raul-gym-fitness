"use client";

import { cn } from "@/lib/utils";
import { cloneElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type FormDialogArgs = {
  trigger: React.ReactElement;
  title: string;
  form: React.ReactElement;
  description?: string;
};

export const useFormDialog = ({
  trigger,
  title,
  form,
  description,
}: FormDialogArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSuccess = () => {
    setIsOpen(false);
  };
  const dialogTrigger = cloneElement(trigger, {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      setIsOpen(true);
    },
    className: cn(
      (trigger.props as { className?: string }).className,
      "cursor-pointer"
    ),
  } as React.HTMLAttributes<HTMLElement>);

  const formElement = cloneElement(
    form as React.ReactElement<{ onSuccess?: () => void }>,
    {
      onSuccess: handleSuccess,
    }
  );

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent data-testid="form-dialog">
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <AlertDialogTitle data-testid="form-dialog-title">{title}</AlertDialogTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full h-6 w-6 p-0 hover:bg-secondary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <div className="sr-only">Close</div>
            </button>
          </div>
          {/* Provide an accessible description to satisfy Radix requirements */}
          <AlertDialogDescription className="sr-only" data-testid="form-dialog-description">
            {description ??
              "This dialog contains a form. Complete the fields and submit."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {formElement}
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

// Simple FormDialog component for easier usage
export const FormDialog = ({
  trigger,
  title,
  children,
  description,
}: {
  trigger: React.ReactElement;
  title: string;
  children: React.ReactNode;
  description?: string;
}) => {
  const [dialogTrigger, dialog] = useFormDialog({
    trigger,
    title,
    form: children as React.ReactElement,
    description,
  });

  return (
    <>
      {dialogTrigger}
      {dialog}
    </>
  );
};
