'use client';
import { useMemo, useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import JobColumn from './JobColumn';
import { updateJob } from '@/lib/server-actions/jobApplications';
import { JobCard } from './JobCard';
import { useWindowSize } from '@/lib/hooks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Spinner } from '@/components/ui/spinner';

export type ColumnKey = 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface ColumnConfig {
  name: string;
  jobs: Job[];
  columnKey: ColumnKey;
}

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>(
    jobs.filter((job) => job.status === 'applied'),
  );
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>(
    jobs.filter((job) => job.status === 'interviewing'),
  );
  const [offeredJobs, setOfferedJobs] = useState<Job[]>(
    jobs.filter((job) => job.status === 'offered'),
  );
  const [rejectedJobs, setRejectedJobs] = useState<Job[]>(
    jobs.filter((job) => job.status === 'rejected'),
  );
  const [openCreateForm, setOpenCreateForm] = useState({
    applied: false,
    interviewing: false,
    offered: false,
    rejected: false,
  });
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>('applied');

  const { width } = useWindowSize();

  const renderMobileBoard = width <= 768 && width !== 0;

  const columnConfigs: ColumnConfig[] = [
    {
      name: 'Applied',
      jobs: appliedJobs,
      columnKey: 'applied',
    },
    {
      name: 'Interviewing',
      jobs: interviewingJobs,
      columnKey: 'interviewing',
    },
    {
      name: 'Offered',
      jobs: offeredJobs,
      columnKey: 'offered',
    },
    {
      name: 'Rejected',
      jobs: rejectedJobs,
      columnKey: 'rejected',
    },
  ];

  const cachedJobsById = useMemo(() => {
    const cachedJobs = [...appliedJobs, ...interviewingJobs, ...offeredJobs, ...rejectedJobs];
    const map = new Map<string, Job>();
    for (const job of cachedJobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [appliedJobs, interviewingJobs, offeredJobs, rejectedJobs]);

  function handleCreateForm(columnKey: ColumnKey) {
    setOpenCreateForm((prevObj) => {
      const obj = { ...prevObj };

      for (const key of Object.keys(prevObj) as Array<keyof typeof prevObj>) {
        if (obj[key]) {
          obj[key] = false;
        }
      }

      return {
        ...obj,
        [columnKey]: true,
      };
    });
  }

  function createJob(status: ColumnKey, job: Job) {
    console.log(status, job);
    switch (status) {
      case 'applied':
        setAppliedJobs((prev) => [...prev, job]);
        break;
      case 'interviewing':
        setInterviewingJobs((prev) => [...prev, job]);
        break;
      case 'offered':
        setOfferedJobs((prev) => [...prev, job]);
        break;
      case 'rejected':
        setRejectedJobs((prev) => [...prev, job]);
        break;
      default:
        break;
    }
  }

  function moveJob(jobId: string, toColumn: ColumnKey) {
    const job = cachedJobsById.get(jobId);
    if (!job) return;

    setAppliedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setInterviewingJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setOfferedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setRejectedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));

    const updatedJob = { ...job, status: toColumn } as Job;

    switch (toColumn) {
      case 'applied':
        setAppliedJobs((prev) => [...prev, updatedJob]);
        break;
      case 'interviewing':
        setInterviewingJobs((prev) => [...prev, updatedJob]);
        break;
      case 'offered':
        setOfferedJobs((prev) => [...prev, updatedJob]);
        break;
      case 'rejected':
        setRejectedJobs((prev) => [...prev, updatedJob]);
        break;
    }
    // we can improve performance here by debouncing this call  until the drag and drop have stopped
    updateJob(job._id, updatedJob);
  }

  function handleDragStart(e: React.DragEvent, jobId: string) {
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: React.DragEvent, toColumn: ColumnKey) {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain');
    if (!jobId) return;
    moveJob(jobId, toColumn);
  }

  function scrollToColumn(columnKey: string) {
    setActiveMobileColumn(columnKey);

    carouselApi?.scrollTo(columnConfigs.findIndex((config) => config.columnKey === columnKey));
  }

  carouselApi?.on('select', () => {
    setActiveMobileColumn(columnConfigs[carouselApi.selectedScrollSnap()].columnKey);
  });

  if (renderMobileBoard) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="sr-only">Job Application Board</h1>
        <Tabs defaultValue="applied" value={activeMobileColumn} onValueChange={scrollToColumn}>
          <TabsList>
            {columnConfigs.map(({ name, columnKey }) => (
              <TabsTrigger key={`tab-trigger-${columnKey}`} value={columnKey}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Carousel setApi={setCarouselApi}>
          <CarouselContent>
            {columnConfigs.map(({ name, jobs, columnKey }) => (
              <CarouselItem key={columnKey} id={columnKey}>
                <JobColumn
                  name={name}
                  count={jobs.length}
                  columnKey={columnKey}
                  openCreateForm={openCreateForm[columnKey]}
                  handleCreateForm={handleCreateForm}
                  onJobCreated={createJob}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {jobs.map((job) => (
                    <JobCard
                      key={String((job as Job)._id ?? '')}
                      job={job}
                      handleDragStart={handleDragStart}
                    />
                  ))}
                </JobColumn>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  } else {
    return (
      <div className="md:grid md:grid-cols-4 gap-2 h-full">
        <h1 className="sr-only">Job Application Board</h1>
        {columnConfigs.map(({ name, jobs, columnKey }) => (
          <JobColumn
            key={columnKey}
            name={name}
            count={jobs.length}
            columnKey={columnKey}
            openCreateForm={openCreateForm[columnKey]}
            handleCreateForm={handleCreateForm}
            onJobCreated={createJob}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {jobs.map((job) => (
              <JobCard
                key={String((job as Job)._id ?? '')}
                job={job}
                handleDragStart={handleDragStart}
              />
            ))}
          </JobColumn>
        ))}
      </div>
    );
  }
}
