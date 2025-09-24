
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';

const AuthScreen: React.FC = () => {
  const { signInAuthority, signUpAuthority } = useAuthorityAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'police', // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isLoginMode) {
        await signInAuthority(formData.email, formData.password);
      } else {
        await signUpAuthority(formData.email, formData.password, formData.fullName, formData.role);
      }
      // On success, the main app component will redirect to the dashboard.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLoginMode ? 'Authority Login' : 'Authority Registration'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoginMode && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
            </div>
          )}
          <div className="space-y-2 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
          </div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
          </div>
          {!isLoginMode && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="role">Role</Label>
              <select id="role" value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="w-full p-2 border rounded">
                <option value="police">Police</option>
                <option value="hospital">Hospital</option>
                <option value="embassy">Embassy</option>
              </select>
            </div>
          )}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Loading...' : (isLoginMode ? 'Login' : 'Register')}
          </Button>
          <Button variant="link" onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-4">
            {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
