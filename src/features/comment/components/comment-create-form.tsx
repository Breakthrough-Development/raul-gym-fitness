"use client";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/util/to-action-state";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { createComment } from "../actions/create-comment";
import { CommentWithMetaData } from "../types";

type CommentCreateForm = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetaData | undefined) => void;
};

export const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateForm) => {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (
    actionState: ActionState<CommentWithMetaData | undefined>
  ) => {
    onCreateComment?.(actionState.data);
  };

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea name="content" placeholder="What's on your mind ..." />
      <FieldError actionState={actionState} name="content" />
      <SubmitButton label="Create Comment" />
    </Form>
  );
};
