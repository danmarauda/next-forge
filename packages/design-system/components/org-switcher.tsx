'use client';

import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useOrganization } from '../providers/organization-provider';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function OrganizationSwitcher() {
  const { currentOrg, organizations, switchOrganization } = useOrganization();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          <div className="flex items-center gap-2">
            {currentOrg?.logoUrl ? (
              <img
                src={currentOrg.logoUrl}
                alt={currentOrg.name}
                className="h-5 w-5 object-contain"
              />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
            <span className="truncate">
              {currentOrg?.name || 'Select organization'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Your Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org._id}
                  value={org.name}
                  onSelect={() => {
                    switchOrganization(org._id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentOrg?._id === org._id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {org.logoUrl ? (
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <Building2 className="h-4 w-4" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm">{org.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {org.role}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
