import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Lock, User, Phone, AlertTriangle, MapPin } from 'lucide-react';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';
import { useApp } from '@/contexts/AppContext';
import Logo from '../../../public/logo.jpeg';

const AdminAuthScreen: React.FC = () => {
  const { setAuthorityPage, setCurrentAuthority } = useApp();
  const { signInAuthority, signUpAuthority } = useAuthorityAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: 'Authority User'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Splash screen for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await signInAuthority(formData.email, formData.password);

      if (authError) {
        if (authError.message.includes('invalid-credential')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(authError.message);
        }
        return;
      }

      const authority = {
        id: Date.now().toString(),
        name: formData.fullName,
        email: formData.email,
        role: 'officer' as const,
        department: 'Northeast Police Department',
        badge: 'NE-2024-001',
        permissions: ['view_tourists', 'create_efir', 'send_alerts', 'verify_ids']
      };
      
      setCurrentAuthority(authority);
      setAuthorityPage('dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await signUpAuthority(formData.email, formData.password, formData.fullName, 'officer');

      if (signUpError) {
        if (signUpError.message.includes('already-in-use')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      setError('Account created successfully! Please check your email to confirm your account, then sign in.');
      setIsSignUp(false);
    } catch (err) {
        setError('An unexpected error occurred during sign up. Please try again.');
        console.error('Sign up error:', err);
        setFormData({
            email: '',
            password: '',
            fullName: 'Authority User'
        });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 text-center">
        <div className="flex-grow flex flex-col items-center justify-center space-y-6">
            <div className="bg-white p-2 rounded-xl shadow-lg">
                <img src={Logo} alt="Trip Bharat Logo" className="w-20 h-20 object-cover rounded-lg" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Trip Bharat</h1>
            <p className="text-xl text-primary-foreground/80">Northeast India Tourism Safety</p>
        
            <div className="flex gap-8 my-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Government Verified</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Real-time Safety</span>
                </div>
            </div>

            <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
                onClick={() => setShowSplash(false)}
            >
                Get Started
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-primary-foreground space-y-4">
          <div className="mx-auto w-24 h-24 bg-secondary rounded-full flex items-center justify-center shadow-lg">
            <img src={Logo} alt="Trip Bharat" className="w-24 h-24 object-cover rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/90">Government of India • Tourism Safety Authority Portal</p>
          </div>
        </div>

        <Card className="bg-card shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-primary" />
              {isSignUp ? 'Create Admin Account' : 'Admin Access'}
            </CardTitle>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant="outline" className="border-primary text-primary">
                Admin Dashboard
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                Web Portal
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className={error.includes('successfully') ? 'border-green-500' : 'border-destructive'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              )}

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
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                    minLength={6}
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
                  {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Access Dashboard')}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default AdminAuthScreen;
