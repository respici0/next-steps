'use client';
import { FormEvent, useActionState, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { createJob } from '@/lib/server-actions/jobApplications';
import { Button } from '@/components/ui/button';
import { CornerDownLeft } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { parseDateToMongoUTC } from '@/lib/utils/parseDateToMongoUTC';
import { Spinner } from '@/components/ui/spinner';
import { ColumnKey } from './JobBoard';
import { type Job } from '@/lib/models/jobApplications';

type Props = {
  onClose: () => void;
  onJobCreated: (status: ColumnKey, job: Job) => void;
  columnKey: ColumnKey;
};

export default function CreateJobForm({ onClose, onJobCreated, columnKey }: Props) {
  const [state, formAction, isPending] = useActionState(createJob, undefined);
  const [displayDate, setDisplayDate] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state?.success && !isPending && state?.job) {
      onJobCreated(columnKey, state.job);
      onClose();
    }
  }, [state?.success, isPending, state?.job]);

  function handleDateChange(e: { target: { value: string } }) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 5) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setDisplayDate(value);
    inputRef.current?.setCustomValidity('');
  }

  function handleInvalid(e: FormEvent<HTMLInputElement>) {
    (e.target as HTMLInputElement).setCustomValidity('Enter a valid date (MM/DD/YYYY)');
  }

  return (
    <>
      <Card className="bg-white p-4 rounded-md shadow">
        <form
          action={(formData: FormData) => {
            if (displayDate) {
              const utcDate = parseDateToMongoUTC(displayDate);
              formData.set('appliedAt', utcDate);
            }
            formData.set('status', columnKey);
            formAction(formData);
          }}
        >
          <CardContent>
            <FieldGroup className="gap-1">
              <Field className="gap-1">
                <FieldLabel htmlFor="position" aria-required={true}>
                  Job title<span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  id="jobTitle"
                  type="text"
                  name="jobTitle"
                  placeholder="Job title (e.g., Software Engineer)"
                  required
                />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="company" aria-required={true}>
                  Company <span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Company name (e.g., Acme Corp)"
                  required
                />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="jobUrl">
                  Where is this job posted?{' '}
                  <span className="text-xs font-medium opacity-65">(optional)</span>
                </FieldLabel>
                <Input
                  id="jobUrl"
                  type="text"
                  name="jobUrl"
                  placeholder="Job link (e.g., https://example.com)"
                />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="notes">
                  Notes <span className="text-xs font-medium opacity-65">(optional)</span>
                </FieldLabel>
                <Input
                  id="notes"
                  type="text"
                  name="notes"
                  placeholder="Notes (e.g., concerns, next steps, reminders)"
                />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="date">
                  Date Applied <span className="text-xs font-medium opacity-65">(required)</span>
                </FieldLabel>
                <Input
                  ref={inputRef}
                  id="date"
                  name="date"
                  type="text"
                  placeholder="MM/DD/YYYY"
                  value={displayDate}
                  onChange={handleDateChange}
                  onInvalid={handleInvalid}
                  maxLength={10}
                  inputMode="numeric"
                  pattern={'^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}$'}
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
