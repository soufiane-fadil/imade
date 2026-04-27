import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison·Calorie — Le journal de la rénovation énergétique",
  description:
    "Articles, dossiers et certification professionnelle pour la rénovation énergétique en France.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
