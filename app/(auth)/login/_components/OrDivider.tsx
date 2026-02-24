import { Separator } from '@/components/ui/separator';

export default function OrDivider() {
  return (
    <div className="flex flex-row items-center justify-center relative">
      <Separator />
      <span className="absolute bg-white px-6 uppercase ">Or</span>
    </div>
  );
}
