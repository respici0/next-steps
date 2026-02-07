import { z } from 'zod';
import { FieldDescription } from '@/components/ui/field';

interface ErrorListProps {
  placeholder?: string;
  errors?: z.core.$ZodIssue[];
}

export default function ErrorList({ errors, placeholder }: ErrorListProps) {
  if (errors?.length) {
    return (
      <ul className="list-disc pl-6 text-red-700">
        {errors.map((fieldError, index) => (
          <li key={fieldError.code + index}>{fieldError.message}</li>
        ))}
      </ul>
    );
  } else if (placeholder) {
    return <FieldDescription>{placeholder}</FieldDescription>;
  }
}
