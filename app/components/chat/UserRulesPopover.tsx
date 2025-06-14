import React from 'react';
import Popover from '~/components/ui/Popover';
import { IconButton } from '~/components/ui/IconButton';

interface UserRulesPopoverProps {
  rules: string;
  setRules: (rules: string) => void;
}

export const UserRulesPopover: React.FC<UserRulesPopoverProps> = ({ rules, setRules }) => {
  return (
    <Popover
      side="top"
      align="start"
      trigger={
        <IconButton title="Custom Rules" className="transition-all border border-[#444]">
          <div className="i-ph:note-pencil text-gray-200 text-xl" />
        </IconButton>
      }
    >
      <textarea
        value={rules}
        onChange={(e) => setRules(e.target.value)}
        placeholder="Add custom rules..."
        className="w-64 h-32 p-2 rounded-md bg-gray-900 text-gray-200 border border-[#444] text-sm resize-none"
      />
    </Popover>
  );
};
