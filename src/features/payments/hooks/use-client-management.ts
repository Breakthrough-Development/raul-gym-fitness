"use client";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/util/to-action-state";
import { createClient } from "@/features/clients/actions/create-client";
import { deleteClientInline } from "@/features/clients/actions/delete-client-inline";
import { upsertClientInline } from "@/features/clients/actions/upsert-client-inline";
import { Client } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export const useClientManagement = (
  clients: Client[],
  initialClientId?: string
) => {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    initialClientId || clients[0]?.id
  );

  // Set first client as default if no client is selected
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [selectedClientId, clients]);

  // State for controlling the "Create Client" modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for controlling the "Edit Client" modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for controlling the "Delete Client" dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Action state for client creation
  const [, clientFormAction] = useActionState(createClient, EMPTY_ACTION_STATE);

  // Get selected client for editing
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Handle when "+ New Client" is clicked
  const handleNewClientClick = () => {
    setIsCreateModalOpen(true);
  };

  // Handle successful client creation
  const handleClientCreated = (actionState: unknown) => {
    const typedState = actionState as ActionState<Client>;
    if (typedState.status === "SUCCESS" && typedState.data) {
      const newClient = typedState.data as Client;
      // Auto-select the new client
      setSelectedClientId(newClient.id);
      // Close the modal
      setIsCreateModalOpen(false);
    }
  };

  // Optimistic Edit Handler
  const handleEditClient = async (client: Client, formData: FormData) => {
    // 1. Show loading toast
    const toastId = toast.loading("Actualizando cliente...");

    // 2. Optimistic update is skipped to rely on Server Action revalidation
    // since we're removing local state sync.
    // If we wanted true optimistic UI here, we'd need useOptimistic
    // but for now we'll just close modal and show toast.

    // 3. Close modal immediately
    setIsEditModalOpen(false);

    // 4. Perform actual update in background
    try {
      const result = await upsertClientInline(client.id, formData);

      if (result.status === "SUCCESS" && result.data) {
        toast.success("Cliente actualizado", { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("Error al actualizar cliente", { id: toastId });
    }
  };

  // Optimistic Delete Handler
  const handleDeleteClient = async (client: Client) => {
    // 1. Show loading toast
    const toastId = toast.loading("Eliminando cliente...");

    // 2. Clear selection if deleting selected client
    if (selectedClientId === client.id) {
      setSelectedClientId(undefined);
    }

    // 3. Close dialog immediately
    setIsDeleteDialogOpen(false);

    // 4. Perform actual delete in background
    try {
      const result = await deleteClientInline(client.id);

      if (result.status === "SUCCESS") {
        toast.success("Cliente eliminado", { id: toastId });
      } else {
        if (selectedClientId === undefined) {
          setSelectedClientId(client.id);
        }
        toast.error(result.message, { id: toastId });
      }
    } catch {
      toast.error("Error al eliminar cliente", { id: toastId });
    }
  };

  // Handle option menu actions (edit/delete)
  const handleOptionMenuAction = (clientId: string, actionId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (actionId === "edit") {
      setSelectedClientId(clientId);
      setIsEditModalOpen(true);
    } else if (actionId === "delete") {
      setClientToDelete(client);
      setIsDeleteDialogOpen(true);
    }
  };

  return {
    clientList: clients,
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
    setClientToDelete,
  };
};
