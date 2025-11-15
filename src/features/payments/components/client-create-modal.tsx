"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";

export type ClientCreateModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (actionState: unknown) => void;
  formAction: (formData: FormData) => void;
};

export const ClientCreateModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  formAction,
}: ClientCreateModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <AlertDialogTitle>Crear Nuevo Cliente</AlertDialogTitle>
            <button
              onClick={() => onOpenChange(false)}
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
              <span className="sr-only">Close</span>
            </button>
          </div>
          <AlertDialogDescription className="sr-only">
            Completa el formulario para crear un nuevo cliente
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ClientUpsertForm onSuccess={onSuccess} formAction={formAction} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

