import { ColumnKey } from './JobBoard';

type Props = {
  name: string;
  count: number;
  columnKey: ColumnKey;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, toColumn: ColumnKey) => void;
  children: React.ReactNode;
};

export function JobColumn({ name, count, columnKey, onDragOver, onDrop, children }: Props) {
  return (
    <div
      id={name}
      className="bg-white rounded-md border"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnKey)}
    >
      <div className="font-bold sticky top-0 mb-4 p-2 bg-slate-600 text-white rounded-t-md justify-between flex items-center">
        <span>{name}</span>
        <span className="text-sm font-medium">( {count} )</span>
      </div>
      <div className="overflow-auto p-4 max-h-[calc(100vh-8rem)]">{children}</div>
    </div>
  );
}
