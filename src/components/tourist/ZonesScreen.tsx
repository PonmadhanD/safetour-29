import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Search, MapPin, Star, Clock, Shield, 
  Mountain, Camera, Church, Trees, Users
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Zone } from '@/types';

import FloatingPanicButton from './FloatingPanicButton';

const ZonesScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const zones: Zone[] = [
    {
      id: '1',
      name: 'Shillong Peak',
      description: 'Highest point in Shillong with panoramic views',
      category: 'nature',
      safetyLevel: 'high',
      location: { lat: 25.5788, lng: 91.8933, address: 'Shillong Peak, Meghalaya' },
      features: ['Scenic Views', 'Photography', 'Trekking'],
      bestTime: '6 AM - 6 PM',
      guidelines: ['Carry warm clothes', 'Maintain cleanliness', 'Follow designated paths'],
      emergencyContacts: ['+91-364-2222108']
    },
    {
      id: '2',
      name: 'Elephant Falls',
      description: 'Three-tiered waterfall near Shillong',
      category: 'nature',
      safetyLevel: 'medium',
      location: { lat: 25.5394, lng: 91.8947, address: 'Elephant Falls, Shillong' },
      features: ['Waterfall', 'Photography', 'Nature Walk'],
      bestTime: '9 AM - 5 PM',
      guidelines: ['Wear non-slip shoes', 'Stay on marked paths', 'No littering'],
      emergencyContacts: ['+91-364-2222108']
    },
    {
      id: '3',
      name: 'Don Bosco Museum',
      description: 'Cultural museum showcasing Northeast heritage',
      category: 'cultural',
      safetyLevel: 'high',
      location: { lat: 25.5644, lng: 91.8789, address: 'Mawlai, Shillong' },
      features: ['Cultural Exhibits', 'Educational', 'Indoor Activity'],
      bestTime: '9 AM - 5:30 PM',
      guidelines: ['Photography restrictions apply', 'Maintain silence', 'Follow museum rules'],
      emergencyContacts: ['+91-364-2553813']
    },
    {
      id: '4',
      name: 'Umiam Lake',
      description: 'Scenic lake perfect for water sports',
      category: 'adventure',
      safetyLevel: 'medium',
      location: { lat: 25.6855, lng: 91.9086, address: 'Umiam Lake, Meghalaya' },
      features: ['Water Sports', 'Boating', 'Kayaking', 'Camping'],
      bestTime: '8 AM - 6 PM',
      guidelines: ['Life jackets mandatory', 'Swimming prohibited in deep areas', 'Weather dependent'],
      emergencyContacts: ['+91-364-2570644']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: MapPin },
    { id: 'nature', name: 'Nature', icon: Trees },
    { id: 'cultural', name: 'Cultural', icon: Camera },
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'religious', name: 'Religious', icon: Church },
    { id: 'tourist', name: 'Tourist', icon: Users }
  ];

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         zone.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || zone.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-success bg-success-light';
      case 'medium': return 'text-warning bg-warning-light';
      case 'low': return 'text-destructive bg-destructive-light';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature': return Trees;
      case 'cultural': return Camera;
      case 'adventure': return Mountain;
      case 'religious': return Church;
      case 'tourist': return Users;
      default: return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTouristPage('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Safe Zones</h1>
            <p className="text-sm text-muted-foreground">Discover verified safe places to visit</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="w-4 h-4 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Quick Access to Routes */}
        <Card className="bg-gradient-to-r from-primary-light/20 to-secondary-light/20">
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setTouristPage('routes')}
            >
              <Shield className="w-4 h-4 mr-2" />
              View Safe Routes
            </Button>
          </CardContent>
        </Card>

        {/* Zones List */}
        <div className="space-y-4">
          {filteredZones.map((zone) => {
            const CategoryIcon = getCategoryIcon(zone.category);
            return (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryIcon className="w-4 h-4 text-primary" />
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{zone.description}</p>
                    </div>
                    <Badge className={getSafetyColor(zone.safetyLevel)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {zone.safetyLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{zone.location.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Best time: {zone.bestTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {zone.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {zone.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{zone.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Get Directions
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      <Star className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredZones.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No zones found matching your criteria</p>
          </div>
        )}
      </div>
      
      {/* Floating Panic Button */}
      <FloatingPanicButton />
    </div>
  );
};

export default ZonesScreen;