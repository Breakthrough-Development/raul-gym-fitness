"use client";
import { CardComp } from "@/components/card-comp";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginatedData } from "@/types/pagination";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
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

export const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
  const queryKey = ["comments", ticketId];
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam:
        undefined as PaginatedData<CommentWithMetadata>["metadata"]["cursor"],
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data.pages.flatMap((page) => page.list);
  const queryClient = useQueryClient();
  const handleDeleteComment = () => queryClient.invalidateQueries({ queryKey });
  const handleCreateComment = () => queryClient.invalidateQueries({ queryKey });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);
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
        {isFetchingNextPage && (
          <li className="w-full flex flex-col gap-y-2">
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]]" />
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]]" />
            </div>
          </li>
        )}
      </ul>
      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments</p>
        )}
      </div>
    </>
  );
};
