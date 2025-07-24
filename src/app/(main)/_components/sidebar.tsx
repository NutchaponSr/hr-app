import { SidebarContent } from "./sidebar-content";

export const Sidebar = () => {
  return (
    <aside className="order-1 lg:col-span-3 hidden lg:block">
      <div className="flex relative h-full visible">
        <div className="box-border flex flex-col justify-start grow pr-6">
          <div className="sticky top-[91px] overflow-y-auto h-[calc(100vh-61px)] w-full pr-6 after:border after:border-border after:ml-12 after:top-0 after:bottom-0 after:absolute after:right-0">
            <div className="h-7 w-full" />
            <nav className="self-start w-full mb-7">
              <SidebarContent title="แอปพลิเคชัน" description="เครื่องมือ ฯลฯ" />
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}