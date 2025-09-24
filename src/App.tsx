import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthorityAuthProvider } from '@/contexts/AuthorityAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import TouristApp from "@/components/TouristApp";
import AuthorityApp from "@/components/AuthorityApp";
import ViewToggle from '@/components/ViewToggle';

const queryClient = new QueryClient();

const AppBody = () => {
  const { currentView } = useApp();

  if (currentView === 'tourist') {
    return (
      <AuthProvider>
        <LanguageProvider>
          <TouristApp />
        </LanguageProvider>
      </AuthProvider>
    );
  }

  if (currentView === 'authority') {
    return (
      <AuthProvider>
        <AuthorityAuthProvider>
          <AuthorityApp />
        </AuthorityAuthProvider>
      </AuthProvider>
    );
  }

  return null; // Should not happen
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <ViewToggle />
        <AppBody />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;