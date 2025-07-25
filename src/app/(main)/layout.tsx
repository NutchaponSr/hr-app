import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-0 xl:px-32">
        <div className="md:my-10">
          <div className="grid grid-cols-12 gap-x-[3.125vw] w-full">
            {children}
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;