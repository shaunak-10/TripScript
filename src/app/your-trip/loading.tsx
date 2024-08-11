import { Card, Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="rounded-lg mb-12">
        <div className="h-12 w-3/4 mx-auto bg-default-300"></div>
      </Skeleton>

      <div className="relative max-w-7xl mx-auto">
        {/* Placeholder for navigation buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
          <Skeleton className="rounded-full w-14 h-14" />
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16">
          <Skeleton className="rounded-full w-14 h-14" />
        </div>

        <Card className="p-8 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <Skeleton className="rounded-lg mb-2 sm:mb-0">
              <div className="h-8 w-48 bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-8 w-24 bg-default-300"></div>
            </Skeleton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((activity) => (
              <Card key={activity} className="p-6">
                <Skeleton className="rounded-lg mb-4">
                  <div className="h-8 w-3/4 bg-default-300"></div>
                </Skeleton>
                <Skeleton className="rounded-lg mb-4">
                  <div className="h-32 w-full bg-default-200"></div>
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
      </div>

      <div className="flex justify-center mt-8">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Skeleton key={index} className="mx-2 w-4 h-4 rounded-full" />
        ))}
      </div>
    </div>
  );
}
