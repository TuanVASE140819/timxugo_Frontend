import "./globals.css";
import { Roboto_Slab, Pirata_One } from "next/font/google";
import { ClientWrapper } from "@/components/ClientWrapper";
import { UserProvider } from "@/components/UserContext";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const pirataOne = Pirata_One({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Đi Tìm Lỳ Xỳ May Mắn Game",
  description: "Find hidden treasures on the map!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={robotoSlab.className}>
        <UserProvider>
          <ClientWrapper pirataFont={pirataOne.style.fontFamily}>
            {children}
          </ClientWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
