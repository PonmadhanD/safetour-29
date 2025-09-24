import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle, Shield, Activity, Phone, MapPin, LogOut, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuthorityAuth } from '@/contexts/AuthorityAuthContext';
import { Tourist } from '@/types';
import MapView from '@/components/MapView';
import { touristsData } from '@/assets/data/touristData';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MapDashboard: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const { signOut } = useAuthorityAuth();
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [tourists] = useState<Tourist[]>(touristsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);

  const handleTouristSelect = (tourist: Tourist) => {
    setSelectedTourist(tourist);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const safeCount = tourists.filter(t => t.status === 'safe').length;
  const alertCount = tourists.filter(t => t.status === 'alert').length;
  const emergencyCount = tourists.filter(t => t.status === 'emergency').length;
  const totalTourists = tourists.length;

  const safePercentage = totalTourists > 0 ? ((safeCount / totalTourists) * 100).toFixed(1) : '0';
  const alertPercentage = totalTourists > 0 ? ((alertCount / totalTourists) * 100).toFixed(1) : '0';
  const emergencyPercentage = totalTourists > 0 ? ((emergencyCount / totalTourists) * 100).toFixed(1) : '0';

  const filteredTourists = tourists.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone?.includes(searchQuery) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-primary text-primary-foreground">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card shadow-lg border-b border-primary/20 sticky top-0 z-40"
        >
          <div className="p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Authority Dashboard</h1>
                <p className="text-sm text-primary-foreground/80">Real-time tourist monitoring</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthorityPage('alerts')}
                  className="border-primary/50 text-primary-foreground hover:bg-primary/20"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alerts
                </Button>
                <Popover open={showLogoutPopover} onOpenChange={setShowLogoutPopover}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-500/90 hover:bg-red-500/10"
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Logout</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80 bg-card border-primary/20">
                    <div className="p-4">
                      <h4 className="font-medium mb-2 text-primary-foreground">Confirm Logout</h4>
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
                          className="flex-1 border-primary/50 text-primary-foreground hover:bg-primary/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
              title: 'Safe',
              value: safeCount,
              percentage: safePercentage,
              icon: Shield,
              color: 'text-green-400',
              bgColor: 'bg-green-900/20',
              progressColor: 'bg-green-500'
            }, {
              title: 'Alerts',
              value: alertCount,
              percentage: alertPercentage,
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
            }].map((stat, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-card border border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                        <p className="text-sm text-primary-foreground/80 font-medium">{stat.title}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    {stat.percentage && (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">{stat.percentage}% of total</p>
                        <div className={`mt-2 bg-primary/30 rounded-full h-2`}>
                          <div className={`${stat.progressColor} h-2 rounded-full`} style={{ width: `${stat.percentage}%` }} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Map and Tourist Details */}
        <div className="p-4 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-[600px] overflow-hidden shadow-xl bg-card border border-primary/20">
              <CardHeader className="pb-3 bg-primary/80 text-primary-foreground">
                <CardTitle className="flex items-center gap-2 text-lg">
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
            className="space-y-6"
          >
            <Card className="shadow-lg bg-card border border-primary/20">
              <CardHeader className="pb-3 bg-primary/10">
                <CardTitle className="text-lg flex items-center gap-2 text-primary-foreground">
                  <Search className="w-5 h-5" />
                  Search Tourists
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Input
                  placeholder="Search by name, email, phone, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4 bg-background/50 border-primary/30"
                />
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {filteredTourists.map((tourist) => (
                    <motion.div 
                      key={tourist.id}
                      onClick={() => handleTouristSelect(tourist)}
                      className="p-2 rounded-md hover:bg-primary/20 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary-foreground">{tourist.name}</span>
                        <Badge variant={
                          tourist.status === 'safe' ? 'success' :
                          tourist.status === 'alert' ? 'warning' : 'destructive'
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
                  <Card className="shadow-lg bg-card border border-primary/20">
                    <CardHeader className="pb-3 bg-primary/10">
                      <CardTitle className="text-lg flex items-center gap-2 text-primary-foreground">
                        <Users className="w-5 h-5" />
                        Tourist Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      <div>
                        <h3 className="font-semibold text-lg text-primary-foreground">{selectedTourist.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {selectedTourist.digitalId}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          selectedTourist.status === 'safe' ? 'success' :
                          selectedTourist.status === 'alert' ? 'warning' : 'destructive'
                        } className="px-3 py-1">
                          {selectedTourist.status.toUpperCase()}
                        </Badge>
                        {selectedTourist.isVerified && (
                          <Badge variant="outline" className="border-green-500 text-green-400">Verified</Badge>
                        )}
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <p className="text-primary-foreground/80">{selectedTourist.phone}</p>
                        </div>
                        {selectedTourist.currentLocation && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="font-medium text-primary-foreground">Current Location</p>
                              <p className="text-primary-foreground/80">
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
                            <p className="font-medium text-primary-foreground">Last Active</p>
                            <p className="text-primary-foreground/80">
                              {new Date(selectedTourist.lastActive).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-primary/20">
                        <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Tourist
                        </Button>
                        <Button variant="outline" size="sm" className="w-full border-primary/50 text-primary-foreground hover:bg-primary/20">
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
                <Card className="shadow-lg bg-card border border-primary/20">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2 text-primary-foreground">Select a Tourist</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on a tourist on the map to view their details.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card className="shadow-lg bg-card border border-primary/20">
              <CardHeader className="pb-3 bg-primary/10">
                <CardTitle className="text-lg flex items-center gap-2 text-primary-foreground">
                  <Activity className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-primary/50 text-primary-foreground hover:bg-primary/20"
                    onClick={() => setAuthorityPage('verification')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Tourist IDs
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-primary/50 text-primary-foreground hover:bg-primary/20"
                    onClick={() => setAuthorityPage('efir')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    File E-FIR
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-primary/50 text-primary-foreground hover:bg-primary/20"
                    onClick={() => setAuthorityPage('analytics')}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MapDashboard;