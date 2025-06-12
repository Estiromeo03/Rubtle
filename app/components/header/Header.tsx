import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { useState } from 'react';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { SettingsButton } from '~/components/ui/SettingsButton';
import { ControlPanel } from '~/components/@settings';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { workbenchStore } from '~/lib/stores/workbench';

export function Header() {
  const chat = useStore(chatStore);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
              <div className="flex items-center justify-between flex-1 ml-4">
                {/* Izquierda: Terminal y Sync */}
                <div className="flex items-center gap-4">
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
                    {/* Agrega aquí <DropdownMenu.Content> si quieres que el menú se despliegue */}
                  </DropdownMenu.Root>
                </div>

                {/* Derecha: botón de configuración */}
                <SettingsButton onClick={() => setSettingsOpen(true)} />
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
    </header>
  );
}
