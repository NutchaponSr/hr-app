import { Header } from "./header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="w-full h-20 shrink-0 grow-0" />
      <main className="grow">
        <div className="flex flex-row h-full w-full">
          <div className="px-16 w-full mx-auto overflow-visible">
            <section className="w-full max-w-7xl mx-auto">
              {children}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout