import React from 'react';
import './globals.css';

export const metadata = {
  title: 'PLACED — Placement & Assessment Intelligence',
  description: 'Placement & Assessment Intelligence Administrative Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js" async></script>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
