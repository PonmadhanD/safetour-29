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
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [loading, setLoading] = useState(false);

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

  const handleSendAlert = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sending alert:', alertForm);
      setAlertForm({
        type: '',
        severity: '',
        title: '',
        message: '',
        location: '',
        targetGroup: 'all'
      });
    } catch (error) {
      console.error('Error sending alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 border-red-600';
      case 'high': return 'text-red-600 border-red-600';
      case 'medium': return 'text-yellow-500 border-yellow-500';
      case 'low': return 'text-green-600 border-green-600';
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md border-b sticky top-0 z-40"
        >
          <div className="p-4 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAuthorityPage('dashboard')}
                    className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Dashboard</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-indigo-800">Alerts & Notifications</h1>
                <p className="text-sm text-indigo-600">Manage tourist safety alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={activeTab} onValueChange={(value) => setActiveTab(value as 'send' | 'active' | 'history')}>
                <SelectTrigger className="w-32 border-indigo-300 focus:border-indigo-500">
                  <SelectValue placeholder="Select Tab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send">Send Alert</SelectItem>
                  <SelectItem value="active">Active Alerts</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'send' && (
              <motion.div
                key="send"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Send className="w-5 h-5 text-indigo-600" />
                      Create New Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alert Type</Label>
                        <Select value={alertForm.type} onValueChange={(value) => setAlertForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="border-indigo-300 focus:border-indigo-500">
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
                          <SelectTrigger className="border-indigo-300 focus:border-indigo-500">
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
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={alertForm.message}
                        onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Enter detailed alert message"
                        rows={4}
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={alertForm.location}
                        onChange={(e) => setAlertForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Specify location or area"
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Group</Label>
                      <Select value={alertForm.targetGroup} onValueChange={(value) => setAlertForm(prev => ({ ...prev, targetGroup: value }))}>
                        <SelectTrigger className="border-indigo-300 focus:border-indigo-500">
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
                      variant="default"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleSendAlert}
                      disabled={!alertForm.type || !alertForm.title || !alertForm.message || loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Alert
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="w-5 h-5 text-indigo-600" />
                      Alert Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {alertForm.title && alertForm.message ? (
                      <div className="border border-indigo-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(alertForm.type)}
                          <span className="font-medium text-indigo-800">{alertForm.title}</span>
                          {alertForm.severity && (
                            <Badge variant="outline" className={getSeverityColor(alertForm.severity)}>
                              {alertForm.severity}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-indigo-600">{alertForm.message}</p>
                        {alertForm.location && (
                          <div className="flex items-center gap-2 text-sm text-indigo-600">
                            <MapPin className="w-4 h-4" />
                            {alertForm.location}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-indigo-400 py-8">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Fill in the form to see alert preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {activeAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="shadow-md hover:shadow-lg transition-shadow bg-white"
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(alert.type)}
                            <div>
                              <h3 className="font-semibold text-indigo-800">{alert.title}</h3>
                              <p className="text-sm text-indigo-600">{alert.message}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                              {alert.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-indigo-600">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-600">
                            <Users className="w-4 h-4" />
                            <span>Sent to {alert.targetCount} tourists</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-600">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{alert.acknowledgedCount} acknowledged</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                            Update Alert
                          </Button>
                          <Button variant="destructive" size="sm">
                            Deactivate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="shadow-md bg-white"
              >
                <Card>
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-lg text-indigo-800">
                      <Clock className="w-5 h-5" />
                      Alert History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 border border-indigo-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-100 rounded-full"></div>
                          <div>
                            <p className="font-medium text-sm text-indigo-800">Alert sent successfully</p>
                            <p className="text-xs text-indigo-600">Weather Alert - Heavy Rainfall</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-indigo-300 text-indigo-700">Resolved</Badge>
                          <p className="text-xs text-indigo-600 mt-1">{i} day{i !== 1 ? 's' : ''} ago</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AlertsScreen;