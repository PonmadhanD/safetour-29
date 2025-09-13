import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, MapPin, Clock, Phone, Search, Star, Navigation,
  Camera, Mountain, Church, TreePine, Compass, Utensils, Route
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Attraction {
  id: string;
  name: string;
  name_hi?: string;
  name_ta?: string;
  description?: string;
  description_hi?: string;
  description_ta?: string;
  category: string;
  latitude: number;
  longitude: number;
  rating: number;
  contact_number?: string;
  opening_hours?: any;
  entry_fee?: string;
}

interface NearbyService {
  id: string;
  name: string;
  name_hi?: string;
  name_ta?: string;
  service_type: string;
  latitude: number;
  longitude: number;
  contact_number?: string;
  address?: string;
  address_hi?: string;
  address_ta?: string;
  is_24x7: boolean;
  rating: number;
}

const AttractionsScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const { language, t } = useLanguage();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [services, setServices] = useState<NearbyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Shillong coordinates
          setUserLocation({ lat: 25.5788, lng: 91.8933 });
        }
      );
    } else {
      // Fallback to Shillong coordinates
      setUserLocation({ lat: 25.5788, lng: 91.8933 });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load attractions
      const { data: attractionsData, error: attractionsError } = await supabase
        .from('tourist_attractions')
        .select('*')
        .eq('is_active', true);

      if (attractionsError) throw attractionsError;

      // Load nearby services
      const { data: servicesData, error: servicesError } = await supabase
        .from('nearby_services')
        .select('*')
        .eq('is_active', true);

      if (servicesError) throw servicesError;

      setAttractions(attractionsData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedName = (item: Attraction | NearbyService) => {
    if (language === 'hi' && item.name_hi) return item.name_hi;
    if (language === 'ta' && item.name_ta) return item.name_ta;
    return item.name;
  };

  const getLocalizedDescription = (attraction: Attraction) => {
    if (language === 'hi' && attraction.description_hi) return attraction.description_hi;
    if (language === 'ta' && attraction.description_ta) return attraction.description_ta;
    return attraction.description;
  };

  const getLocalizedAddress = (service: NearbyService) => {
    if (language === 'hi' && service.address_hi) return service.address_hi;
    if (language === 'ta' && service.address_ta) return service.address_ta;
    return service.address;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'natural': return TreePine;
      case 'historical': return Camera;
      case 'religious': return Church;
      case 'cultural': return Compass;
      case 'adventure': return Mountain;
      default: return MapPin;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'police': return Badge;
      case 'hospital': return Phone;
      case 'hotel': return MapPin;
      case 'restaurant': return Utensils;
      case 'atm': return MapPin;
      case 'fuel_station': return MapPin;
      default: return MapPin;
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceToAttraction = (attraction: Attraction) => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      attraction.latitude, attraction.longitude
    );
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  const handleNavigateToAttraction = (attraction: Attraction) => {
    // Store the selected attraction for navigation
    localStorage.setItem('navigationTarget', JSON.stringify({
      name: getLocalizedName(attraction),
      lat: attraction.latitude,
      lng: attraction.longitude
    }));
    setTouristPage('routes');
  };

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = getLocalizedName(attraction).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (getLocalizedDescription(attraction) || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredServices = services.filter(service =>
    getLocalizedName(service).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-foreground">{t('touristAttractions')}</h1>
            <p className="text-sm text-muted-foreground">{t('discoverAmazingPlaces')}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchAttractionsAndServices')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="attractions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attractions">{t('touristAttractions')}</TabsTrigger>
            <TabsTrigger value="services">{t('nearbyServices')}</TabsTrigger>
          </TabsList>

          <TabsContent value="attractions" className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                {t('all')}
              </Button>
              {['natural', 'historical', 'religious', 'cultural', 'adventure'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize whitespace-nowrap"
                >
                  {t(category)}
                </Button>
              ))}
            </div>

            {/* Attractions List */}
            <div className="space-y-4">
              {filteredAttractions.map((attraction) => {
                const CategoryIcon = getCategoryIcon(attraction.category);
                return (
                  <Card key={attraction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CategoryIcon className="w-5 h-5 text-primary" />
                            {getLocalizedName(attraction)}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-warning fill-current" />
                            <span className="text-sm font-medium">{attraction.rating}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {attraction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {getLocalizedDescription(attraction) && (
                        <p className="text-sm text-muted-foreground">
                          {getLocalizedDescription(attraction)}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{getDistanceToAttraction(attraction) || t('viewLocation')}</span>
                        </div>
                        
                        {attraction.contact_number && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{attraction.contact_number}</span>
                          </div>
                        )}
                      </div>

                      {attraction.opening_hours && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {attraction.opening_hours.open} - {attraction.opening_hours.close}
                          </span>
                        </div>
                      )}

                      {attraction.entry_fee && (
                        <div className="text-sm">
                          <span className="font-medium">{t('entryFee')}: </span>
                          <span className="text-primary">{attraction.entry_fee}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleNavigateToAttraction(attraction)}
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          {t('getDirections')}
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            // Store attraction details for map view
                            localStorage.setItem('selectedAttraction', JSON.stringify(attraction));
                            setTouristPage('map');
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {t('viewOnMap')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {/* Services List */}
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.service_type);
                return (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <ServiceIcon className="w-5 h-5 text-primary mt-1" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{getLocalizedName(service)}</h3>
                              <Badge variant="outline" className="text-xs capitalize mt-1">
                                {service.service_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            {service.is_24x7 && (
                              <Badge variant="secondary" className="text-xs">
                                24/7
                              </Badge>
                            )}
                          </div>
                          
                          {getLocalizedAddress(service) && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                              <MapPin className="w-3 h-3" />
                              <span>{getLocalizedAddress(service)}</span>
                            </div>
                          )}
                          
                          {service.contact_number && (
                            <div className="flex items-center gap-1 text-sm text-primary mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{service.contact_number}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 text-sm mt-2">
                            <Star className="w-3 h-3 text-warning fill-current" />
                            <span>{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttractionsScreen;