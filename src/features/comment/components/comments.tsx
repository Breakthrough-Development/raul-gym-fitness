"use client";
import { CommetWithMetaData } from "../types";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  comments: CommetWithMetaData[];
};

export const Comments = ({ comments }: CommentsProps) => {
  return (
    <ul className="flex flex-col gap-y-2 ml-8">
      {comments.map((comment) => (
        <li key={comment.id} className="w-full">
          <CommentItem comment={comment} />
        </li>
      ))}
    </ul>
  );
};
