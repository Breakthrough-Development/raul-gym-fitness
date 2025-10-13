"use client";
import { useFormDialog } from "@/components/form-dialog";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/util/to-action-state";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { LucidePencil } from "lucide-react";
import { useActionState } from "react";
import { editComment } from "../actions/edit-comment";

type CommentEditButtonType = {
  id: string;
  content: string;
};

export const CommentEditButton = ({ id, content }: CommentEditButtonType) => {
  const [actionState, formAction] = useActionState(
    editComment.bind(null, id),
    EMPTY_ACTION_STATE
  );

  const form = (
    <Form action={formAction} actionState={actionState}>
      <Textarea
        name="content"
        placeholder="What's on your mind ..."
        defaultValue={content}
      />
      <FieldError actionState={actionState} name="content" />
      <AlertDialogFooter>
        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <SubmitButton label="Update Comment" />
        </AlertDialogAction>
      </AlertDialogFooter>
    </Form>
  );
  const [editButton, editDialog] = useFormDialog({
    form,
    title: "Edit Comment",
    trigger: (
      <Button variant="outline">
        <LucidePencil className="h-4 w-4" />
        <span className="sr-only">Edit Comment</span>
      </Button>
    ),
  });
  return (
    <>
      {editDialog}
      {editButton}
    </>
  );
};
