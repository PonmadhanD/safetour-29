import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Plus, Edit, Trash2, Save, MapPin, Route, Shield,
  Camera, Mountain, Church, TreePine, Search, Upload
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Attraction {
  id?: string;
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
  is_active: boolean;
}

interface SafeZone {
  zone_id?: string;
  name: string;
  description?: string;
  safety_level: 'safe' | 'caution' | 'danger';
  polygon_coordinates: any;
  created_by?: string;
}

const DataManagementScreen: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('attractions');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'attractions') {
        const { data, error } = await supabase
          .from('tourist_attractions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAttractions(data || []);
      } else if (activeTab === 'zones') {
        const { data, error } = await supabase
          .from('safe_zones')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSafeZones(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttraction = async (attraction: Attraction) => {
    try {
      setLoading(true);
      
      if (attraction.id) {
        // Update existing
        const { error } = await supabase
          .from('tourist_attractions')
          .update(attraction)
          .eq('id', attraction.id);
        
        if (error) throw error;
        toast.success('Attraction updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('tourist_attractions')
          .insert(attraction);
        
        if (error) throw error;
        toast.success('Attraction created successfully');
      }
      
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving attraction:', error);
      toast.error('Error saving attraction');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttraction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attraction?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('tourist_attractions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Attraction deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting attraction:', error);
      toast.error('Error deleting attraction');
    } finally {
      setLoading(false);
    }
  };

  const AttractionForm = ({ attraction, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState(attraction || {
      name: '',
      name_hi: '',
      name_ta: '',
      description: '',
      description_hi: '',
      description_ta: '',
      category: 'natural',
      latitude: 25.5788,
      longitude: 91.8933,
      rating: 4.0,
      contact_number: '',
      entry_fee: '',
      is_active: true
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>{attraction ? 'Edit Attraction' : 'Add New Attraction'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name (English)</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Attraction name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name (Hindi)</label>
              <Input
                value={formData.name_hi || ''}
                onChange={(e) => setFormData({...formData, name_hi: e.target.value})}
                placeholder="आकर्षण का नाम"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name (Tamil)</label>
              <Input
                value={formData.name_ta || ''}
                onChange={(e) => setFormData({...formData, name_ta: e.target.value})}
                placeholder="ஈர்ப்பு பெயர்"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description (English)</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Hindi)</label>
              <Textarea
                value={formData.description_hi || ''}
                onChange={(e) => setFormData({...formData, description_hi: e.target.value})}
                placeholder="विवरण"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Tamil)</label>
              <Textarea
                value={formData.description_ta || ''}
                onChange={(e) => setFormData({...formData, description_ta: e.target.value})}
                placeholder="விளக்கம்"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="religious">Religious</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <Input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <Input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <Input
                value={formData.contact_number || ''}
                onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                placeholder="+91-123-456-7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Entry Fee</label>
              <Input
                value={formData.entry_fee || ''}
                onChange={(e) => setFormData({...formData, entry_fee: e.target.value})}
                placeholder="₹50 per person"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setAuthorityPage('dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Data Management</h1>
            <p className="text-sm text-muted-foreground">Manage tourist attractions, safe zones and routes</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attractions">Tourist Attractions</TabsTrigger>
            <TabsTrigger value="zones">Safe Zones</TabsTrigger>
            <TabsTrigger value="routes">Safe Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="attractions" className="space-y-4">
            {showForm && activeTab === 'attractions' && (
              <AttractionForm
                attraction={editingItem}
                onSave={handleSaveAttraction}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            )}

            <div className="grid gap-4">
              {attractions.map((attraction) => (
                <Card key={attraction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{attraction.name}</h3>
                        <p className="text-sm text-muted-foreground">{attraction.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {attraction.category}
                          </Badge>
                          <Badge variant={attraction.is_active ? 'default' : 'secondary'}>
                            {attraction.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(attraction);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAttraction(attraction.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Safe Zones management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Route className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Safe Routes management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataManagementScreen;