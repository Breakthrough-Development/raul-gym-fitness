"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { Ticket } from "@prisma/client";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionState, useRef } from "react";
import { FieldError } from "@/components/form/field-error";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { Form } from "@/components/form/form";
import { toDollarAndCent } from "@/utils/currency";
import {
  DatePicker,
  ImperativeHandleFromDatePicker,
} from "@/components/date-picker";

export type TicketUpsertFormProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE
  );

  const datePickerImperativeHandleRef =
    useRef<ImperativeHandleFromDatePicker>(null);

  const handleSuccess = () => {
    datePickerImperativeHandleRef.current?.reset();
  };

  return (
    <Form
      action={formAction}
      actionState={actionState}
      onSuccess={handleSuccess}
    >
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        name="title"
        type="text"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />
      <FieldError actionState={actionState} name="title" />
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? ticket?.content
        }
      />
      <FieldError actionState={actionState} name="content" />

      <div className="flex gap-x-2 mb-1">
        <div className="w-1/2 flex flex-col gap-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <DatePicker
            id="deadline"
            key={actionState.timestamp}
            name="deadline"
            defaultValue={
              (actionState.payload?.get("deadline") as string) ??
              ticket?.deadline
            }
            imperativeHandleRef={datePickerImperativeHandleRef}
          />
          <FieldError actionState={actionState} name="deadline" />
        </div>
        <div className="w-1/2 flex flex-col gap-y-2">
          <Label htmlFor="bounty">Bounty</Label>
          <Input
            id="bounty"
            name="bounty"
            type="decimal"
            defaultValue={
              (actionState.payload?.get("bounty") as string) ??
              (ticket?.bounty ? toDollarAndCent(ticket.bounty) : "")
            }
          />
          <FieldError actionState={actionState} name="bounty" />
        </div>
      </div>

      <SubmitButton label={ticket ? "Edit" : "Create"} />

      {actionState.message}
    </Form>
  );
};

export { TicketUpsertForm };
