import {
  MembershipFilter,
  RecipientType,
  RecurrenceType,
  ScheduledNotificationStatus,
} from "./temp-types";

export type ScheduledNotification = {
  id: string;
  message: string;
  recipientType: RecipientType;
  selectedClientIds: string[];
  membershipFilter: MembershipFilter | null;
  sendDate: Date;
  recurrence: RecurrenceType;
  templateName: string;
  status: ScheduledNotificationStatus;
  sentAt: Date | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationWithClients = ScheduledNotification & {
  clients?: Array<{
    id: string;
    nombre: string;
    apellido: string | null;
    telefono: string | null;
  }>;
};

export type CreateNotificationData = {
  message: string;
  recipientType: RecipientType;
  selectedClientIds: string[];
  membershipFilter: MembershipFilter | null;
  sendDate: Date;
  recurrence: RecurrenceType;
  templateName: string;
};

export type UpdateNotificationData = Partial<CreateNotificationData> & {
  id: string;
};

export type NotificationFormData = {
  message: string;
  recipientType: RecipientType;
  selectedClientIds: string[];
  membershipFilter: MembershipFilter | null;
  sendDate: Date;
  recurrence: RecurrenceType;
  templateName: string;
};
