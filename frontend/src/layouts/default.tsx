import { Navbar } from "@/components/navbar";
import { useGetStatusQuery } from "@/services/api";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {

  const { isError } = useGetStatusQuery()
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        {!isError && <p className="text-success">All systems working.</p>}
        {isError && <p className="text-success">Something is wrong...</p>}
      </footer>
    </div>
  );
}
