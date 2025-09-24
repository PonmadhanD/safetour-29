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
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <div className="min-h-screen bg-purple-50">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/80 shadow-md border-b sticky top-0 z-40"
        >
          <div className="p-4 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAuthorityPage('dashboard')}
                    className="text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Dashboard</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-semibold text-white">Analytics Dashboard</h1>
                <p className="text-sm text-white">Tourist safety insights and trends</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 border-purple-300 focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { title: 'Total Tourists', value: analytics.tourists.total, sub: analytics.tourists.growth, icon: Users, color: 'purple-600' },
              { title: 'Active Now', value: analytics.tourists.active, sub: 'Real-time count', icon: TrendingUp, color: 'green-600' },
              { title: 'Incidents', value: analytics.incidents.total, sub: `${analytics.incidents.resolved} resolved`, icon: AlertTriangle, color: 'yellow-500' },
              { title: 'Response Rate', value: analytics.alerts.responseRate, sub: 'Alert acknowledgment', icon: BarChart3, color: 'blue-600' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <Card>
                  <CardContent className="p-4 relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm text-purple-600">{metric.title}</p>
                        <p className={`text-2xl font-bold text-${metric.color}`}>{metric.value}</p>
                        <p className="text-xs text-purple-500">{metric.sub}</p>
                      </div>
                      <div className={`w-10 h-10 bg-${metric.color}/10 rounded-full flex items-center justify-center`}>
                        {React.createElement(metric.icon, { className: `w-6 h-6 text-${metric.color}` })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Tourist Distribution */}
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <MapPin className="w-5 h-5 text-white" />
                  Tourist Distribution by Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {analytics.locations.mostVisited.map((location, index) => (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-black`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-black">{location.name}</p>
                        <p className="text-sm text-purple-600">{location.count} tourists</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-purple-300 text-black">{location.percentage}%</Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Incident Analytics */}
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  Incident Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{analytics.incidents.resolved}</p>
                    <p className="text-sm text-green-600">Resolved</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-500">{analytics.incidents.pending}</p>
                    <p className="text-sm text-yellow-500">Pending</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Resolution Rate</span>
                    <span className="font-medium text-purple-800">{Math.round((analytics.incidents.resolved / analytics.incidents.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Avg Resolution Time</span>
                    <span className="font-medium text-purple-800">{analytics.incidents.avgResolution}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Emergency Cases</span>
                    <Badge className="bg-red-600 text-white">{analytics.incidents.emergency}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trends Chart */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="shadow-md bg-white"
          >
            <Card>
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-white" />
                    7-Day Trends
                  </span>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-40 border-purple-300 focus:border-purple-500">
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
              <CardContent className="p-6 space-y-4">
                {recentTrends.map((trend, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-20 text-sm text-black">
                      {trend.period}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-purple-100 rounded-full h-2 relative">
                          <div 
                            className="bg-purple-600 rounded-full h-2" 
                            style={{ 
                              width: `${selectedMetric === 'tourists' ? (trend.tourists / 100) * 100 : 
                                       selectedMetric === 'incidents' ? (trend.incidents / 5) * 100 : 
                                       (trend.alerts / 15) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="w-16 text-right font-medium text-black">
                          {selectedMetric === 'tourists' ? trend.tourists : 
                           selectedMetric === 'incidents' ? trend.incidents : 
                           trend.alerts}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { title: 'Alert Performance', data: [
                { label: 'Alerts Sent', value: analytics.alerts.sent },
                { label: 'Acknowledged', value: analytics.alerts.acknowledged },
                { label: 'Response Rate', value: analytics.alerts.responseRate, badge: 'bg-green-600' }
              ] },
              { title: 'Verification Stats', data: [
                { label: 'Verified IDs', value: analytics.tourists.verified },
                { label: 'Verification Rate', value: `${Math.round((analytics.tourists.verified / analytics.tourists.total) * 100)}%` },
                { label: 'New Today', value: analytics.tourists.newToday, badge: 'border-purple-300' }
              ] },
              { title: 'System Health', data: [
                { label: 'API Status', value: 'Online', badge: 'bg-green-600' },
                { label: 'GPS Tracking', value: 'Active', badge: 'bg-green-600' },
                { label: 'Blockchain', value: 'Synced', badge: 'bg-green-600' }
              ] }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <Card>
                  <CardHeader className="pb-3 bg-primary/80">
                    <CardTitle className="text-lg text-white">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    {metric.data.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-black">{item.label}</span>
                        {item.badge ? (
                          <Badge className={item.badge + ' text-white'}>{item.value}</Badge>
                        ) : (
                          <span className="font-medium text-black">{item.value}</span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AnalyticsScreen;