# WhatsApp Notifications Feature

## Overview

A complete CRUD system for managing WhatsApp notifications to gym clients. Admins can create, schedule, and send notifications using approved WhatsApp Business API templates.

## Features Implemented

### Database Schema

- Added `ScheduledNotification` model to Prisma schema
- Supports recipient targeting (all clients or selected clients)
- Membership filtering (daily, monthly, or both)
- Recurrence options (one-time, weekly, monthly)
- Status tracking (pending, sent, failed, cancelled)

### Backend Implementation

- **WhatsApp Integration**: Extended `whatsapp.ts` with template fetching
- **API Routes**: `/api/whatsapp-templates` to fetch approved templates
- **Server Actions**: CRUD operations and manual sending
- **Queries**: Database queries for notifications and client data

### Frontend Implementation

- **Navigation**: Added "WhatsApp Notifications" to sidebar
- **Main Page**: `/dashboard/notifications` with card-based layout
- **Components**:
  - Notification list with pagination and search
  - Individual notification cards with edit/delete/send options
  - Comprehensive form for creating/editing notifications
  - Client selection with checkboxes
  - Template selection from WhatsApp API

### Key Features

1. **Recipient Targeting**:

   - Send to all clients
   - Send to selected individual clients
   - Filter by membership type (daily/monthly/both)

2. **Scheduling**:

   - Date picker for send date
   - Recurrence options (one-time, weekly, monthly)
   - Manual "Send Now" option

3. **Template Management**:

   - Fetches approved templates from WhatsApp Business API
   - Auto-fills template variables with client data
   - Template preview and selection

4. **Status Tracking**:
   - Pending, Sent, Failed, Cancelled statuses
   - Error logging for failed sends
   - Send timestamps

## Usage

### Creating a Notification

1. Navigate to "WhatsApp Notifications" in the sidebar
2. Click "Create Notification"
3. Fill in the form:
   - Message description
   - Select WhatsApp template
   - Choose recipients (all or selected clients)
   - Set send date and recurrence
4. Save the notification

### Sending Notifications

- **Manual**: Click "Send Now" on pending notifications
- **Scheduled**: Notifications will be processed based on their send date (requires cron integration)

### Managing Notifications

- Search by message or template name
- Edit existing notifications
- Delete notifications
- View send status and errors

## Technical Details

### Database Migration Required

Run the following command to apply the database schema changes:

```bash
npx prisma migrate dev --name add-scheduled-notifications
```

### Environment Variables

Ensure these WhatsApp Business API variables are set in your `.env` file:

- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

### File Structure

```
src/features/notifications/
├── actions/
│   ├── delete-notification.tsx
│   ├── send-notification.tsx
│   └── upsert-notification.tsx
├── components/
│   ├── edit-notification-option.tsx
│   ├── notification-item.tsx
│   ├── notification-list.tsx
│   ├── notification-pagination.tsx
│   ├── notification-search-input.tsx
│   ├── notification-upsert-form.tsx
│   └── send-notification-option.tsx
├── queries/
│   ├── get-all-clients.ts
│   ├── get-notification.ts
│   ├── get-notifications.ts
│   └── get-whatsapp-templates.ts
├── constants.tsx
├── search-params.ts
└── types.ts
```

## Future Enhancements

- Cron job integration for automatic scheduled sending
- Template variable preview
- Bulk notification operations
- Notification analytics and reporting
- Client grouping functionality
