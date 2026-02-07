'use client';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { createJob } from '@/lib/server-actions/jobApplications';
import { Button } from '@/components/ui/button';
import { CornerDownLeft } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { parseDateToMongoUTC, formatMMDDYYYY } from '@/lib/utils/date.utils';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  onClose: () => void;
};

export default function CreateJobForm({ onClose }: Props) {
  const [state, formAction, isPending] = useActionState(createJob, undefined);
  const [displayDate, setDisplayDate] = useState('');
  const [utcDate, setUtcDate] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success && !isPending) {
      onClose();
    }
  }, [state?.success, isPending]);

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const formatted = formatMMDDYYYY(e.target.value);
    setDisplayDate(formatted);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formatted)) {
      setUtcDate(parseDateToMongoUTC(formatted));
    } else {
      setUtcDate(null);
    }
  }

  return (
    <>
      <Card className="bg-white p-4 rounded-md shadow">
        <form
          action={(formData: FormData) => {
            if (utcDate) {
              formData.set('appliedAt', utcDate);
            }
            formAction(formData);
          }}
        >
          <CardContent>
            <FieldGroup className="gap-1">
              <Field data-invalid={!![]?.length} className="gap-1">
                <FieldLabel htmlFor="position" aria-required={true}>
                  Position <span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="Position (e.g., Software Engineer)"
                  required
                  aria-invalid={!![]?.length}
                />
              </Field>
              <Field data-invalid={!![]?.length} className="gap-1">
                <FieldLabel htmlFor="company" aria-required={true}>
                  Company <span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Company name (e.g., Acme Corp)"
                  required
                  aria-invalid={!![]?.length}
                  // defaultValue={state.get('email')?.toString() || ''}
                />
              </Field>
              <Field data-invalid={!![]?.length} className="gap-1">
                <FieldLabel htmlFor="url">
                  Where is this job posted?{' '}
                  <span className="text-xs font-medium opacity-65">(optional)</span>
                </FieldLabel>
                <Input
                  id="url"
                  type="url"
                  name="url"
                  placeholder="Job link (e.g., https://example.com)"
                  aria-invalid={!![]?.length}
                  // defaultValue={state.get('email')?.toString() || ''}
                />
              </Field>
              <Field data-invalid={!![]?.length} className="gap-1">
                <FieldLabel htmlFor="notes">
                  Notes <span className="text-xs font-medium opacity-65">(optional)</span>
                </FieldLabel>
                <Input
                  id="notes"
                  type="text"
                  name="notes"
                  placeholder="Notes (e.g., concerns, next steps, reminders)"
                  aria-invalid={!![]?.length}
                  // defaultValue={state.get('email')?.toString() || ''}
                />
              </Field>
              <Field data-invalid={!![]?.length} className="gap-1">
                <FieldLabel htmlFor="date">
                  Date Applied <span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  id="date"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/DD/YYYY"
                  value={displayDate}
                  onChange={handleDateChange}
                  maxLength={10}
                  aria-invalid={!![]?.length}
                  required
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit" className="cursor-pointer" disabled={isPending}>
              {isPending ? <Spinner /> : <CornerDownLeft />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
