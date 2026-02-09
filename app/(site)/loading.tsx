import { SkeletonCard } from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="md:grid md:grid-cols-4 gap-2 p-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
