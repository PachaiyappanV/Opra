"use client";
import React, { useState } from "react";
import CommentForm from "@/components/forms/comment-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { DotIcon } from "lucide-react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply?: boolean;
  createdAt: Date;
};

const CommentCard = ({
  author,
  comment,
  reply,
  videoId,
  commentId,
  isReply,
  createdAt,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  const daysAgo = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return (
    <Card
      className={cn(
        isReply
          ? "bg-[#E0E0E0] dark:bg-[#1D1D1D] border-none shadow-none mb-4"
          : " bg-[#E0E0E0] dark:bg-[#1D1D1D] p-4 shadow-none"
      )}
    >
      {/* Header: Avatar, Name, and Timestamp */}
      <div className="flex gap-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={author.image} alt="author" />
        </Avatar>
        <div className="flex flex-col items-start mt-[3px]  gap-y-1 w-full">
          <div className="flex items-center gap-x-1">
            <span className="capitalize font-bold text-md dark:text-neutral-100 text-neutral-900">
              {author.firstname} {author.lastname}
            </span>
            <DotIcon className="w-3 h-3 text-neutral-500" />
            <span className="text-xs text-neutral-500">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
          </div>
          <p className="dark:text-[#BDBDBD] text-neutral-800 text-md font-medium">
            {comment}
          </p>
          {!isReply && (
            <div className="w-full">
              {!onReply ? (
                <div className=" w-full flex justify-end ">
                  <button
                    onClick={() => setOnReply(true)}
                    type="button"
                    className="text-neutral-900 dark:text-neutral-100 text-sm px-2 py-[2px] hover:bg-neutral-500 rounded-lg font-semibold transition-all"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <CommentForm
                    videoId={videoId}
                    commentId={commentId}
                    author={`${author.firstname} ${author.lastname}`}
                    onSuccess={() => setOnReply(false)}
                    onClose={() => setOnReply(false)}
                  />
                </div>
              )}
            </div>
          )}
          {/* Nested Replies */}
          {reply.length > 0 && (
            <div className=" mt-2">
              {reply.map((r) => (
                <CommentCard
                  key={r.id}
                  isReply={true}
                  reply={[]}
                  comment={r.comment}
                  commentId={r.commentId!}
                  videoId={videoId}
                  author={{
                    image: r.User?.image!,
                    firstname: r.User?.firstname!,
                    lastname: r.User?.lastname!,
                  }}
                  createdAt={r.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommentCard;
