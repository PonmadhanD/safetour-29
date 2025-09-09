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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data.user) {
        // Create authority profile from user data
        const authority = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || 'Authority User',
          email: data.user.email || '',
          role: 'officer' as const,
          department: 'Northeast Police Department',
          badge: data.user.user_metadata?.badge_id || 'NE-2024-001',
          permissions: ['view_tourists', 'create_efir', 'send_alerts', 'verify_ids']
        };
        
        setCurrentAuthority(authority);
        setAuthorityPage('dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: 'Authority User',
            badge_id: 'NE-2024-001'
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        setError('Account created successfully! Please check your email to confirm your account, then sign in.');
      }
    } catch (err) {
      setError('An unexpected error occurred during sign up. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center text-primary-foreground space-y-4">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Authority Portal</h1>
            <p className="text-primary-foreground/90">Government of India • Tourism Safety</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-card shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-primary" />
              Secure Access
            </CardTitle>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant="outline" className="border-primary text-primary">
                Police Department
              </Badge>
              <Badge variant="outline" className="border-secondary text-secondary-foreground bg-secondary/10">
                Emergency Services
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your official email"
                    className="pl-10"
                    disabled={isLoading}
                    required
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
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing In...' : 'Access Dashboard'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Authority Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">Emergency Access</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" className="justify-start text-primary border-primary">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Hotline: 100
              </Button>
              <Button variant="outline" size="sm" className="justify-start text-primary border-primary">
                <Shield className="w-4 h-4 mr-2" />
                Tourist Helpline: 1363
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-primary-foreground/70 text-sm">
          <p className="font-medium">Government of India • Ministry of Tourism</p>
          <p>Secure Access Portal v3.0 • Northeast Region</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;