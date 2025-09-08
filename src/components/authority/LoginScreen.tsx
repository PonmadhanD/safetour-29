import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const LoginScreen: React.FC = () => {
  const { setAuthorityPage, setCurrentAuthority } = useApp();
  const [formData, setFormData] = useState({
    badgeId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const authority = {
      id: 'auth_' + Date.now(),
      name: 'Officer Rajesh Kumar',
      email: 'rajesh.kumar@nepd.gov.in',
      role: 'officer' as const,
      department: 'Northeast Police Department',
      badge: formData.badgeId || 'NE-2024-001',
      permissions: ['view_tourists', 'create_efir', 'send_alerts', 'verify_ids']
    };
    
    setCurrentAuthority(authority);
    setAuthorityPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center text-white space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Authority Portal</h1>
            <p className="text-white/90">Northeast India Tourism Safety</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Login
            </CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline" className="bg-primary-light text-primary">
                Police
              </Badge>
              <Badge variant="outline" className="bg-secondary-light text-secondary">
                Emergency Services
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge-id">Badge ID / Employee ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="badge-id"
                  value={formData.badgeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, badgeId: e.target.value }))}
                  placeholder="Enter your badge ID"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleLogin}
              >
                <Shield className="w-4 h-4 mr-2" />
                Login to Dashboard
              </Button>
              
              <div className="text-center">
                <Button variant="link" className="text-muted-foreground">
                  Forgot Password?
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="glass" size="sm" className="justify-start">
                Emergency Hotline
              </Button>
              <Button variant="glass" size="sm" className="justify-start">
                Command Center
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm">
          <p>Government of India • Ministry of Tourism</p>
          <p>Secure Access Portal v2.1</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;