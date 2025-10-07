"use client";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";
import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonType = {
  id: string;
};

export const CommentDeleteButton = ({ id }: CommentDeleteButtonType) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: (
      <Button variant="destructive">
        <LucideTrash className="h-4 w-4" />
        <span className="sr-only">Delete Comment</span>
      </Button>
    ),
  });
  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};
