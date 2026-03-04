import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Search } from 'lucide-react';
import type { FormEventHandler } from 'react';

export interface Props {
  onInput?: FormEventHandler<HTMLInputElement>;
}

export default function JobSearch({ onInput }: Props) {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search by Company or Job Title..." onInput={onInput} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
