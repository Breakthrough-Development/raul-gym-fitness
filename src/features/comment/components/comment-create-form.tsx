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
import { CommentWithMetadata } from "../types";

type CommentCreateForm = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

export const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateForm) => {
  const createCommentWithPromise = createComment<
    CommentWithMetadata | undefined
  >;
  const [actionState, action] = useActionState<
    ActionState<CommentWithMetadata | undefined>,
    FormData
  >(createCommentWithPromise.bind(null, ticketId), EMPTY_ACTION_STATE);

  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>
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
