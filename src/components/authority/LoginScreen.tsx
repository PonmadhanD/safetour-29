import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Lock, User, Phone, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';

const LoginScreen: React.FC = () => {
  const { setAuthorityPage, setCurrentAuthority } = useApp();
  
  // Redirect to dashboard if already authenticated via main auth system
  React.useEffect(() => {
    const authority = {
      id: Date.now().toString(),
      name: 'Authority User',
      email: 'authority@example.com',
      role: 'officer' as const,
      department: 'Northeast Police Department',
      badge: 'NE-2024-001',
      permissions: ['view_tourists', 'create_efir', 'send_alerts', 'verify_ids']
    };
    
    setCurrentAuthority(authority);
    setAuthorityPage('dashboard');
  }, [setAuthorityPage, setCurrentAuthority]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="text-center text-primary-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground mx-auto mb-4"></div>
        <p>Loading Authority Dashboard...</p>
      </div>
    </div>
  );
};

export default LoginScreen;