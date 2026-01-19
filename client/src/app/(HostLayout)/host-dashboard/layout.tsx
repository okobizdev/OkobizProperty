import NextTopLoader from "nextjs-toploader";
import NavBar from "../components/hostNav/NavBar";
import Providers from "@/providers/Providers";

export default function HostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Providers>
        <NavBar />
        <NextTopLoader showSpinner={false} color="#08396D" />
        {children}
      </Providers>

    </div>
  );
}
