import "./globals.css";
import { Roboto_Slab, Pirata_One } from "next/font/google";
import { ClientWrapper } from "@/components/ClientWrapper";

const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const pirataOne = Pirata_One({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Treasure Hunt Game",
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
        <ClientWrapper pirataFont={pirataOne.style.fontFamily}>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
