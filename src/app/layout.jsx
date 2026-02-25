import "./globals.css";

export const metadata = {
  title: "Scroll Car Animation",
  description: "Scroll-driven car animation built with Next.js, GSAP, and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
