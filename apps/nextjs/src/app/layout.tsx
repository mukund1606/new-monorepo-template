import type { Metadata } from "next";

import "~/styles/globals.css";

import Header from "~/components/header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SSA Portal",
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
