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
  // State for managing the client list dynamically
  const [clientList, setClientList] = useState<Client[]>(clients);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    initialClientId || clients[0]?.id
  );

  useEffect(() => {
    setClientList(clients);
  }, [clients]);

  // Set first client as default if no client is selected
  useEffect(() => {
    if (!selectedClientId && clientList.length > 0) {
      setSelectedClientId(clientList[0].id);
    }
  }, [selectedClientId, clientList]);

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
  const selectedClient = clientList.find((c) => c.id === selectedClientId);

  // Handle when "+ New Client" is clicked
  const handleNewClientClick = () => {
    setIsCreateModalOpen(true);
  };

  // Handle successful client creation
  const handleClientCreated = (actionState: unknown) => {
    const typedState = actionState as ActionState<Client>;
    if (typedState.status === "SUCCESS" && typedState.data) {
      const newClient = typedState.data as Client;
      // Add new client to the local client list
      setClientList((prev) => [...prev, newClient]);
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

    // 2. Optimistically update UI
    const optimisticClient = {
      ...client,
      firstName: (formData.get("firstName") as string) || client.firstName,
      lastName: (formData.get("lastName") as string) || client.lastName || "",
      email: (formData.get("email") as string) || client.email || null,
      phone: (formData.get("phone") as string) || client.phone || null,
    };

    setClientList((prev) =>
      prev.map((c) => (c.id === client.id ? optimisticClient : c))
    );

    // 3. Close modal immediately (optimistic)
    setIsEditModalOpen(false);

    // 4. Perform actual update in background
    try {
      const result = await upsertClientInline(client.id, formData);

      if (result.status === "SUCCESS" && result.data) {
        // Update with real data from server
        setClientList((prev) =>
          prev.map((c) => (c.id === client.id ? result.data : c))
        );
        toast.success("Cliente actualizado", { id: toastId });
      } else {
        // Revert optimistic update on error
        setClientList((prev) =>
          prev.map((c) => (c.id === client.id ? client : c))
        );
        toast.error(result.message, { id: toastId });
      }
    } catch {
      // Revert optimistic update on error
      setClientList((prev) =>
        prev.map((c) => (c.id === client.id ? client : c))
      );
      toast.error("Error al actualizar cliente", { id: toastId });
    }
  };

  // Optimistic Delete Handler
  const handleDeleteClient = async (client: Client) => {
    // 1. Show loading toast
    const toastId = toast.loading("Eliminando cliente...");

    // 2. Optimistically remove from UI
    const previousList = clientList;
    setClientList((prev) => prev.filter((c) => c.id !== client.id));

    // 3. Clear selection if deleting selected client
    if (selectedClientId === client.id) {
      setSelectedClientId(undefined);
    }

    // 4. Close dialog immediately (optimistic)
    setIsDeleteDialogOpen(false);

    // 5. Perform actual delete in background
    try {
      const result = await deleteClientInline(client.id);

      if (result.status === "SUCCESS") {
        toast.success("Cliente eliminado", { id: toastId });
      } else {
        // Revert optimistic update on error
        setClientList(previousList);
        if (selectedClientId === undefined) {
          setSelectedClientId(client.id);
        }
        toast.error(result.message, { id: toastId });
      }
    } catch {
      // Revert optimistic update on error
      setClientList(previousList);
      toast.error("Error al eliminar cliente", { id: toastId });
    }
  };

  // Handle option menu actions (edit/delete)
  const handleOptionMenuAction = (clientId: string, actionId: string) => {
    const client = clientList.find((c) => c.id === clientId);
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
    setClientToDelete,
  };
};
