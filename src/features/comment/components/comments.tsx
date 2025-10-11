"use server";
import { CardComp } from "@/components/card-comp";
import { CommetWithMetaData } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentEditButton } from "./comment-edit-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
  comments?: CommetWithMetaData[];
};

export const Comments = async ({ ticketId, comments = [] }: CommentsProps) => {
  return (
    <>
      <CardComp
        title="Comment"
        description="A comment on a ticket"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <ul className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <li key={comment.id} className="w-full">
            <CommentItem
              comment={comment}
              buttons={[
                ...(comment.isOwner
                  ? [
                      <CommentDeleteButton key="0" id={comment.id} />,
                      <CommentEditButton
                        key="1"
                        id={comment.id}
                        content={comment.content}
                      />,
                    ]
                  : []),
              ]}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
