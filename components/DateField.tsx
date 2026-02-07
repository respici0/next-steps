import { useState, ChangeEvent } from 'react';
import { Input } from './ui/input';
import { Field, FieldLabel } from './ui/field';

type DateFieldProps = {
  onChange: (value: string | null) => void;
};

export function parseDateToMongoUTC(dateStr: string): string {
  const [month, day, year] = dateStr.split('/').map(Number);

  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  return utcDate.toISOString().replace('Z', '+00:00');
}

export function formatMMDDYYYY(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    .slice(0, 10);
}

export function DateField({ onChange }: DateFieldProps) {
  const [value, setValue] = useState<string>('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const formatted = formatMMDDYYYY(raw);

    setValue(formatted);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      onChange(parseDateToMongoUTC(formatted));
    } else {
      onChange(null);
    }
  }

  return (
    <Field data-invalid={!![]?.length} className="gap-1">
      <FieldLabel htmlFor="date">
        Date <span className="text-xs font-medium opacity-65">(required)</span>
      </FieldLabel>
      <Input
        type="text"
        inputMode="numeric"
        placeholder="MM/DD/YYYY"
        value={value}
        onChange={handleChange}
        maxLength={10}
      />
    </Field>
  );
}
