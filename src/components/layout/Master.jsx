import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Master = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={setIsSidebarCollapsed}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Master;
