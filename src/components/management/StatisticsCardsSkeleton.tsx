// src/components/management/StatisticsCardsSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatisticsCardsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Skeleton for SituationStatistics */}
    <Card className="shadow-peaceful">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="shadow-sm border">
              <CardContent className="pt-6 flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div>
                  <Skeleton className="h-7 w-8" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Skeleton for PaymentMethodStatistics */}
    <Card className="shadow-peaceful">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="shadow-sm border">
              <CardContent className="pt-6 flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div>
                  <Skeleton className="h-7 w-8" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);