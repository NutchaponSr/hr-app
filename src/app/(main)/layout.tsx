import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

import { SidebarProvider } from "@/providers/sidebar-provider";
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="w-screen h-full relative flex bg-background">
        <Sidebar />
        <div className="order-3 flex flex-col w-full overflow-hidden isolation-auto relative">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;