import { SideNavOption } from "@/lib/types";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./logo.component.shared";
import logo from "../../assets/images/profile-image.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, Cog } from "lucide-react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch } from "react-redux";
import { logout } from "@/config/stores/slices/auth.slice";
import { Storages } from "@/lib/helpers";

interface SidenavProps {
  navOptions?: SideNavOption[];
  className?: string;
  redirectPath?: string;
  isExpanded?: boolean;
  toggleSidebar?: () => void;
}

function SideNav({
  className,
  navOptions,
  redirectPath = "",
  isExpanded = true,
  toggleSidebar,
}: SidenavProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Storages.clearStorage("local");
    dispatch(logout());
    navigate(`${redirectPath}/login`);
  };

  return (
    <aside
      className={`col-span-1 row-span-full bg-[#fff] flex flex-col ${className} shadow-md pb-7 transition-all duration-300 ${isExpanded ? "p-3 w-[250px]" : "p-2 w-[80px] items-center"}`}
    >
      <div
        className={`group/top flex items-center w-full ${isExpanded ? "justify-between" : "justify-center mt-2 cursor-pointer"}`}
        onClick={!isExpanded && toggleSidebar ? toggleSidebar : undefined}
      >
        {isExpanded ? (
          <>
            <Logo isBackground={false} isExpanded={isExpanded} />
            {toggleSidebar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
              >
                <GoSidebarCollapse size={22} />
              </button>
            )}
          </>
        ) : (
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute transition-all duration-300 group-hover/top:opacity-0 group-hover/top:scale-75 group-hover/top:-rotate-12 pointer-events-none">
              <Logo isBackground={false} isExpanded={isExpanded} />
            </div>
            <div className="absolute opacity-0 scale-75 rotate-12 transition-all duration-300 group-hover/top:opacity-100 group-hover/top:scale-100 group-hover/top:rotate-0 text-gray-500 bg-gray-100 p-2 rounded-md pointer-events-none">
              <GoSidebarExpand size={22} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-4 gap-4 w-full">
        {navOptions &&
          navOptions.map(({ Icon, title, url }) => {
            return (
              <NavLink
                to={url}
                end={url === ""}
                title={!isExpanded ? title : undefined}
                className={({ isActive }) =>
                  `group flex items-center ${isExpanded ? "gap-[1rem] p-2" : "justify-center p-3"} rounded-md transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-muted text-base shadow-sm ring-1 ring-black/5"
                      : `text-[#2a2a2a] hover:bg-gray-100/80 active:scale-95 ${isExpanded ? "hover:pl-4" : ""}`
                  }`
                }
                key={url}
              >
                {({ isActive }) => (
                  <>
                    <div className={`${isExpanded ? "" : "mx-auto"}`}>
                      <Icon
                        size={24}
                        color={`${isActive ? "#5164E8" : "#969696"}`}
                        className={`transition-all duration-300 shrink-0 ${isActive ? "scale-105" : "group-hover:scale-110 group-hover:-rotate-3"}`}
                      />
                    </div>
                    {isExpanded && (
                      <span
                        className={`${isActive ? "text-base font-semibold" : "text-[#969696] group-hover:text-[#2a2a2a]"} font-medium text-[16px] transition-all duration-300 whitespace-nowrap`}
                      >
                        {title}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`bg-[#F0F0F0] ${isExpanded ? "w-fit pr-3 gap-2" : "w-10 h-10 p-1 mx-auto justify-center"} flex items-center rounded-full mt-auto cursor-pointer transition-all duration-300 hover:bg-[#E5E5E5] hover:shadow-sm hover:-translate-y-1 active:translate-y-0 active:scale-95 group`}
          >
            <Avatar className="size-8 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={logo} sizes="sm" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <Menu
                size={18}
                className="transition-transform duration-300 group-hover:rotate-180 text-[#555] group-hover:text-black shrink-0"
              />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-40 p-2 rounded-xl bg-[#232323] shadow-lg shadow-black/20 border-none"
          align="start"
          sideOffset={8}
        >
          <div className="flex flex-col space-y-1">
            <NavLink
              to={`${redirectPath}/profile`}
              className="flex items-center text-[#F4F4F4] gap-2 p-2 hover:bg-[#333333] rounded-md transition-colors text-sm font-medium"
            >
              <Cog size={20} color="#969696" />
              <span>Profile</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 hover:bg-[#333333] text-[#F4F4F4] rounded-md transition-colors text-sm font-medium w-full"
            >
              <LogOut size={20} color="#969696" />
              <span>Logout</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </aside>
  );
}

export default SideNav;
