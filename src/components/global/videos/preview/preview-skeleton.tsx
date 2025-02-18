import { Skeleton } from "@/components/ui/skeleton";
import TabMenu from "../../tabs";

const VideoPreviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <span className="flex gap-x-3 mt-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
          </span>
        </div>
        <Skeleton className="w-full aspect-video h-[430px] rounded-xl" />
        <div className="flex flex-col">
          <div className="flex gap-x-5 items-center justify-between">
            <Skeleton className="h-6 w-1/4" />
          </div>
          <Skeleton className="h-6 w-3/4 mt-4" />
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <Skeleton className="h-10 w-1/4 rounded-full" />
          <Skeleton className="h-10 w-1/4 rounded-full" />
        </div>
        <div>
          <div className="flex gap-x-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-3/4 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewSkeleton;
