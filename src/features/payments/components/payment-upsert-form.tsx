"use client";
import { CurrencyInput } from "@/components/currency-input";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/util/to-action-state";
import { SearchableSelect } from "@/components/search-select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/features/clients/actions/create-client";
import { upsertClient } from "@/features/clients/actions/upsert-client";
import { ClientUpsertForm } from "@/features/clients/components/client-upsert-form";
import { Cliente, EstadoMembresia, Pago } from "@prisma/client";
import { Pencil, Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { upsertPayment } from "../actions/upsert-payment";
export type PaymentUpsertFormProps = {
  payment?: Pick<Pago, "id" | "monto" | "membresia" | "clienteId">;
  clients: Cliente[];
  onSuccess?: (actionState: unknown) => void;
};

export const PaymentUpsertForm = ({
  payment,
  clients,
  onSuccess,
}: PaymentUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertPayment.bind(null, payment?.id),
    EMPTY_ACTION_STATE
  );

  // State for managing the client list dynamically
  const [clientList, setClientList] = useState<Cliente[]>(clients);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    payment?.clienteId
  );

  // State for controlling the "Create Client" modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // State for controlling the "Edit Client" modal
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);

  // Action state for client creation
  const [, clientFormAction] = useActionState(createClient, EMPTY_ACTION_STATE);

  // Action state for client editing
  const selectedClient = clientList.find((c) => c.id === selectedClientId);
  const [, editClientFormAction] = useActionState(
    upsertClient.bind(null, selectedClient?.id),
    EMPTY_ACTION_STATE
  );

  const membershipStatus = Object.values(EstadoMembresia);

  const membershipDefaultValue = () => {
    if (actionState.payload?.get("membership") as string) {
      return actionState.payload?.get("membership") as string;
    }
    if (payment?.membresia) {
      return payment?.membresia;
    }
    return EstadoMembresia.MENSUAL;
  };

  // Handle when "+ New Client" is clicked
  const handleNewClientClick = () => {
    setIsClientModalOpen(true);
  };

  // Handle successful client creation
  const handleClientCreated = (actionState: unknown) => {
    const typedState = actionState as ActionState<Cliente>;
    if (typedState.status === "SUCCESS" && typedState.data) {
      const newClient = typedState.data as Cliente;
      // Add new client to the local client list
      setClientList((prev) => [...prev, newClient]);
      // Auto-select the new client
      setSelectedClientId(newClient.id);
      // Close the modal
      setIsClientModalOpen(false);
    }
  };

  // Handle successful client update
  const handleClientUpdated = (actionState: unknown) => {
    const typedState = actionState as ActionState<Cliente>;
    if (typedState.status === "SUCCESS" && typedState.data) {
      const updatedClient = typedState.data as Cliente;
      // Update the client in the local client list
      setClientList((prev) =>
        prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      // Keep the same client selected
      // Close the modal
      setIsEditClientModalOpen(false);
    }
  };

  return (
    <>
      <Form action={formAction} actionState={actionState} onSuccess={onSuccess}>
        <div className="flex gap-x-2 mb-1">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <Label htmlFor="clientId" className="text-base md:text-lg">
                Cliente
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={!selectedClientId}
                onClick={() => setIsEditClientModalOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <SearchableSelect
              key={selectedClientId}
              defaultValue={selectedClientId}
              name="clientId"
              options={clientList.map((client) => ({
                value: client.id,
                label: client.nombre + " " + client.apellido,
              }))}
              placeholder="Selecciona un cliente"
              actionItems={[
                {
                  id: "new-client",
                  label: "Nuevo Cliente",
                  icon: <Plus className="h-4 w-4" />,
                },
              ]}
              onActionItemClick={handleNewClientClick}
              onValueChange={setSelectedClientId}
            />
            <FieldError actionState={actionState} name="clientId" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="membership" className="text-base md:text-lg">
              Membresía
            </Label>
            <Select name="membership" defaultValue={membershipDefaultValue()}>
              <SelectTrigger className="text-base md:text-lg">
                <SelectValue placeholder="Selecciona una membresía" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Membresía</SelectLabel>
                  {membershipStatus.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError actionState={actionState} name="membership" />
          </div>
        </div>
        <CurrencyInput
          actionState={actionState}
          name="monto"
          defaultValue={payment?.monto}
        />

        <SubmitButton label={payment ? "Editar" : "Crear"} />

        {actionState.message}
      </Form>

      {/* Modal for creating a new client */}
      <AlertDialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle>Crear Nuevo Cliente</AlertDialogTitle>
              <button
                onClick={() => setIsClientModalOpen(false)}
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
          <ClientUpsertForm
            onSuccess={handleClientCreated}
            formAction={clientFormAction}
          />
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal for editing an existing client */}
      <AlertDialog
        open={isEditClientModalOpen}
        onOpenChange={setIsEditClientModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle>Editar Cliente</AlertDialogTitle>
              <button
                onClick={() => setIsEditClientModalOpen(false)}
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
              Completa el formulario para editar el cliente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ClientUpsertForm
            client={selectedClient}
            onSuccess={handleClientUpdated}
            formAction={editClientFormAction}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
