import { createCommentSchema } from "@/components/forms/comment-form/schema";

import { createCommentAndReply, getUserProfile } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import { useMutationData } from "./use-mutation-data";
import useZodForm from "./use-zod-form";

export const useComment = (
  videoId: string,
  commentId?: string,
  onSuccess?: () => void
) => {
  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const user = data?.profile;

  const { isPending, mutate } = useMutationData(
    ["new-comment"],
    (data: { comment: string }) =>
      createCommentAndReply(
        user?.id as string,
        data.comment,
        videoId,
        commentId
      ),
    [["video-comments"]],
    () => {
      reset();
      if (onSuccess) {
        onSuccess();
      }
    }
  );

  const { register, onFormSubmit, errors, reset, setFocus } = useZodForm(
    createCommentSchema,
    mutate
  );
  return { register, errors, onFormSubmit, isPending, setFocus };
};
