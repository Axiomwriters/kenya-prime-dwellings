import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Users,
  BarChart,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from '@clerk/clerk-react'

const mainItems = [
  { title: "Dashboard", url: "/professional", icon: LayoutDashboard },
  { title: "My Profile", url: "/professional/profile", icon: User },
  { title: "Projects", url: "/professional/projects", icon: Briefcase },
  { title: "Clients", url: "/professional/clients", icon: Users },
  { title: "Analytics", url: "/professional/analytics", icon: BarChart },
];

export function ProfessionalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
            Professional Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 hover:bg-primary/10 transition-all",
                          isActive && "bg-primary/20 border-l-4 border-primary text-primary font-medium"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && (
                          <>
                            <span>{item.title}</span>
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 hover:bg-muted transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {!isCollapsed && <span>Back to Main Site</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserButton />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.fullName || user?.firstName|| 'Professional'}</span>
                <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
