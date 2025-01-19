import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head />
      <main className="container mx-auto max-w-full flex flex-col gap-20 bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}
