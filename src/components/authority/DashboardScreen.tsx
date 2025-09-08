import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Users, AlertTriangle, MapPin, Activity, 
  Bell, FileText, Settings, LogOut, Menu,
  TrendingUp, Clock, Phone
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const DashboardScreen: React.FC = () => {
  const { setAuthorityPage, currentAuthority } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'tourists'>('overview');

  const stats = {
    totalTourists: 1247,
    activeTourists: 89,
    activeAlerts: 3,
    emergencies: 1,
    resolvedToday: 12
  };

  const recentAlerts = [
    { id: '1', type: 'emergency', tourist: 'John Doe', location: 'Shillong', time: '2 min ago', severity: 'high' },
    { id: '2', type: 'weather', tourist: 'All Tourists', location: 'Cherrapunji', time: '15 min ago', severity: 'medium' },
    { id: '3', type: 'geofence', tourist: 'Sarah Wilson', location: 'Kaziranga', time: '1 hour ago', severity: 'low' }
  ];

  const activeTourists = [
    { id: '1', name: 'John Doe', location: 'Shillong', status: 'safe', lastActive: '5 min ago' },
    { id: '2', name: 'Sarah Wilson', location: 'Kaziranga NP', status: 'alert', lastActive: '12 min ago' },
    { id: '3', name: 'Mike Chen', location: 'Guwahati', status: 'safe', lastActive: '3 min ago' }
  ];

  return (
    <div className="min-h-screen bg-accent">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Authority Dashboard</h1>
                <p className="text-sm text-muted-foreground">Northeast India Tourism Safety</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-success-light text-success">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </Badge>
            
            <div className="text-right">
              <p className="font-medium text-sm">{currentAuthority?.name}</p>
              <p className="text-xs text-muted-foreground">{currentAuthority?.badge}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setAuthorityPage('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-4 space-y-2">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setAuthorityPage('verification')}
            >
              <Shield className="w-4 h-4 mr-2" />
              ID Verification
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setAuthorityPage('alerts')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts & Notifications
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setAuthorityPage('efir')}
            >
              <FileText className="w-4 h-4 mr-2" />
              E-FIR System
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => setAuthorityPage('analytics')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tourists</p>
                    <p className="text-2xl font-bold">{stats.totalTourists}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Now</p>
                    <p className="text-2xl font-bold text-success">{stats.activeTourists}</p>
                  </div>
                  <Activity className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-warning">{stats.activeAlerts}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emergencies</p>
                    <p className="text-2xl font-bold text-emergency">{stats.emergencies}</p>
                  </div>
                  <Phone className="w-8 h-8 text-emergency" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved Today</p>
                    <p className="text-2xl font-bold text-secondary">{stats.resolvedToday}</p>
                  </div>
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    Recent Alerts
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setAuthorityPage('alerts')}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.severity === 'high' ? 'bg-emergency' :
                        alert.severity === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{alert.tourist}</p>
                        <p className="text-xs text-muted-foreground">{alert.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        alert.severity === 'high' ? 'text-emergency border-emergency' :
                        alert.severity === 'medium' ? 'text-warning border-warning' : 'text-success border-success'
                      }>
                        {alert.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Tourists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Active Tourists
                  </span>
                  <Button variant="outline" size="sm">
                    View Map
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeTourists.map((tourist) => (
                  <div key={tourist.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        tourist.status === 'safe' ? 'bg-success' : 'bg-warning'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{tourist.name}</p>
                        <p className="text-xs text-muted-foreground">{tourist.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        tourist.status === 'safe' ? 'text-success border-success' : 'text-warning border-warning'
                      }>
                        {tourist.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{tourist.lastActive}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setAuthorityPage('verification')}>
                  <Shield className="w-6 h-6" />
                  <span className="text-sm">Verify Tourist ID</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setAuthorityPage('alerts')}>
                  <Bell className="w-6 h-6" />
                  <span className="text-sm">Send Alert</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setAuthorityPage('efir')}>
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Create E-FIR</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setAuthorityPage('analytics')}>
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;