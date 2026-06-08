import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "🦔 고슴도치 하우스",
  description: "귀여운 고슴도치를 키워보세요!",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦔</text></svg>" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FFFBF7",
                border: "1px solid #F0E4D4",
                color: "#5C3D2E",
                fontFamily: "var(--font-nunito), sans-serif",
                fontWeight: 600,
                borderRadius: "1rem",
              },
            }}
            richColors
          />
        </QueryProvider>
      </body>
    </html>
  );
}
