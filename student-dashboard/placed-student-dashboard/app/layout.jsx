'use client';
import React, { useState } from 'react';
import Sidebar from '../src/components/common/Sidebar';
import Topbar from '../src/components/common/Topbar';
import PlacedWatermark from '../src/components/common/PlacedWatermark';
import '../src/index.css';
import '../src/App.css';

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>PLACED — Placement & Assessment Intelligence Platform</title>
        <meta name="description" content="AI-Powered Student Career Readiness, Assessments & Placement Intelligence Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-shell">
          {/* Mobile sidebar overlay backdrop */}
          {mobileSidebarOpen && (
            <div
              className="mobile-sidebar-overlay"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileSidebarOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <div className="main-area">
            <Topbar onMenuClick={() => setMobileSidebarOpen(prev => !prev)} />
            <PlacedWatermark />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
