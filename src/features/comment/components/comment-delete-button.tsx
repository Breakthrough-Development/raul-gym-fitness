"use client";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonType = {
  id: string;
  onDeleteComment: (id: string) => void;
};

export const CommentDeleteButton = ({
  id,
  onDeleteComment,
}: CommentDeleteButtonType) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: (isLoading) => (
      <Button variant="destructive">
        {isLoading ? (
          <LucideLoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <LucideTrash className="h-4 w-4" />
        )}
        <span className="sr-only">Delete Comment</span>
      </Button>
    ),
    onSuccess: () => onDeleteComment?.(id),
  });
  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};
