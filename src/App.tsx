import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/contexts/AppContext";
import TouristApp from "@/components/TouristApp";
import AuthorityApp from "@/components/AuthorityApp";
import ViewToggle from "@/components/ViewToggle";

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentView } = useApp();
  
  return (
    <>
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
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
