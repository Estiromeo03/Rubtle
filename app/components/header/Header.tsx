import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { useState, useCallback } from 'react';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { SettingsButton } from '~/components/ui/SettingsButton';
import { ControlPanel } from '~/components/@settings';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { workbenchStore } from '~/lib/stores/workbench';
import { PushToGitHubDialog } from '~/components/@settings/tabs/connections/components/PushToGitHubDialog';
import { toast } from 'react-toastify';

export function Header() {
  const chat = useStore(chatStore);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);

  const handleSyncFiles = useCallback(async () => {
    setIsSyncing(true);
    try {
      const directoryHandle = await window.showDirectoryPicker();
      await workbenchStore.syncFiles(directoryHandle);
      toast.success('Files synced successfully');
    } catch (error) {
      console.error('Error syncing files:', error);
      toast.error('Failed to sync files');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handlePush = useCallback(async (repoName: string, username?: string, token?: string, isPrivate?: boolean) => {
    try {
      const commitMessage = prompt('Please enter a commit message:', 'Initial commit') || 'Initial commit';
      const repoUrl = await workbenchStore.pushToGitHub(repoName, commitMessage, username, token, isPrivate ?? false);
      return repoUrl;
    } catch (error) {
      console.error('Error pushing to GitHub:', error);
      toast.error('Failed to push to GitHub');
      throw error;
    }
  }, []);

  return (
    <header
      className={classNames('flex items-center p-5 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          {/* <span className="i-bolt:logo-text?mask w-[46px] inline-block" /> */}
          <img src="/RUBTLELOGO.svg" alt="logo" className="w-[90px]" />
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and SettingsButton only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="flex items-center gap-2 mr-1">
                <SettingsButton onClick={() => setSettingsOpen(true)} />
                <PanelHeaderButton
                  onClick={() => {
                    workbenchStore.toggleTerminal(!workbenchStore.showTerminal.get());
                  }}
                >
                  <div className="i-ph:terminal" />
                  Toggle Terminal
                </PanelHeaderButton>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="text-sm flex items-center gap-1 text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md p-1 enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed">
                    <div className="i-ph:box-arrow-up" />
                    Sync & Export
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className={classNames(
                      'min-w-[240px] z-[250]',
                      'bg-white dark:bg-[#141414]',
                      'rounded-lg shadow-lg',
                      'border border-gray-200/50 dark:border-gray-800/50',
                      'animate-in fade-in-0 zoom-in-95',
                      'py-1',
                    )}
                    sideOffset={5}
                    align="end"
                  >
                    <DropdownMenu.Item
                      className={classNames(
                        'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative',
                      )}
                      onClick={() => {
                        workbenchStore.downloadZip();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="i-ph:download-simple"></div>
                        <span>Download Code</span>
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={classNames(
                        'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative',
                      )}
                      onClick={handleSyncFiles}
                      disabled={isSyncing}
                    >
                      <div className="flex items-center gap-2">
                        {isSyncing ? <div className="i-ph:spinner" /> : <div className="i-ph:cloud-arrow-down" />}
                        <span>{isSyncing ? 'Syncing...' : 'Sync Files'}</span>
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={classNames(
                        'cursor-pointer flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative',
                      )}
                      onClick={() => setIsPushDialogOpen(true)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="i-ph:git-branch" />
                        Push to GitHub
                      </div>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            )}
          </ClientOnly>
        </>
      )}
      {!chat.started && (
        <div className="ml-auto">
          <ClientOnly>{() => <SettingsButton onClick={() => setSettingsOpen(true)} />}</ClientOnly>
        </div>
      )}
      <ClientOnly>{() => <ControlPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />}</ClientOnly>
      <PushToGitHubDialog isOpen={isPushDialogOpen} onClose={() => setIsPushDialogOpen(false)} onPush={handlePush} />
    </header>
  );
}
