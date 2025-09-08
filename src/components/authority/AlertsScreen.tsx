import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Bell, AlertTriangle, Cloud, Shield, 
  MapPin, Send, Clock, CheckCircle, Users
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const AlertsScreen: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [activeTab, setActiveTab] = useState<'send' | 'active' | 'history'>('send');
  const [alertForm, setAlertForm] = useState({
    type: '',
    severity: '',
    title: '',
    message: '',
    location: '',
    targetGroup: 'all'
  });

  const activeAlerts = [
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall expected in Shillong and surrounding areas. Avoid outdoor activities.',
      location: 'Shillong, Meghalaya',
      severity: 'medium',
      sentAt: '2024-01-15T14:30:00Z',
      targetCount: 234,
      acknowledgedCount: 189
    },
    {
      id: '2',
      type: 'security',
      title: 'Travel Advisory',
      message: 'Avoid remote areas after 8 PM due to security concerns.',
      location: 'Border Areas',
      severity: 'high',
      sentAt: '2024-01-15T12:00:00Z',
      targetCount: 89,
      acknowledgedCount: 67
    }
  ];

  const handleSendAlert = () => {
    // Simulate sending alert
    console.log('Sending alert:', alertForm);
    // Reset form
    setAlertForm({
      type: '',
      severity: '',
      title: '',
      message: '',
      location: '',
      targetGroup: 'all'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-emergency border-emergency';
      case 'high': return 'text-emergency border-emergency';
      case 'medium': return 'text-warning border-warning';
      case 'low': return 'text-success border-success';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

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
            <h1 className="text-xl font-bold">Alerts & Notifications</h1>
            <p className="text-sm text-muted-foreground">Manage tourist safety alerts</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'send' ? 'default' : 'outline'}
            onClick={() => setActiveTab('send')}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Alert
          </Button>
          <Button 
            variant={activeTab === 'active' ? 'default' : 'outline'}
            onClick={() => setActiveTab('active')}
          >
            <Bell className="w-4 h-4 mr-2" />
            Active Alerts ({activeAlerts.length})
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Send Alert Tab */}
        {activeTab === 'send' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select value={alertForm.type} onValueChange={(value) => setAlertForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weather">Weather Alert</SelectItem>
                        <SelectItem value="security">Security Advisory</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="health">Health Advisory</SelectItem>
                        <SelectItem value="geofence">Geo-fence Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select value={alertForm.severity} onValueChange={(value) => setAlertForm(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alert Title</Label>
                  <Input
                    value={alertForm.title}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter alert title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={alertForm.message}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter detailed alert message"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={alertForm.location}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Specify location or area"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Group</Label>
                  <Select value={alertForm.targetGroup} onValueChange={(value) => setAlertForm(prev => ({ ...prev, targetGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tourists</SelectItem>
                      <SelectItem value="location">Tourists in Specific Location</SelectItem>
                      <SelectItem value="verified">Verified Tourists Only</SelectItem>
                      <SelectItem value="emergency">Emergency Contacts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={handleSendAlert}
                  disabled={!alertForm.type || !alertForm.title || !alertForm.message}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertForm.title && alertForm.message ? (
                    <div className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alertForm.type)}
                        <span className="font-medium">{alertForm.title}</span>
                        {alertForm.severity && (
                          <Badge variant="outline" className={getSeverityColor(alertForm.severity)}>
                            {alertForm.severity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alertForm.message}</p>
                      {alertForm.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {alertForm.location}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Fill in the form to see alert preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Alerts Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">
                        {alert.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{alert.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Sent to {alert.targetCount} tourists</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{alert.acknowledgedCount} acknowledged</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Alert
                    </Button>
                    <Button variant="destructive" size="sm">
                      Deactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Alert sent successfully</p>
                        <p className="text-xs text-muted-foreground">Weather Alert - Heavy Rainfall</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Resolved</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{i} day{i !== 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlertsScreen;