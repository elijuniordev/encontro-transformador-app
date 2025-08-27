// src/components/management/InscriptionsTableSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

export const InscriptionsTableSkeleton = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Card className="shadow-divine">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="shadow-sm border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-divine">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <TableHead key={index}><Skeleton className="h-5 w-20" /></TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {Array.from({ length: 12 }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex}><Skeleton className="h-5 w-full" /></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
};