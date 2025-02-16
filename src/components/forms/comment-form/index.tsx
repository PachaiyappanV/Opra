"use client";
import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useComment } from "@/hooks/use-comment";
import React, { useEffect, useState } from "react";

type Props = {
  videoId: string;
  commentId?: string;
  author: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

const CommentForm = ({
  author,
  videoId,
  commentId,
  onSuccess,
  onClose,
}: Props) => {
  const { errors, isPending, onFormSubmit, register, setFocus } = useComment(
    videoId,
    commentId,
    onSuccess
  );

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setFocus("comment");
  }, []);

  return (
    <form
      className="flex flex-col p-2 gap-y-2  border border-neutral-300 rounded-2xl"
      onSubmit={onFormSubmit}
    >
      <FormGenerator
        register={register}
        errors={errors}
        placeholder={`Respond to ${author}...`}
        name="comment"
        inputType="textarea"
        type="text"
        lines={0}
        onFocus={() => setShowButtons(true)}
      />
      {showButtons && (
        <div className="flex justify-end gap-2 ">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="p-1 bg-transparent text-[#707070] flex items-center gap-2 py-3 px-2 rounded-xl"
            >
              Cancel
            </Button>
          )}

          <Button
            variant="outline"
            type="submit"
            className="bg-transparent text-[#707070] flex items-center gap-2 py-3 px-2 rounded-xl w-fit"
          >
            <Loader state={isPending}>Comment</Loader>
          </Button>
        </div>
      )}
    </form>
  );
};

export default CommentForm;
