import { CardComp } from "@/components/card-comp";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getComments } from "../queries/get-comments";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketId: string;
};

export const Comments = async ({ ticketId }: CommentsProps) => {
  const comments = await getComments(ticketId);
  const { user } = await getAuth();

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
                ...(isOwner(user, comment)
                  ? [<CommentDeleteButton key="0" id={comment.id} />]
                  : []),
              ]}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
