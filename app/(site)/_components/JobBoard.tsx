'use client';
import { useMemo, useState, FormEventHandler } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import JobColumn from './JobColumn';
import { updateJobStatus } from '@/lib/server-actions/jobApplications';
import { JobCard } from './JobCard';
import { useWindowSize } from '@/lib/hooks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobSearch from './JobSearch';
import debounce from 'lodash.debounce';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

export type ColumnKey = 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface ColumnConfig {
  name: string;
  jobs: Job[];
  columnKey: ColumnKey;
}

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [jobsByStatus, setJobsByStatus] = useState<Record<ColumnKey, Job[]>>({
    applied: jobs.filter((job) => job.status === 'applied'),
    interviewing: jobs.filter((job) => job.status === 'interviewing'),
    offered: jobs.filter((job) => job.status === 'offered'),
    rejected: jobs.filter((job) => job.status === 'rejected'),
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>('applied');

  const { width } = useWindowSize();

  const renderMobileBoard = width <= 768;

  const columnConfigs: ColumnConfig[] = [
    {
      name: 'Applied',
      jobs: jobsByStatus['applied'],
      columnKey: 'applied',
    },
    {
      name: 'Interviewing',
      jobs: jobsByStatus['interviewing'],
      columnKey: 'interviewing',
    },
    {
      name: 'Offered',
      jobs: jobsByStatus['offered'],
      columnKey: 'offered',
    },
    {
      name: 'Rejected',
      jobs: jobsByStatus['rejected'],
      columnKey: 'rejected',
    },
  ];
  const [column, setColumn] = useState('');

  const cachedJobsById = useMemo(() => {
    const cachedJobs = [...Object.values(jobsByStatus).flat()];
    const map = new Map<string, Job>();
    for (const job of cachedJobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [jobsByStatus]);

  function handleCreateForm(columnKey: ColumnKey) {
    setColumn(columnKey);
  }

  function createJob(status: ColumnKey, job: Job) {
    setJobsByStatus((prev) => {
      return {
        ...prev,
        [status]: [...prev[status], job],
      };
    });
  }

  function replaceJob(jobs: Job[], updatedJob: Job): Job[] {
    return jobs.map((job: Job) =>
      String(job._id) === String(updatedJob._id)
        ? {
            ...updatedJob,
          }
        : job,
    );
  }

  function updateJob(status: ColumnKey, job: Job) {
    console.log(status, job.status);
    if (status !== job.status) {
      moveJob(job._id, job.status);
    } else {
      setJobsByStatus((prev) => {
        return {
          ...prev,
          [status]: replaceJob(prev[status], job),
        };
      });
    }
  }

  function removeJobFromColumn(jobId: string) {
    setJobsByStatus((prev) => {
      const obj = {} as typeof prev;

      for (const status of Object.keys(prev)) {
        obj[status as ColumnKey] = prev[status as ColumnKey].filter(
          (job) => String((job as Job)._id ?? '') !== jobId,
        );
      }

      return obj;
    });
  }

  function moveJob(jobId: string, toColumn: ColumnKey) {
    const job = cachedJobsById.get(jobId);
    const addJobToColumn = createJob;
    if (!job) return;

    removeJobFromColumn(jobId);
    const updatedJob = { ...job, status: toColumn } as Job;
    addJobToColumn(toColumn, updatedJob);
    // we can improve performance here by debouncing this call  until the drag and drop have stopped
    updateJobStatus(job._id, updatedJob);
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

  function queryJobs(searchValue?: string) {
    let filteredJobs: Job[] = jobs;
    if (searchValue) {
      const searchValueRegex = new RegExp(searchValue, 'i');

      filteredJobs = jobs.filter((job) => {
        return job.company.match(searchValueRegex) || job.jobTitle.match(searchValueRegex);
      });
    }

    setIsFiltered(!!searchValue);

    setJobsByStatus({
      applied: filteredJobs.filter((job) => job.status === 'applied'),
      interviewing: filteredJobs.filter((job) => job.status === 'interviewing'),
      offered: filteredJobs.filter((job) => job.status === 'offered'),
      rejected: filteredJobs.filter((job) => job.status === 'rejected'),
    });
  }

  const onSearch: FormEventHandler<HTMLInputElement> = (event) => {
    const debouncedInput = debounce(() => {
      if (event.target && 'value' in event.target && typeof event.target.value === 'string') {
        queryJobs(event.target.value);
      }
    }, 500);
    debouncedInput();
  };

  carouselApi?.on('select', () => {
    setActiveMobileColumn(columnConfigs[carouselApi.selectedScrollSnap()].columnKey);
  });

  return (
    <div className="space-y-4">
      <h1 className="sr-only">Job Application Board</h1>
      <JobSearch onInput={onSearch}></JobSearch>
      {renderMobileBoard ? (
        <div>
          <Tabs defaultValue="applied" value={activeMobileColumn} onValueChange={scrollToColumn}>
            <TabsList>
              {columnConfigs.map(({ name, columnKey, jobs }) => (
                <TabsTrigger key={`tab-trigger-${columnKey}`} value={columnKey}>
                  {name}&nbsp;
                  {isFiltered ? (
                    <div className="flex items-center justify-center size-5 bg-black text-white rounded-full">
                      {jobs.length}
                    </div>
                  ) : null}
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
                    openCreateForm={column === columnKey}
                    onCreateClose={() => setColumn('')}
                    handleCreateForm={handleCreateForm}
                    onJobCreated={createJob}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {jobs.map((job) => (
                      <JobCard
                        key={String((job as Job)._id ?? '')}
                        job={job}
                        onJobUpdated={updateJob}
                        handleDragStart={handleDragStart}
                        columnKey={columnKey}
                      />
                    ))}
                  </JobColumn>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        <div className="md:grid md:grid-cols-4 gap-2 h-full">
          <h1 className="sr-only">Job Application Board</h1>
          {columnConfigs.map(({ name, jobs, columnKey }) => (
            <JobColumn
              key={columnKey}
              name={name}
              count={jobs.length}
              columnKey={columnKey}
              openCreateForm={column === columnKey}
              onCreateClose={() => setColumn('')}
              handleCreateForm={handleCreateForm}
              onJobCreated={createJob}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {jobs.map((job) => (
                <JobCard
                  key={String((job as Job)._id ?? '')}
                  job={job}
                  onJobUpdated={updateJob}
                  handleDragStart={handleDragStart}
                  columnKey={columnKey}
                />
              ))}
            </JobColumn>
          ))}
        </div>
      )}
    </div>
  );
}
