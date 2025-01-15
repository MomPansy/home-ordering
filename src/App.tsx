
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainMenu } from "./components/main-menu"
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster />
      <SidebarTrigger className="fixed" />
      <div className='pl-6'>
        <MainMenu />
      </div>
    </SidebarProvider>
  )
}

export default App
