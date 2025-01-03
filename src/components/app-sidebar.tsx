import { Drumstick, LeafyGreen, Egg } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Meat",
    url: "#",
    icon: Drumstick,
  },
  {
    title: "Vegetable",
    url: "#",
    icon: LeafyGreen,
  },
  {
    title: "Egg",
    url: "#",
    icon: Egg,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='m-auto text-2xl h-20 text-black'>66 Ordering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size='lg'>
                    <a href={item.url}>
                      <item.icon className='h-24 w-24'/>
                      <span className='text-xl'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
