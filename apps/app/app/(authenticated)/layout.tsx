import { auth, currentUser } from '@repo/auth/server';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { OrganizationProvider } from '@repo/design-system/providers/organization-provider';
import { showBetaFeature } from '@repo/feature-flags';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';
import { env } from '@/env';
import { NotificationsProvider } from './components/notifications-provider';
import { GlobalSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <OrganizationProvider userId={user.id}>
        <SidebarProvider>
          <GlobalSidebar>
            {betaFeature && (
              <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
                Beta feature now available
              </div>
            )}
            {children}
          </GlobalSidebar>
        </SidebarProvider>
      </OrganizationProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
