"use client";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LatestChange } from "@/components/leatest-change";
import {
  LayoutGridIcon,
  SettingsIcon,
  CreditCardIcon,
  HelpCircleIcon,
  BookOpenIcon,
  ZapIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

type SidebarSection = {
  label: string;
  items: SidebarNavItem[];
};

const navSections: SidebarSection[] = [
  {
    label: "Product",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <LayoutGridIcon />,
        isActive: true,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: <SettingsIcon />,
      },
      {
        title: "Billing",
        url: "#",
        icon: <CreditCardIcon />,
      },
    ],
  },
];

const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    url: "#",
    icon: <HelpCircleIcon />,
  },
  {
    title: "Documentation",
    url: "#",
    icon: <BookOpenIcon />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      className={cn(
        "*:data-[slot=sidebar-inner]:bg-background",
        "*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,--theme(--color-foreground/.08),transparent)]",
        "**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/75",
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-14 justify-center border-b px-2">
        <SidebarMenuButton asChild>
          <a href="/dashboard">
            <ZapIcon className="size-4" />
            <span className="font-medium">Starter Kit</span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <LatestChange />
        <SidebarMenu className="border-t p-2">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground"
                isActive={item.isActive ?? false}
                size="sm"
              >
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
