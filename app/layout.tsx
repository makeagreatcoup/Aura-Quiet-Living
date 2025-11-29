import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aura - Organic Technology',
  description: 'Aura - Premium warm minimalist electronics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
          
          html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: #F5F2EB;
            color: #2C2A26;
          }
          
          h1, h2, h3, h4, .font-serif {
            font-family: 'Playfair Display', serif;
          }

          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.2, 1, 0.3, 1) forwards;
          }

          @keyframes slide-up-fade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up-fade {
             animation: slide-up-fade 0.3s ease-out forwards;
          }
        `}} />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}