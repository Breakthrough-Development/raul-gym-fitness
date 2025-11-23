"use client";
import { CurrencyInput } from "@/components/currency-input";
import { DatePicker } from "@/components/date-picker";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Client, Payment } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useActionState } from "react";
import { upsertPayment } from "../actions/upsert-payment";
import { useClientManagement } from "../hooks/use-client-management";
import { ClientCreateModal } from "./client-create-modal";
import { ClientDeleteDialog } from "./client-delete-dialog";
import { ClientEditModal } from "./client-edit-modal";
import { ClientSelectField } from "./client-select-field";
import { MembershipSelectField } from "./membership-select-field";

export type PaymentUpsertFormProps = {
  payment?: Pick<
    Payment,
    "id" | "amount" | "membership" | "clientId" | "paymentDate"
  >;
  clients: Client[];
  onSuccess?: (actionState: unknown) => void;
};

export const PaymentUpsertForm = ({
  payment,
  clients,
  onSuccess,
}: PaymentUpsertFormProps) => {
  const queryClient = useQueryClient();
  const [actionState, formAction] = useActionState(
    upsertPayment.bind(null, payment?.id),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (state: unknown) => {
    queryClient.invalidateQueries({ queryKey: ["metric"] });
    onSuccess?.(state);
  };

  const {
    clientList,
    selectedClientId,
    setSelectedClientId,
    selectedClient,
    handleClientCreated,
    handleEditClient,
    handleDeleteClient,
    handleNewClientClick,
    handleOptionMenuAction,
    clientFormAction,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    clientToDelete,
  } = useClientManagement(clients, payment?.clientId);

  return (
    <>
      <Form
        action={formAction}
        actionState={actionState}
        onSuccess={handleSuccess}
      >
        <ClientSelectField
          actionState={actionState}
          selectedClientId={selectedClientId}
          clientList={clientList}
          onValueChange={setSelectedClientId}
          onNewClientClick={handleNewClientClick}
          onOptionMenuAction={handleOptionMenuAction}
        />
        <MembershipSelectField actionState={actionState} payment={payment} />
        <div className="flex flex-col gap-y-2">
          <label htmlFor="paymentDate" className="text-base md:text-lg">
            Fecha de pago
          </label>
          <DatePicker
            id="paymentDate"
            name="paymentDate"
            defaultValue={
              payment?.paymentDate?.toISOString() ?? new Date().toISOString()
            }
          />
        </div>
        <CurrencyInput
          actionState={actionState}
          name="amount"
          defaultValue={payment?.amount}
        />

        <SubmitButton label={payment ? "Editar" : "Crear"} />
      </Form>

      <ClientCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleClientCreated}
        formAction={clientFormAction}
      />

      <ClientEditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        client={selectedClient}
        onSubmit={async (formData) => {
          if (selectedClient) {
            await handleEditClient(selectedClient, formData);
          }
        }}
      />

      <ClientDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        client={clientToDelete}
        onConfirm={handleDeleteClient}
      />
    </>
  );
};
