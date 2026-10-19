import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Header, Footer, Settings } from "@/components/shell";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/inter";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "每一种美，都有自己的声音 | L’Oréal Groupe",
    template: "%s | BEAUTY IN EVERY STORY",
  },
  description:
    "从一段音乐开始，听见她选择表达的自己。探索音乐、妆容与自主表达的故事展览。",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <a className="skip" href="#main-content">
            跳到主要内容
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Settings />
        </Providers>
      </body>
    </html>
  );
}
