import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, Users, MapPin, Share2, UserCheck, 
  Clock, Phone, MessageCircle, Map
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const FamilyTrackingScreen: React.FC = () => {
  const { setTouristPage, currentTourist } = useApp();
  const [locationSharing, setLocationSharing] = useState(true);
  
  // Mock family members data
  const familyMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Wife',
      phone: '+91-98765-43210',
      lastSeen: '2 minutes ago',
      location: 'Shillong, Meghalaya',
      distance: '0.5 km away',
      status: 'safe'
    },
    {
      id: '2', 
      name: 'Mike Johnson',
      relationship: 'Son',
      phone: '+91-87654-32109',
      lastSeen: '15 minutes ago',
      location: 'Police Bazaar',
      distance: '1.2 km away', 
      status: 'safe'
    },
    {
      id: '3',
      name: 'Emma Johnson', 
      relationship: 'Daughter',
      phone: '+91-76543-21098',
      lastSeen: '1 hour ago',
      location: 'Ward Lake',
      distance: '3.5 km away',
      status: 'alert'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-success text-success-foreground';
      case 'alert': return 'bg-warning text-warning-foreground';
      case 'emergency': return 'bg-emergency text-emergency-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-card shadow-sm border-b sticky top-0 z-40">
        <div className="p-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTouristPage('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Family Tracking</h1>
            <p className="text-sm text-muted-foreground">Stay connected with your family</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTouristPage('map')}
          >
            <Map className="w-4 h-4 mr-1" />
            View Map
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Sharing Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Location Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share my location with family</p>
                <p className="text-sm text-muted-foreground">
                  Allow family members to see your real-time location
                </p>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={setLocationSharing}
              />
            </div>
            <div className="mt-4 p-3 bg-primary-light/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">Current Location:</span>
                <span>Shillong, Meghalaya</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: Just now
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Family Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Family Members ({familyMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.relationship}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4" />
                      <span>{member.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{member.lastSeen}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mini Map Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-secondary" />
              Family Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Map className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Mini map with family member locations</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setTouristPage('map')}
                >
                  View Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        <Card className="border-emergency/20 bg-emergency-light/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emergency">
              <Phone className="w-5 h-5" />
              Emergency Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <UserCheck className="w-4 h-4 mr-2" />
              Send Check-in to All Family
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Share Current Location 
            </Button>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setTouristPage('panic')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency Alert to Family
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyTrackingScreen;