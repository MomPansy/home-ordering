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
    url: "#meat",
    icon: <Drumstick size={24} />,
  },
  {
    title: "Vegetable",
    url: "#vegetable",
    icon: <LeafyGreen size={24} />,
  },
  {
    title: "Egg",
    url: "#egg",
    icon: < Egg size={24} />,
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='m-auto text-2xl h-20 text-black'>66 Ordering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} size='lg'>
                    <a href={item.url} className="flex gap-2 items-center justify-center">
                      {item.icon}
                      <span className='text-xl'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  )
}
