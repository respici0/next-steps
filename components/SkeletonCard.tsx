import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <Skeleton className="h-6 bg-gray-200" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full aspect-video bg-gray-200" />
      </CardContent>
    </Card>
  );
}
