import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { useNavigate, useSearchParams } from '@remix-run/react';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = () => json({});

/**
 * Landing page component for Bolt
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const started = searchParams.get('start');

  if (!started) {
    return (
      <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
        <BackgroundRays />
        <Header />
        <div className="flex flex-col flex-1 items-center justify-center text-center px-4">
          <h1 className="text-3xl lg:text-6xl font-bold text-bolt-elements-textPrimary mb-4">Create with no limits</h1>
          <p className="text-md lg:text-xl mb-8 text-bolt-elements-textSecondary">
            Describe what you want with words, no code.
          </p>
          <button onClick={() => navigate('?start=1')} className="px-6 py-2 rounded-md bg-accent text-white">
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
