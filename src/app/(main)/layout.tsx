import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { Breadcrumbs } from "./_components/breadcrumbs";
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col items-center mx-auto py-8 mt-12 md:mt-18 w-full px-6 sm:w-[88vw] sm:max-w-[1392px] sm:px-0 sm:mx-auto xl:w-[88vw]">
        <div className="grid w-full gap-[3.125vw] grid-cols-12 lg:gap-x-[min(3.334vw,48px)] xs:gap-y-[unset]">
          <div className="order-2 col-span-12 xs:order-2 s:order-2 m:order-2 xs:col-span-12 s:col-span-12 m:col-span-12 xl:col-span-9 xl:order-2 lg:col-span-9 lg:order-2">
            <Breadcrumbs /> 
            {children}
          </div>
          <Sidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;