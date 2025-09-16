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
import TouristAuthScreen from '@/components/auth/TouristAuthScreen';
import AdminAuthScreen from '@/components/auth/AdminAuthScreen';
import { useAuth } from '@/contexts/AuthContext';
import ViewToggle from '@/components/ViewToggle'; // Adjust path as needed

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentView } = useApp();
  const { user, loading } = useAuth(); // Added loading from AuthContext

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'tourist') {
      return <TouristAuthScreen />;
    }
    return <AdminAuthScreen />;
  }

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