import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, User, Shield, Bell, Globe, 
  Key, Database, Activity, LogOut, Settings
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SettingsScreen: React.FC = () => {
  const { setAuthorityPage, currentAuthority } = useApp();
  const { signOutAuthority } = useAuthorityAuth();
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutAuthority();
      setAuthorityPage('login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSaveSettings = () => {
    // Placeholder for saving settings (e.g., API call to persist switch states)
    console.log('Settings saved');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md border-b sticky top-0 z-10"
        >
          <div className="p-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAuthorityPage('dashboard')}
                    className="hover:bg-primary/10"
                  >
                    <ArrowLeft className="w-5 h-5 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Dashboard</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-primary">Authority Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your preferences and system configuration</p>
              </div>
            </div>
            <Button 
              variant="default" 
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-primary/90"
            >
              Save Settings
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <User className="w-5 h-5 text-primary" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg text-primary">{currentAuthority?.name}</p>
                      <p className="text-sm text-muted-foreground">{currentAuthority?.email}</p>
                    </div>
                    <Badge className="bg-success/10 text-success border border-success/20">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Badge ID</p>
                      <p className="font-medium text-primary">{currentAuthority?.badge}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium text-primary">{currentAuthority?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize text-primary">{currentAuthority?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Permissions</p>
                      <p className="font-medium text-primary">{currentAuthority?.permissions.length} granted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Shield className="w-5 h-5 text-primary" />
                    Security & Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Login Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify on new device login</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 hover:bg-primary/10">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="flex-1 hover:bg-primary/10">
                      View Login History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
                <CardHeader className="bg-gradient-to-r from-warning/5 to-transparent rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Bell className="w-5 h-5 text-warning" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Emergency Alerts</p>
                      <p className="text-sm text-muted-foreground">Immediate notifications for emergencies</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">New Tourist Registrations</p>
                      <p className="text-sm text-muted-foreground">Notify when new tourists register</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Incident Reports</p>
                      <p className="text-sm text-muted-foreground">New E-FIR submissions</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">System Updates</p>
                      <p className="text-sm text-muted-foreground">Platform maintenance and updates</p>
                    </div>
                    <Switch />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-transparent rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Settings className="w-5 h-5 text-secondary" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Auto-assign E-FIRs</p>
                      <p className="text-sm text-muted-foreground">Automatically assign new reports to available officers</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Real-time Location Tracking</p>
                      <p className="text-sm text-muted-foreground">Monitor tourist locations in real-time</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary">Analytics Data Collection</p>
                      <p className="text-sm text-muted-foreground">Collect data for analytics and reporting</p>
                    </div>
                    <Switch defaultChecked />
                  </motion.div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button variant="outline" className="hover:bg-primary/10">
                      <Database className="w-4 h-4 mr-2" />
                      Data Export
                    </Button>
                    <Button variant="outline" className="hover:bg-primary/10">
                      System Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* API & Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="w-5 h-5 text-primary" />
                  API & Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-transform"
                  >
                    <div>
                      <p className="font-medium text-primary">Emergency Services API</p>
                      <p className="text-sm text-muted-foreground">Connected to local emergency services</p>
                    </div>
                    <Badge className="bg-success text-white">Connected</Badge>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-transform"
                  >
                    <div>
                      <p className="font-medium text-primary">Weather Service Integration</p>
                      <p className="text-sm text-muted-foreground">Real-time weather data for alerts</p>
                    </div>
                    <Badge className="bg-success text-white">Active</Badge>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-transform"
                  >
                    <div>
                      <p className="font-medium text-primary">Blockchain Network</p>
                      <p className="text-sm text-muted-foreground">Tourist ID verification network</p>
                    </div>
                    <Badge className="bg-success text-white">Synced</Badge>
                  </motion.div>
                </div>
                <Button variant="outline" className="w-full hover:bg-primary/10">
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support & Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent rounded-t-xl">
                <CardTitle className="text-lg font-semibold">Support & Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    User Manual & Documentation
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    Contact Technical Support
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    Report System Issues
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                    Training Resources
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow border border-primary/10 bg-white rounded-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent rounded-t-xl">
                <CardTitle className="text-lg font-semibold">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">System Version</p>
                    <p className="text-sm text-muted-foreground">v2.1.0 (Latest)</p>
                  </div>
                  <Badge variant="outline" className="border-success text-success">Up to date</Badge>
                </div>
                <Popover open={showLogoutPopover} onOpenChange={setShowLogoutPopover}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout from All Devices
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Logout</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80 bg-white border-primary/20">
                    <div className="p-4">
                      <h4 className="font-medium mb-2 text-primary">Confirm Logout</h4>
                      <p className="text-sm text-muted-foreground mb-4">Are you sure you want to log out from all devices?</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          onClick={handleLogout}
                          className="flex-1"
                        >
                          Logout
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowLogoutPopover(false)}
                          className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SettingsScreen;