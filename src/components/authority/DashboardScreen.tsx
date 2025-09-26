import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Users, AlertTriangle, MapPin, Activity, 
  Bell, FileText, Settings, LogOut, Search, TrendingUp, Phone, CheckCircle 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';
import { Tourist } from '@/types';
import MapView from '@/components/MapView';
import { touristsData } from '@/assets/data/touristData';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DashboardScreen: React.FC = () => {
  const { setAuthorityPage, currentAuthority } = useApp();
  const { signOutAuthority } = useAuthorityAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'tourists'>('overview');
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [tourists] = useState<Tourist[]>(touristsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);

  const handleTouristSelect = (tourist: Tourist) => {
    setSelectedTourist(tourist);
  };

  const handleLogout = async () => {
    try {
      await signOutAuthority();
      setAuthorityPage('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const today = new Date('2025-09-26').toISOString().split('T')[0];
  const activeNowCount = tourists.filter(t => t.status === 'active now').length;
  const activeAlertsCount = tourists.filter(t => t.status === 'active alerts').length;
  const emergencyCount = tourists.filter(t => t.status === 'emergency').length;
  const resolvedTodayCount = tourists.filter(t => t.status === 'resolved today' && t.resolvedAt?.startsWith(today)).length;

  const totalTourists = tourists.length;
  const activeNowPercentage = totalTourists > 0 ? ((activeNowCount / totalTourists) * 100).toFixed(1) : '0';
  const activeAlertsPercentage = totalTourists > 0 ? ((activeAlertsCount / totalTourists) * 100).toFixed(1) : '0';
  const emergencyPercentage = totalTourists > 0 ? ((emergencyCount / totalTourists) * 100).toFixed(1) : '0';
  const resolvedTodayPercentage = totalTourists > 0 ? ((resolvedTodayCount / totalTourists) * 100).toFixed(1) : '0';

  const filteredTourists = tourists.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone?.includes(searchQuery) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Navigation Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md border-b w-full sticky top-0 z-10"
        >
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-primary">Authority Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Northeast India Tourism Safety</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-success/10 text-success border border-success/20">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              
              <div className="text-right">
                <p className="font-medium text-sm text-primary">{currentAuthority?.name}</p>
                <p className="text-xs text-muted-foreground">{currentAuthority?.badge}</p>
              </div>
              
              <Popover open={showLogoutPopover} onOpenChange={setShowLogoutPopover}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80 bg-white border-primary/20">
                  <div className="p-4">
                    <h4 className="font-medium mb-2 text-primary">Confirm Logout</h4>
                    <p className="text-sm text-muted-foreground mb-4">Are you sure you want to log out?</p>
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
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setAuthorityPage('settings')}
                    className="hover:bg-primary/10"
                  >
                    <Settings className="w-5 h-5 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-md border-r min-h-screen">
            <div className="p-4 space-y-2">
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => setActiveTab('overview')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => setAuthorityPage('verification')}
              >
                <Shield className="w-4 h-4 mr-2" />
                ID Verification
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => setAuthorityPage('alerts')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Alerts & Notifications
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => setAuthorityPage('efir')}
              >
                <FileText className="w-4 h-4 mr-2" />
                E-FIR System
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => setAuthorityPage('analytics')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
            >
              {[{
                title: 'Total Tourists',
                value: totalTourists,
                icon: Users,
                color: 'text-blue-400',
                bgColor: 'bg-blue-900/20'
              }, {
                title: 'Active Now',
                value: activeNowCount,
                percentage: activeNowPercentage,
                icon: Activity,
                color: 'text-green-400',
                bgColor: 'bg-green-900/20',
                progressColor: 'bg-green-500'
              }, {
                title: 'Active Alerts',
                value: activeAlertsCount,
                percentage: activeAlertsPercentage,
                icon: AlertTriangle,
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-900/20',
                progressColor: 'bg-yellow-500'
              }, {
                title: 'Emergency',
                value: emergencyCount,
                percentage: emergencyPercentage,
                icon: Phone,
                color: 'text-red-400',
                bgColor: 'bg-red-900/20',
                progressColor: 'bg-red-500'
              }, {
                title: 'Resolved Today',
                value: resolvedTodayCount,
                percentage: resolvedTodayPercentage,
                icon: CheckCircle,
                color: 'text-purple-400',
                bgColor: 'bg-purple-900/20',
                progressColor: 'bg-purple-500'
              }].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white border border-primary/10 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                          <p className="text-sm font-medium text-primary">{stat.title}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      {stat.percentage && (
                        <>
                          <p className="text-xs text-muted-foreground mt-1">{stat.percentage}% of total</p>
                          <div className={`mt-2 bg-primary/20 rounded-full h-2`}>
                            <div className={`${stat.progressColor} h-2 rounded-full`} style={{ width: `${stat.percentage}%` }} />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Map and Tourist Details */}
            <div className="grid lg:grid-cols-12 gap-6 w-full">
              {/* Map */}
              <motion.div 
                className="lg:col-span-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="h-[600px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white border border-primary/10 rounded-xl">
                  <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <MapPin className="w-5 h-5" />
                      Live Tourist Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[540px]">
                    <MapView
                      mode="authority"
                      tourists={tourists}
                      onTouristSelect={handleTouristSelect}
                      showPanicButton={false}
                      className="w-full h-full rounded-b-lg"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tourist Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="lg:col-span-4 space-y-6"
              >
                <Card className="shadow-lg bg-white border border-primary/10 rounded-xl">
                  <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                      <Search className="w-5 h-5" />
                      Search Tourists
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Input
                      placeholder="Search by name, email, phone, or status..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4 bg-gray-50 border-primary/20 rounded-lg"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                      {filteredTourists.map((tourist) => (
                        <motion.div 
                          key={tourist.id}
                          onClick={() => handleTouristSelect(tourist)}
                          className="p-2 rounded-md hover:bg-primary/10 cursor-pointer transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-primary">{tourist.name}</span>
                            <Badge variant={
                              tourist.status === 'active now' ? 'default' :
                              tourist.status === 'active alerts' ? 'secondary' :
                              tourist.status === 'emergency' ? 'destructive' : 'outline'
                            } className={
                              tourist.status === 'resolved today' ? 'border-purple-500 text-purple-400' : ''
                            }>
                              {tourist.status.toUpperCase()}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                      {filteredTourists.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedTourist ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTourist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-lg bg-white border border-primary/10 rounded-xl">
                        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <Users className="w-5 h-5" />
                            Tourist Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">{selectedTourist.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {selectedTourist.digitalId}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              selectedTourist.status === 'active now' ? 'default' :
                              selectedTourist.status === 'active alerts' ? 'secondary' :
                              selectedTourist.status === 'emergency' ? 'destructive' : 'outline'
                            } className={
                              `px-3 py-1 ${
                                selectedTourist.status === 'resolved today' ? 'border-purple-500 text-purple-400' : ''
                              }`
                            }>
                              {selectedTourist.status.toUpperCase()}
                            </Badge>
                            {selectedTourist.isVerified && (
                              <Badge variant="outline" className="border-green-500 text-green-400">Verified</Badge>
                            )}
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p className="text-primary">{selectedTourist.phone}</p>
                            </div>
                            {selectedTourist.currentLocation && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                <div>
                                  <p className="font-medium text-primary">Current Location</p>
                                  <p className="text-primary">
                                    {selectedTourist.currentLocation.address}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {selectedTourist.currentLocation.lat.toFixed(4)}, {selectedTourist.currentLocation.lng.toFixed(4)}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-primary">Last Active</p>
                                <p className="text-primary">
                                  {new Date(selectedTourist.lastActive).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {selectedTourist.resolvedAt && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-primary">Resolved At</p>
                                  <p className="text-primary">
                                    {new Date(selectedTourist.resolvedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 pt-4 border-t border-primary/20">
                            <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                              <Phone className="w-4 h-4 mr-2" />
                              Contact Tourist
                            </Button>
                            <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                              <Activity className="w-4 h-4 mr-2" />
                              View History
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-lg bg-white border border-primary/10 rounded-xl">
                      <CardContent className="p-6 text-center">
                        <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg text-primary">Select a Tourist</h3>
                        <p className="text-sm text-muted-foreground">
                          Click on a tourist on the map to view their details.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardScreen;