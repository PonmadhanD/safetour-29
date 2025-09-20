import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertTriangle, Shield, Activity, Phone, MapPin, LogOut, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tourist } from '@/types';
import MapView from '@/components/MapView';
import { touristsData } from '@/data/Touristdata';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for classnamesgi

// Mock tourist data (unchanged)

const MapDashboard: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const { signOut } = useAuth();
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
      // Optionally redirect to login or home
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const safeCount = tourists.filter(t => t.status === 'safe').length;
  const alertCount = tourists.filter(t => t.status === 'alert').length;
  const emergencyCount = tourists.filter(t => t.status === 'emergency').length;
  const totalTourists = tourists.length;

  const safePercentage = ((safeCount / totalTourists) * 100).toFixed(1);
  const alertPercentage = ((alertCount / totalTourists) * 100).toFixed(1);
  const emergencyPercentage = ((emergencyCount / totalTourists) * 100).toFixed(1);

  const filteredTourists = tourists.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone?.includes(searchQuery) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-indigo-800">Authority Dashboard</h1>
                <p className="text-sm text-indigo-600">Real-time tourist monitoring</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthorityPage('alerts')}
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Logout</TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-80">
                    <div className="p-4">
                      <h4 className="font-medium mb-2">Confirm Logout</h4>
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
                          className="flex-1"
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
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-4xl font-extrabold text-indigo-800">{totalTourists}</p>
                      <p className="text-sm text-indigo-600 font-medium">Total Tourists</p>
                      <p className="text-xs text-indigo-500 mt-1">Currently registered</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-4xl font-extrabold text-green-600">{safeCount}</p>
                      <p className="text-sm text-green-600 font-medium">Safe</p>
                      <p className="text-xs text-green-500 mt-1">{safePercentage}% of total</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 bg-green-50 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${safePercentage}%` }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-4xl font-extrabold text-yellow-500">{alertCount}</p>
                      <p className="text-sm text-yellow-600 font-medium">Alerts</p>
                      <p className="text-xs text-yellow-500 mt-1">{alertPercentage}% of total</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-2 bg-yellow-50 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${alertPercentage}%` }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-4xl font-extrabold text-red-600">{emergencyCount}</p>
                      <p className="text-sm text-red-600 font-medium">Emergency</p>
                      <p className="text-xs text-red-500 mt-1">{emergencyPercentage}% of total</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-2 bg-red-50 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emergencyPercentage}%` }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Map and Tourist Details */}
        <div className="p-4 max-w-7xl mx-auto grid lg:grid-cols-3 gap-4">
          {/* Map */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-[600px] overflow-hidden shadow-xl">
              <CardHeader className="pb-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
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
          >
            <div className="space-y-4">
              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-600" />
                    Search Tourists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search by name, email, phone, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                    {filteredTourists.map((tourist) => (
                      <motion.div 
                        key={tourist.id}
                        onClick={() => handleTouristSelect(tourist)}
                        className="p-2 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{tourist.name}</span>
                          <Badge variant={
                            tourist.status === 'safe' ? 'default' :
                            tourist.status === 'alert' ? 'secondary' : 'destructive'
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
                    <Card className="shadow-md">
                      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Tourist Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-indigo-800">{selectedTourist.name}</h3>
                          <p className="text-sm text-indigo-600">ID: {selectedTourist.digitalId}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            selectedTourist.status === 'safe' ? 'default' :
                            selectedTourist.status === 'alert' ? 'secondary' : 'destructive'
                          } className="px-3 py-1">
                            {selectedTourist.status.toUpperCase()}
                          </Badge>
                          {selectedTourist.isVerified && (
                            <Badge variant="outline" className="border-green-500 text-green-600">Verified</Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-600" />
                            <p className="text-sm text-muted-foreground">{selectedTourist.phone}</p>
                          </div>
                          
                          {selectedTourist.currentLocation && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-indigo-600 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-indigo-800">Current Location</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedTourist.currentLocation.address}
                                </p>
                                <p className="text-xs text-indigo-500">
                                  {selectedTourist.currentLocation.lat.toFixed(4)}, {selectedTourist.currentLocation.lng.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="text-sm font-medium text-indigo-800">Last Active</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedTourist.lastActive).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-indigo-100">
                          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Tourist
                          </Button>
                          <Button variant="outline" size="sm" className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50">
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
                  <Card className="shadow-md">
                    <CardContent className="p-6 text-center">
                      <MapPin className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2 text-indigo-800">Select a Tourist</h3>
                      <p className="text-sm text-indigo-600">
                        Click on a tourist marker on the map to view their details
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Actions */}
              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50"
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
                      className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50"
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
                      className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => setAuthorityPage('analytics')}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MapDashboard;