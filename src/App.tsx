
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainMenu } from "./components/main-menu"

function App() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="fixed" />
      <div className='pl-6'>
        <MainMenu />
      </div>
    </SidebarProvider>
  )
}

export default App
