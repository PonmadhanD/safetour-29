import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import TouristApp from "@/components/TouristApp";
import AdminApp from "@/components/AdminApp";
import TouristAuthScreen from '@/components/auth/TouristAuthScreen';
import AdminAuthScreen from '@/components/auth/AdminAuthScreen';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/tourist" replace />} />
            <Route path="/tourist/*" element={<TouristRoute />} />
            <Route path="/admin/*" element={<AdminRoute />} />
            <Route path="*" element={<Navigate to="/tourist" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const TouristRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<TouristAuthScreen />} />
      <Route path="/app" element={<TouristApp />} />
    </Routes>
  );
};

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminAuthScreen />} />
      <Route path="/dashboard" element={<AdminApp />} />
    </Routes>
  );
};

export default App;