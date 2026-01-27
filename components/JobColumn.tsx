import { JobCard } from './JobCard';

type Props = {
  name: string;
};

export function JobColumn({ name }: Props) {
  return (
    <div className="p-2 bg-white rounded-md border-2">
      <div className="font-extrabold sticky top-0">{name}</div>
      <div>{/* Array of jobs here, going to make it drag and droppable */}</div>
    </div>
  );
}
