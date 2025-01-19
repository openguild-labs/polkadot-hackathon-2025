import Layout from '@/components/layout/home.layout';

export const generateMetadata = () => {
  return {
    title: "Hakifi | Market"
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

