import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { WhatsAppTemplate } from "@/lib/whatsapp";
import { MembershipFilter, RecipientType } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import { upsertNotification } from "../actions/upsert-notification";
import { getAllClients } from "../queries/get-all-clients";
import { getWhatsAppTemplates } from "../queries/get-whatsapp-templates";
import { NotificationWithClients } from "../types";

export const useNotificationForm = (notification?: NotificationWithClients) => {
  const [actionState, formAction] = useActionState(
    upsertNotification.bind(null, notification?.id),
    EMPTY_ACTION_STATE
  );

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [clients, setClients] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string | null;
      phone: string | null;
    }>
  >([]);
  const [selectedClients, setSelectedClients] = useState<string[]>(
    notification?.selectedClientIds || []
  );
  const [recipientType, setRecipientType] = useState<RecipientType>(
    notification?.recipientType || RecipientType.ALL
  );
  const [membershipFilter, setMembershipFilter] =
    useState<MembershipFilter | null>(notification?.membershipFilter || null);

  // Load WhatsApp templates and clients
  useEffect(() => {
    const loadData = async () => {
      const [fetchedTemplates, fetchedClients] = await Promise.all([
        getWhatsAppTemplates(),
        getAllClients(),
      ]);
      setTemplates(fetchedTemplates);
      setClients(fetchedClients);
    };
    loadData();
  }, []);

  const handleRecipientTypeChange = (value: RecipientType) => {
    setRecipientType(value);
    if (value === RecipientType.ALL) {
      setSelectedClients([]);
    }
  };

  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients((prev) => [...prev, clientId]);
    } else {
      setSelectedClients((prev) => prev.filter((id) => id !== clientId));
    }
  };

  return {
    actionState,
    formAction,
    templates,
    clients,
    selectedClients,
    recipientType,
    membershipFilter,
    setMembershipFilter,
    handleRecipientTypeChange,
    handleClientSelection,
  };
};

