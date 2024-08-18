import { Skeleton } from "@nextui-org/react";

export default function DestinationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Skeleton className="rounded-lg mb-12">
        <div className="h-16 rounded-lg bg-default-300"></div>
      </Skeleton>

      {/* Image Grid */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        <Skeleton className="col-span-8 row-span-2 rounded-lg">
          <div className="h-[600px] rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="col-span-4 row-span-1 rounded-lg">
          <div className="h-[290px] rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="col-span-4 row-span-1 rounded-lg">
          <div className="h-[290px] rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(7)].map((_, index) => (
          <Skeleton key={index} className="rounded-lg">
            <div className="h-[400px] rounded-lg bg-default-300"></div>
          </Skeleton>
        ))}
      </div>

      {/* Bottom Image Grid */}
      <div className="grid grid-cols-12 gap-4 mt-8">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="col-span-4 rounded-lg">
            <div className="h-[290px] rounded-lg bg-default-300"></div>
          </Skeleton>
        ))}
      </div>
    </div>
  );
}
