'use client';
import { FormEvent, useRef, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { createJob, updateJob } from '@/lib/server-actions/jobApplications';
import { Button } from '@/components/ui/button';
import { CornerDownLeft } from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { parseDateToMongoUTC } from '@/lib/utils/parseDateToMongoUTC';
import { Spinner } from '@/components/ui/spinner';
import { ColumnKey } from './JobBoard';
import { type Job } from '@/lib/models/jobApplications';
import { cn } from '@/lib/utils/cn';

type Props = {
  onClose?: () => void;
  onJobCreated?: (status: ColumnKey, job: Job) => void;
  onJobUpdated?: (status: ColumnKey, job: Job) => void;
  columnKey: ColumnKey;
  action: 'create' | 'update';
  job?: Job;
};

export default function JobForm({
  onJobCreated,
  onJobUpdated,
  columnKey,
  action,
  job,
  onClose,
}: Props) {
  const [displayDate, setDisplayDate] = useState(
    job?.appliedAt
      ? `${(job.appliedAt.getUTCMonth() + 1).toString().padStart(2, '0')}/${job.appliedAt.getUTCDate()}/${job.appliedAt.getUTCFullYear()}`
      : '',
  );
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (action === 'create') {
      const formData = new FormData(e.currentTarget);
      if (displayDate) {
        const utcDate = parseDateToMongoUTC(displayDate);
        formData.set('appliedAt', utcDate);
      }
      formData.set('status', columnKey);

      setIsPending(true);
      const result = await createJob(formData);

      if (!result.success) {
        console.error(result.error);
        setIsPending(false);
      }

      if (result.success && result.job) {
        onJobCreated?.(columnKey, result.job);
        formRef.current?.reset();
        setIsPending(false);
      }
    }

    // update form method here, -we don't reset form since it's not a create
    if (action === 'update') {
      const formData = new FormData(e.currentTarget);
      if (displayDate) {
        const utcDate = parseDateToMongoUTC(displayDate);
        formData.set('appliedAt', utcDate);
      }
      formData.set('status', columnKey);

      setIsPending(true);
      if (job?._id) {
        const result = await updateJob(job?._id, formData);

        if (!result.success) {
          console.error(result.error);
          setIsPending(false);
        }

        if (result.success && result.job) {
          onJobUpdated?.(columnKey, result.job);
          setIsPending(false);
          onClose?.();
        }
      }
    }
  };

  return (
    <>
      <Card className="bg-white rounded-md shadow pb-2.5 mb-2">
        <form key={job?._id || 'create'} onSubmit={handleFormSubmit} ref={formRef}>
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
                  defaultValue={job?.jobTitle ?? ''}
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
                  defaultValue={job?.company ?? ''}
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
                  defaultValue={job?.jobUrl ?? ''}
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
                  defaultValue={job?.notes ?? ''}
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
          <CardFooter
            className={cn('flex justify-end mt-4', action === 'update' && 'justify-between')}
          >
            {action === 'update' && (
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="cursor-pointer" disabled={isPending}>
              {isPending ? <Spinner /> : <CornerDownLeft />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
