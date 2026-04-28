import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NkundaAuto — Véhicules en RDC",
  description: "Achetez et vendez des véhicules en toute confiance en République Démocratique du Congo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
