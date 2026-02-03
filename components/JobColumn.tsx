import { ColumnKey } from './JobBoard';

type Props = {
  name: string;
  columnKey: ColumnKey;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, toColumn: ColumnKey) => void;
  children: React.ReactNode;
};

export function JobColumn({ name, columnKey, onDragOver, onDrop, children }: Props) {
  return (
    <div
      id={name}
      className="p-2 bg-white rounded-md border"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnKey)}
    >
      <div className="font-extrabold sticky top-0 mb-4">{name}</div>
      {children}
    </div>
  );
}
