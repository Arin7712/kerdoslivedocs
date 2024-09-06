import { useThreads } from "@liveblocks/react/suspense";
import { Composer } from "@liveblocks/react-ui";
import { Thread } from "@liveblocks/react-ui";
import React from "react";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { cn } from "@/lib/utils";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);
  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "comment-thread border rounded-sm",
        isActive && "!border-blue-500 shadow-md",
        thread.resolved && "opacity-40"
      )}
    />
  );
};

const Comments = () => {
  const { threads } = useThreads();
  return (
    <div className="comments-container">
      <Composer className="comment-composer" />
      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;