import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import type { TabVisibilityConfig } from '~/components/@settings/core/types';
import { TAB_LABELS, TAB_ICONS } from '~/components/@settings/core/constants';

interface TabTileProps {
  tab: TabVisibilityConfig;
  onClick?: () => void;
  isActive?: boolean;
  description?: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const TabTile: React.FC<TabTileProps> = ({
  tab,
  onClick,
  isActive,
  description,
  isLoading,
  className,
  children,
}: TabTileProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={classNames(
        'relative flex items-center gap-4 p-4 rounded-lg',
        'w-full',
        'bg-white dark:bg-[#141414]',
        'border border-[#E5E5E5] dark:border-[#333333]',
        'group',
        'hover:bg-purple-50 dark:hover:bg-[#1a1a1a]',
        'hover:border-purple-200 dark:hover:border-purple-900/30',
        isActive ? 'border-purple-500 dark:border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10' : '',
        isLoading ? 'cursor-wait opacity-70' : '',
        className || ''
      )}
    >
      <motion.div
        className={classNames(
          'relative w-10 h-10 flex items-center justify-center rounded-lg',
          'bg-gray-100 dark:bg-gray-900',
          'ring-1 ring-gray-200 dark:ring-gray-700',
          'group-hover:bg-purple-100 dark:group-hover:bg-gray-700/80',
          'group-hover:ring-purple-200 dark:group-hover:ring-purple-800/30',
          isActive ? 'bg-purple-500/10 dark:bg-purple-500/10 ring-purple-500/30 dark:ring-purple-500/20' : ''
        )}
      >
        <motion.div
          className={classNames(
            TAB_ICONS[tab.id],
            'w-6 h-6',
            'text-gray-600 dark:text-gray-300',
            'group-hover:text-purple-500 dark:group-hover:text-purple-400/80',
            isActive ? 'text-purple-500 dark:text-purple-400/90' : ''
          )}
        />
      </motion.div>
      <div className="flex flex-col ml-4">
        <h3
          className={classNames(
            'text-sm font-medium',
            'text-gray-700 dark:text-gray-200',
            'group-hover:text-purple-600 dark:group-hover:text-purple-300/90',
            isActive ? 'text-purple-500 dark:text-purple-400/90' : ''
          )}
        >
          {TAB_LABELS[tab.id]}
        </h3>
        {description && (
          <p
            className={classNames(
              'text-xs',
              'text-gray-500 dark:text-gray-400',
              'group-hover:text-purple-500 dark:group-hover:text-purple-400/70',
              isActive ? 'text-purple-400 dark:text-purple-400/80' : ''
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
};
