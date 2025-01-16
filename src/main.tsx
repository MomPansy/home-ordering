import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router'
import { Order } from './components/order.$orderId.tsx'
import { Toaster } from "@/components/ui/toaster"
import { Orders } from './components/orders.tsx';
import { MainMenu } from './components/main-menu.tsx';
import './index.css'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx';
import { AppSidebar } from './components/app-sidebar.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="fixed" />
        <div className='pl-6'>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="order/:orderId" element={<Order />} />
              <Route path="orders" element={<Orders />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>,
)
