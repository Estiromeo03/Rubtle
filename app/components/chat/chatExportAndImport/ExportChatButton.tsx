import WithTooltip from '~/components/ui/Tooltip';
import { IconButton } from '~/components/ui/IconButton';
import React from 'react';

export const ExportChatButton = ({ exportChat }: { exportChat?: () => void }) => {
  return (
    <WithTooltip tooltip="Export Chat">
      <IconButton title="Export Chat" className="border border-[#444]" onClick={() => exportChat?.()}>
        <div className="i-ph:download-simple text-gray-200 text-xl"></div>
      </IconButton>
    </WithTooltip>
  );
};
