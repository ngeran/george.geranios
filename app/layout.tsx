import type { Metadata } from "next";
import { Archivo_Narrow, Hanken_Grotesk } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const archivo = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "George Geranios", template: "%s — George Geranios" },
  description: "Selected photographic works by George Geranios.",
  openGraph: {
    title: "George Geranios",
    description: "Selected photographic works by George Geranios.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${hanken.variable}`}>
      <body className="bg-background font-body text-on-background antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Sidebar />
          <div className="pt-16 lg:pt-0 lg:ml-[248px] min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
