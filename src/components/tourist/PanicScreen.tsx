import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, MapPin, Clock, CheckCircle, X, Shield, 
  Navigation, Camera, Mic 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const PanicScreen: React.FC = () => {
  const { setTouristPage, setEmergencyActive, currentTourist } = useApp();
  const [emergencyStatus, setEmergencyStatus] = useState<'active' | 'connecting' | 'connected'>('connecting');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setEmergencyStatus('connected');
    }, 3000);

    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, []);

  const handleCancelEmergency = () => {
    setEmergencyActive(false);
    setTouristPage('home');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-emergency text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="font-semibold">EMERGENCY ACTIVE</span>
        </div>
        <div className="text-xl font-mono">{formatTime(timer)}</div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Emergency Status */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6 text-center">
            {emergencyStatus === 'connecting' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold mb-2">Connecting to Emergency Services</h2>
                <p className="text-white/80">Please stay calm. Help is on the way.</p>
              </>
            )}
            
            {emergencyStatus === 'connected' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white" />
                <h2 className="text-xl font-bold mb-2">Connected to Control Room</h2>
                <p className="text-white/80">Emergency response team has been notified</p>
                <Badge className="mt-3 bg-white/20 text-white">
                  Response Team: NE-POLICE-01
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Your Location</span>
            </div>
            <div className="space-y-2 text-sm">
              <p>Police Bazaar, Shillong</p>
              <p className="text-white/80">Meghalaya, India</p>
              <p className="text-white/60">Coordinates: 25.5788° N, 91.8933° E</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="glass" className="h-20 flex-col gap-2">
            <Phone className="w-6 h-6" />
            <span className="text-sm">Call Police</span>
          </Button>
          
          <Button variant="glass" className="h-20 flex-col gap-2">
            <Navigation className="w-6 h-6" />
            <span className="text-sm">Share Location</span>
          </Button>
          
          <Button variant="glass" className="h-20 flex-col gap-2">
            <Camera className="w-6 h-6" />
            <span className="text-sm">Take Photo</span>
          </Button>
          
          <Button variant="glass" className="h-20 flex-col gap-2">
            <Mic className="w-6 h-6" />
            <span className="text-sm">Record Audio</span>
          </Button>
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Emergency Contacts Notified</span>
            </div>
            <div className="space-y-2 text-sm">
              {currentTourist?.emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between">
                  <span>{contact.name}</span>
                  <Badge className="bg-success text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Notified
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Emergency Instructions</h3>
            <ul className="text-sm space-y-1 text-white/80">
              <li>• Stay calm and remain in a safe location</li>
              <li>• Keep your phone charged and location services on</li>
              <li>• Do not move unless instructed by authorities</li>
              <li>• Answer calls from emergency responders</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-emergency border-t border-white/20">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            className="w-full border border-white/30 text-white hover:bg-white/10"
            onClick={handleCancelEmergency}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Emergency
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PanicScreen;