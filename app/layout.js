import { Toaster } from "sonner";
import "./globals.css";


export const metadata = {
  title: "DropNext",
  description: "Get your product at lowest price",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors/>
      </body>
    </html>
  );
}
