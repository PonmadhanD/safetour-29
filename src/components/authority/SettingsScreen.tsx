import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, User, Shield, Bell, Globe, 
  Key, Database, Activity, LogOut, Settings
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const SettingsScreen: React.FC = () => {
  const { setAuthorityPage, currentAuthority } = useApp();

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setAuthorityPage('dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Authority Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences and system configuration</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{currentAuthority?.name}</p>
                <p className="text-sm text-muted-foreground">{currentAuthority?.email}</p>
              </div>
              <Badge className="bg-success-light text-success">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Badge ID</p>
                <p className="font-medium">{currentAuthority?.badge}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{currentAuthority?.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{currentAuthority?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p className="font-medium">{currentAuthority?.permissions.length} granted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login Alerts</p>
                <p className="text-sm text-muted-foreground">Notify on new device login</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline">
                View Login History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Alerts</p>
                <p className="text-sm text-muted-foreground">Immediate notifications for emergencies</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Tourist Registrations</p>
                <p className="text-sm text-muted-foreground">Notify when new tourists register</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incident Reports</p>
                <p className="text-sm text-muted-foreground">New E-FIR submissions</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Updates</p>
                <p className="text-sm text-muted-foreground">Platform maintenance and updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-secondary" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-assign E-FIRs</p>
                <p className="text-sm text-muted-foreground">Automatically assign new reports to available officers</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Location Tracking</p>
                <p className="text-sm text-muted-foreground">Monitor tourist locations in real-time</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics Data Collection</p>
                <p className="text-sm text-muted-foreground">Collect data for analytics and reporting</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Data Export
              </Button>
              <Button variant="outline">
                System Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API & Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              API & Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">Emergency Services API</p>
                  <p className="text-sm text-muted-foreground">Connected to local emergency services</p>
                </div>
                <Badge className="bg-success text-white">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">Weather Service Integration</p>
                  <p className="text-sm text-muted-foreground">Real-time weather data for alerts</p>
                </div>
                <Badge className="bg-success text-white">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">Blockchain Network</p>
                  <p className="text-sm text-muted-foreground">Tourist ID verification network</p>
                </div>
                <Badge className="bg-success text-white">Synced</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View API Documentation
            </Button>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              User Manual & Documentation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Contact Technical Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Report System Issues
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Training Resources
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-warning-light rounded-lg">
              <div>
                <p className="font-medium">System Version</p>
                <p className="text-sm text-muted-foreground">v2.1.0 (Latest)</p>
              </div>
              <Badge variant="outline">Up to date</Badge>
            </div>
            
            <Button variant="outline" className="w-full justify-start text-emergency hover:text-emergency">
              <LogOut className="w-4 h-4 mr-2" />
              Logout from All Devices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;