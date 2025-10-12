"use client";
import { CardComp } from "@/components/card-comp";
import { Button } from "@/components/ui/button";
import { PaginatedData } from "@/types/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentEditButton } from "./comment-edit-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

export const Comments = ({ ticketId }: CommentsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", ticketId],
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam:
        undefined as PaginatedData<CommentWithMetadata>["metadata"]["cursor"],
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
    });

  const handleMore = () => fetchNextPage();
  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  const handleDeleteComment = (id: string) => {
    // TODO
  };
  const handleCreateComment = (comment: CommentWithMetadata | undefined) => {
    // TODO
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
      {hasNextPage && (
        <div className="flex flex-col justify-center ml-8">
          <Button
            variant="ghost"
            onClick={handleMore}
            disabled={isFetchingNextPage}
          >
            More
          </Button>
        </div>
      )}
    </>
  );
};
