import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import TouristApp from "@/components/TouristApp";
import AuthorityApp from "@/components/AuthorityApp";
import ViewToggle from '@/components/ViewToggle'; // Adjust path as needed

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentView } = useApp();

  return (
    <>
      {/* View Toggle positioned at the top-right */}
      <ViewToggle />
      {currentView === 'tourist' ? <TouristApp /> : <AuthorityApp />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LanguageProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;