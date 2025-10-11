"use server";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { CommetWithMetaData } from "../types";

type CommentItemProps = {
  comment: CommetWithMetaData;
  buttons: React.ReactNode[];
};

export const CommentItem = async ({ comment, buttons }: CommentItemProps) => {
  return (
    <div className="flex gap-x-2">
      <Card className="p-4 flex-1 flex flex-col gap-y-1">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {comment.isOwner ? "You" : comment.user?.username ?? "Deleted User"}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(comment.createdAt, "MM/dd/yyyy HH:mm")}
          </p>
        </div>
        <p className="whitespace-pre-line">{comment.content}</p>
      </Card>
      <div className="flex flex-col gap-y-1">{buttons}</div>
    </div>
  );
};
