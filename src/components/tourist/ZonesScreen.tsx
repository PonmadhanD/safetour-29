import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Search, MapPin, Star, Clock, Shield, 
  Mountain, Camera, Church, Trees, Users
} from 'lucide-react';
import { Zone } from '@/types';

import FloatingPanicButton from './FloatingPanicButton';

const ZonesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const zones: Zone[] = [
  {
    id: 'tawang_monastery',
    name: 'Tawang Monastery',
    description: 'Historic Buddhist site at high altitude, known for scenic views and cultural festivals',
    category: 'religious',
    safetyLevel: 'high',
    location: { lat: 27.5853, lng: 91.8665, address: 'Tawang, Arunachal Pradesh' },
    features: ['Scenic Views', 'Cultural Festivals', 'Monastery Tour'],
    bestTime: '6 AM - 6 PM',
    guidelines: ['Obtain Inner Line Permit (ILP)', 'Dress modestly', 'Respect religious practices'],
    emergencyContacts: ['+91-3794-222222']
  },
  {
    id: 'ziro_valley',
    name: 'Ziro Valley',
    description: 'Famous for rice fields, tribal culture, and the Ziro Music Festival',
    category: 'cultural',
    safetyLevel: 'medium',
    location: { lat: 27.5880, lng: 93.8351, address: 'Ziro, Arunachal Pradesh' },
    features: ['Rice Fields', 'Tribal Culture', 'Music Festival'],
    bestTime: '8 AM - 5 PM',
    guidelines: ['Respect local tribal customs', 'Carry insect repellent', 'Avoid during heavy rains'],
    emergencyContacts: ['+91-3794-223344']
  },
  {
    id: 'namdapha_national_park',
    name: 'Namdapha National Park',
    description: 'Biodiversity hotspot with trekking and rare wildlife (tigers, snow leopards)',
    category: 'adventure',
    safetyLevel: 'medium',
    location: { lat: 27.4600, lng: 95.5800, address: 'Changlang, Arunachal Pradesh' },
    features: ['Trekking', 'Wildlife Safari', 'Nature Photography'],
    bestTime: '7 AM - 4 PM',
    guidelines: ['Hire certified guides', 'Carry trekking gear', 'Avoid wildlife encounters'],
    emergencyContacts: ['+91-3794-224455']
  },
  {
    id: 'kaziranga_national_park',
    name: 'Kaziranga National Park',
    description: 'UNESCO World Heritage Site, home to one-horned rhinos and jeep safaris',
    category: 'adventure',
    safetyLevel: 'high',
    location: { lat: 26.6745, lng: 93.2076, address: 'Golaghat, Assam' },
    features: ['Jeep Safari', 'Wildlife Viewing', 'Photography'],
    bestTime: '6 AM - 5 PM',
    guidelines: ['Book safaris in advance', 'Stay on marked routes', 'Keep distance from animals'],
    emergencyContacts: ['+91-3776-268095']
  },
  {
    id: 'majuli_island',
    name: 'Majuli Island',
    description: 'World’s largest river island, featuring Vaishnavite monasteries and cultural performances',
    category: 'cultural',
    safetyLevel: 'medium',
    location: { lat: 26.9500, lng: 94.1167, address: 'Majuli, Assam' },
    features: ['Monastery Visits', 'Cultural Performances', 'Boating'],
    bestTime: '8 AM - 6 PM',
    guidelines: ['Check ferry timings', 'Respect satra customs', 'Avoid during monsoon flooding'],
    emergencyContacts: ['+91-3775-277444']
  },
  {
    id: 'kamakhya_temple',
    name: 'Kamakhya Temple',
    description: 'Sacred Hindu temple in Guwahati, a major pilgrimage site',
    category: 'religious',
    safetyLevel: 'high',
    location: { lat: 26.1664, lng: 91.7055, address: 'Guwahati, Assam' },
    features: ['Pilgrimage', 'Religious Rituals', 'Cultural Significance'],
    bestTime: '5 AM - 8 PM',
    guidelines: ['Dress modestly', 'Follow temple protocols', 'Avoid peak festival crowds'],
    emergencyContacts: ['+91-361-2734624']
  },
  {
    id: 'manas_national_park',
    name: 'Manas National Park',
    description: 'Tiger reserve with diverse flora and fauna',
    category: 'adventure',
    safetyLevel: 'medium',
    location: { lat: 26.7176, lng: 90.9602, address: 'Barpeta, Assam' },
    features: ['Wildlife Safari', 'Bird Watching', 'Nature Trails'],
    bestTime: '6 AM - 5 PM',
    guidelines: ['Follow guided tours', 'Carry ID for border checks', 'Avoid monsoon season'],
    emergencyContacts: ['+91-3666-261413']
  },
  {
    id: 'cherrapunji',
    name: 'Cherrapunji (Sohra)',
    description: 'Known for living root bridges, waterfalls (e.g., Nohkalikai), and heavy rainfall',
    category: 'nature',
    safetyLevel: 'medium',
    location: { lat: 25.2993, lng: 91.7362, address: 'Cherrapunji, Meghalaya' },
    features: ['Root Bridges', 'Waterfalls', 'Trekking'],
    bestTime: '8 AM - 5 PM',
    guidelines: ['Wear non-slip shoes', 'Hire local guides', 'Check weather for heavy rain'],
    emergencyContacts: ['+91-364-2222108']
  },
  {
    id: 'shillong',
    name: 'Shillong',
    description: '“Scotland of the East” with lakes, peaks, and colonial architecture',
    category: 'tourist',
    safetyLevel: 'high',
    location: { lat: 25.5788, lng: 91.8933, address: 'Shillong, Meghalaya' },
    features: ['Lakes', 'Colonial Sites', 'Local Markets'],
    bestTime: '9 AM - 6 PM',
    guidelines: ['Explore markets safely', 'Follow local traffic rules', 'Respect cultural sites'],
    emergencyContacts: ['+91-364-2222108']
  },
  {
    id: 'mawlynnong',
    name: 'Mawlynnong',
    description: 'Asia’s cleanest village, featuring bamboo bridges and eco-tourism',
    category: 'cultural',
    safetyLevel: 'high',
    location: { lat: 25.2667, lng: 91.8667, address: 'Mawlynnong, Meghalaya' },
    features: ['Bamboo Bridges', 'Eco-Tourism', 'Village Walks'],
    bestTime: '8 AM - 5 PM',
    guidelines: ['No plastics allowed', 'Wear sturdy shoes for treks', 'Respect village rules'],
    emergencyContacts: ['+91-364-2222108']
  },
  {
    id: 'dawki',
    name: 'Dawki',
    description: 'Crystal-clear Umngot River for boating and border views',
    category: 'adventure',
    safetyLevel: 'medium',
    location: { lat: 25.2000, lng: 92.0167, address: 'Dawki, Meghalaya' },
    features: ['Boating', 'Photography', 'Border Views'],
    bestTime: '9 AM - 4 PM',
    guidelines: ['Wear life jackets', 'Carry ID for border checks', 'Avoid during high water levels'],
    emergencyContacts: ['+91-364-2222108']
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
            onClick={() => navigate('/')}
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
              onClick={() => navigate('/routes')}
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