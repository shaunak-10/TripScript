import { Card, Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
        Your itinerary is being created...
      </h1>

      {/* Loop through days (skeletons for now) */}
      {[1, 2, 3, 4, 5].map((day) => (
        <Card key={day} className="p-8 rounded-2xl mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <Skeleton className="rounded-lg mb-2 sm:mb-0">
              <div className="h-8 w-48 bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-8 w-24 bg-default-300"></div>
            </Skeleton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((activity) => (
              <Card key={activity} className="p-6">
                <Skeleton className="rounded-lg mb-4">
                  <div className="h-6 w-3/4 bg-default-300"></div>
                </Skeleton>
                <Skeleton className="rounded-lg mb-4">
                  <div className="h-20 w-full bg-default-200"></div>
                </Skeleton>
                <div className="flex justify-between items-center">
                  <Skeleton className="rounded-lg">
                    <div className="h-4 w-16 bg-default-300"></div>
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-4 w-16 bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
