import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, TrendingUp, Users, MapPin, AlertTriangle,
  Calendar, Download, Filter, BarChart3, PieChart
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const AnalyticsScreen: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('tourists');

  const analytics = {
    tourists: {
      total: 1247,
      active: 89,
      verified: 1158,
      newToday: 23,
      growth: '+12%'
    },
    incidents: {
      total: 45,
      resolved: 38,
      pending: 7,
      emergency: 2,
      avgResolution: '4.2 hours'
    },
    locations: {
      mostVisited: [
        { name: 'Shillong', count: 456, percentage: 36.5 },
        { name: 'Kaziranga NP', count: 298, percentage: 23.9 },
        { name: 'Guwahati', count: 234, percentage: 18.8 },
        { name: 'Cherrapunji', count: 167, percentage: 13.4 },
        { name: 'Tezpur', count: 92, percentage: 7.4 }
      ]
    },
    alerts: {
      sent: 156,
      acknowledged: 134,
      responseRate: '85.9%',
      avgResponseTime: '12 minutes'
    }
  };

  const recentTrends = [
    { period: 'Today', tourists: 89, incidents: 3, alerts: 8 },
    { period: 'Yesterday', tourists: 94, incidents: 2, alerts: 5 },
    { period: '2 days ago', tourists: 87, incidents: 4, alerts: 12 },
    { period: '3 days ago', tourists: 92, incidents: 1, alerts: 6 },
    { period: '4 days ago', tourists: 76, incidents: 3, alerts: 9 }
  ];

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setAuthorityPage('dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Tourist safety insights and trends</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">24 Hours</SelectItem>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tourists</p>
                  <p className="text-2xl font-bold">{analytics.tourists.total}</p>
                  <p className="text-xs text-success">{analytics.tourists.growth} from last week</p>
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
                  <p className="text-2xl font-bold text-success">{analytics.tourists.active}</p>
                  <p className="text-xs text-muted-foreground">Real-time count</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incidents</p>
                  <p className="text-2xl font-bold">{analytics.incidents.total}</p>
                  <p className="text-xs text-success">{analytics.incidents.resolved} resolved</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-2xl font-bold">{analytics.alerts.responseRate}</p>
                  <p className="text-xs text-muted-foreground">Alert acknowledgment</p>
                </div>
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tourist Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Tourist Distribution by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.locations.mostVisited.map((location, index) => (
                  <div key={location.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.count} tourists</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{location.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Incident Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Incident Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success-light rounded-lg">
                    <p className="text-2xl font-bold text-success">{analytics.incidents.resolved}</p>
                    <p className="text-sm text-success">Resolved</p>
                  </div>
                  <div className="text-center p-3 bg-warning-light rounded-lg">
                    <p className="text-2xl font-bold text-warning">{analytics.incidents.pending}</p>
                    <p className="text-sm text-warning">Pending</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolution Rate</span>
                    <span className="font-medium">{Math.round((analytics.incidents.resolved / analytics.incidents.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                    <span className="font-medium">{analytics.incidents.avgResolution}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Emergency Cases</span>
                    <Badge className="bg-emergency text-white">{analytics.incidents.emergency}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                7-Day Trends
              </span>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourists">Tourists</SelectItem>
                  <SelectItem value="incidents">Incidents</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">
                    {trend.period}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-accent rounded-full h-2 relative">
                        <div 
                          className="bg-primary rounded-full h-2" 
                          style={{ 
                            width: `${selectedMetric === 'tourists' ? (trend.tourists / 100) * 100 : 
                                     selectedMetric === 'incidents' ? (trend.incidents / 5) * 100 : 
                                     (trend.alerts / 15) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="w-16 text-right font-medium">
                        {selectedMetric === 'tourists' ? trend.tourists : 
                         selectedMetric === 'incidents' ? trend.incidents : 
                         trend.alerts}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alerts Sent</span>
                  <span className="font-medium">{analytics.alerts.sent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Acknowledged</span>
                  <span className="font-medium">{analytics.alerts.acknowledged}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Response Rate</span>
                  <Badge className="bg-success text-white">{analytics.alerts.responseRate}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verified IDs</span>
                  <span className="font-medium">{analytics.tourists.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verification Rate</span>
                  <span className="font-medium">{Math.round((analytics.tourists.verified / analytics.tourists.total) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Today</span>
                  <Badge variant="outline">{analytics.tourists.newToday}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">API Status</span>
                  <Badge className="bg-success text-white">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">GPS Tracking</span>
                  <Badge className="bg-success text-white">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blockchain</span>
                  <Badge className="bg-success text-white">Synced</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;