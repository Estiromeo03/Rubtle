import { memo } from 'react';
import { classNames } from '~/utils/classNames';

interface PanelHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelHeader = memo(({ className, children }: PanelHeaderProps) => {
  return (
    <div
      className={classNames(
        'flex items-center gap-1 bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary px-2 py-0.5 min-h-[30px] text-sm',
        className,
      )}
    >
      {children}
    </div>
  );
});
