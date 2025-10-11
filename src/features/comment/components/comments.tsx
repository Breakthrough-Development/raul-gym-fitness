"use client";
import { CardComp } from "@/components/card-comp";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getComments } from "../queries/get-comments";
import { CommentWithMetaData } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentEditButton } from "./comment-edit-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
  paginatedComments: {
    list: CommentWithMetaData[];
    metadata: { count: number; hasNextPage: boolean };
  };
};

export const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const [comments, setComments] = useState(paginatedComments.list);
  const [metadata, setMetadata] = useState(paginatedComments.metadata);
  const handleMore = async () => {
    const morePaginatedComments = await getComments(ticketId, comments.length);
    const moreComments = morePaginatedComments.list;
    setComments([...comments, ...moreComments]);
    setMetadata(morePaginatedComments.metadata);
  };
  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };
  const handleCreateComment = (comment: CommentWithMetaData | undefined) => {
    if (!comment) {
      return;
    }
    setComments((prevComment) => [comment, ...prevComment]);
  };
  return (
    <>
      <CardComp
        title="Comment"
        description="A comment on a ticket"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={handleCreateComment}
          />
        }
      />
      <ul className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <li key={comment.id} className="w-full">
            <CommentItem
              comment={comment}
              buttons={[
                ...(comment.isOwner
                  ? [
                      <CommentDeleteButton
                        key="0"
                        id={comment.id}
                        onDeleteComment={handleDeleteComment}
                      />,
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
      {metadata.hasNextPage && (
        <div className="flex flex-col justify-center ml-8">
          <Button variant="ghost" onClick={handleMore}>
            More
          </Button>
        </div>
      )}
    </>
  );
};
