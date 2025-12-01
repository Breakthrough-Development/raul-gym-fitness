"use client";
import { CurrencyInput } from "@/components/currency-input";
import { PaymentDateField } from "@/components/form/fields/paymentDateField";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Client, Payment } from "@prisma/client";
import { useClientManagement } from "../hooks/use-client-management";
import { usePaymentForm } from "../hooks/use-payment-form";
import { ClientCreateModal } from "./client-create-modal";
import { ClientDeleteDialog } from "./client-delete-dialog";
import { ClientEditModal } from "./client-edit-modal";
import { ClientSelectField } from "./client-select-field";
import { MembershipSelectField } from "./membership-select-field";

type PaymentUpsertFormProps = {
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
  const { actionState, formAction, handleSuccess } = usePaymentForm({
    paymentId: payment?.id,
    onSuccess,
  });

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
        <PaymentDateField
          actionState={actionState}
          defaultValue={
            payment?.paymentDate?.toISOString() ?? new Date().toISOString()
          }
        />
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
