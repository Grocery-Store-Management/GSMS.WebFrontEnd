import React, { useState, useMemo } from 'react';

// create context
interface ISidebarContext {
  isSidebarOpen: boolean
  closeSidebar: () => void
  toggleSidebar: () => void
}

export const SidebarContext = React.createContext<ISidebarContext>({ isSidebarOpen: false, closeSidebar: () => { }, toggleSidebar: () => { } });

interface ISidebarPovider { children: React.ReactNode }

export const SidebarProvider = ({ children }: ISidebarPovider) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  return <SidebarContext.Provider value={{
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  }}>{children}</SidebarContext.Provider>
}
