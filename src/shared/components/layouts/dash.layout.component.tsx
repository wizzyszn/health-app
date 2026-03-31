import { SideNavOption } from "@/lib/types";
import { Outlet, useMatches, UIMatch } from "react-router-dom";
// import useCheckOnlineStatus from "@/shared/hooks/use-internet-connection";
import {
  Suspense,
  // useEffect,
  useState,
} from "react";
// import OnlineIndicator from "@/shared/components/online-indicator.component";
import Spinner from "@/shared/components/spinner.component";
import SideNav from "../sidenav.component.shared";
import DashHeader from "../dash-header.component.shared";
import { useQuery } from "@tanstack/react-query";
import { refreshTokenReq } from "@/config/service/auth.service";
import { useSelector } from "react-redux";
import { RootState } from "@/config/stores/store";

const LoadingFallback = () => (
  <div className="grid h-svh w-full place-items-center">
    <Spinner />
  </div>
);

type HeaderHandle = { headerChild?: React.ReactNode };

function HeaderContent() {
  const matches = useMatches() as UIMatch<unknown, HeaderHandle>[];
  // Find the deepest match that provides header content
  const currentMatch = matches
    .slice()
    .reverse()
    .find((match) => Boolean(match.handle?.headerChild));

  return currentMatch?.handle?.headerChild ?? null;
}

interface DashLayoutProps {
  sideNavOptions: SideNavOption[];
  redirectPath?: string;
}

function DashLayout({ sideNavOptions, redirectPath }: DashLayoutProps) {
  // const isOnline = useCheckOnlineStatus();
  const { refreshToken, role } = useSelector((state: RootState) => state.auth);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // ── Online banner height animation ────────────────────────
  // const [bannerHeight, setBannerHeight] = useState(isOnline ? 0 : 40);

  // useEffect(() => {
  //   let timeout: ReturnType<typeof setTimeout>;

  //   if (isOnline) {
  //     // small delay → smooth hide
  //     timeout = setTimeout(() => {
  //       setBannerHeight(0);
  //     }, 1800);
  //   } else {
  //     setBannerHeight(40);
  //   }

  //   return () => clearTimeout(timeout);
  // }, [isOnline]);

  // ── Token refresh ─────────────────────────────────────────
  const shouldRefresh = Boolean(refreshToken && role);

  useQuery({
    queryKey: ["refresh-auth"],
    queryFn: async () => {
      if (!refreshToken || !role) throw new Error("Missing token or role");
      return refreshTokenReq({ refreshToken, role });
    },
    enabled: shouldRefresh,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className={`h-svh max-w-[1920px] mx-auto bg-muted overflow-hidden flex flex-col md:grid ${isSidebarExpanded ? "md:grid-cols-[250px_1fr]" : "md:grid-cols-[80px_1fr]"} md:grid-rows-[auto_1fr] transition-[grid-template-columns] duration-300`}
    >
      <SideNav
        navOptions={sideNavOptions}
        redirectPath={redirectPath}
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="hidden md:flex border-r border-[#E5E5E5] row-span-full z-10 sticky top-0 h-svh"
      />

      {/* Header always on top row */}
      <DashHeader headerChild={<HeaderContent />} />

      {/* Main content */}
      <div className="relative overflow-y-auto p-6 md:p-10 lg:p-8">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>

      {/* Online status banner */}
      {/* <OnlineIndicator status={isOnline} height={bannerHeight} /> */}
    </div>
  );
}

export default DashLayout;
