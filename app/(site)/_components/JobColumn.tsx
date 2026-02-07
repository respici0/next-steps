import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ColumnKey } from './JobBoard';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import CreateJobForm from './CreateJobForm';
// import Modal from '../../../components/Modal';

type Props = {
  name: string;
  count: number;
  columnKey: ColumnKey;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, toColumn: ColumnKey) => void;
  children: React.ReactNode;
};

export function JobColumn({ name, count, columnKey, onDragOver, onDrop, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      id={name}
      className="bg-white rounded-md border relative pb-2"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnKey)}
    >
      <h2 className="font-semibold mb-1 p-2 bg-black text-white rounded-t-md justify-between flex items-center">
        <span>{name}</span>
        <span className="text-sm">( {count} )</span>
      </h2>
      <div
        className={cn(count && 'overflow-auto py-1 px-2 max-h-[calc(100vh-10.5rem)]', 'py-1 px-2')}
      >
        {children}
        {open && <CreateJobForm onClose={() => setOpen(false)} />}
      </div>
      {!open && (
        <div className="px-1 w-full items-center">
          <Button
            size="lg"
            variant="ghost"
            className="font-bold flex items-center justify-start w-full cursor-pointer hover:opacity-65 text-slate-700"
            onClick={() => setOpen(true)}
          >
            <Plus />
            Create
          </Button>
        </div>
      )}
    </section>
  );
}
