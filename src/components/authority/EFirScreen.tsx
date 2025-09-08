import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, FileText, Plus, Search, Clock, 
  AlertTriangle, CheckCircle, MapPin, User, Calendar
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const EFirScreen: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [activeTab, setActiveTab] = useState<'create' | 'pending' | 'all'>('create');
  const [firForm, setFirForm] = useState({
    touristId: '',
    incidentType: '',
    priority: '',
    description: '',
    location: '',
    dateTime: '',
    witnesses: ''
  });

  const pendingFirs = [
    {
      id: 'FIR_001',
      touristName: 'John Doe',
      incidentType: 'Theft',
      location: 'Shillong Police Bazaar',
      priority: 'high',
      status: 'investigating',
      reportedAt: '2024-01-15T10:30:00Z',
      assignedOfficer: 'Officer Kumar'
    },
    {
      id: 'FIR_002',
      touristName: 'Sarah Wilson',
      incidentType: 'Lost Documents',
      location: 'Kaziranga National Park',
      priority: 'medium',
      status: 'pending',
      reportedAt: '2024-01-15T14:15:00Z',
      assignedOfficer: null
    }
  ];

  const handleCreateFir = () => {
    console.log('Creating FIR:', firForm);
    // Reset form
    setFirForm({
      touristId: '',
      incidentType: '',
      priority: '',
      description: '',
      location: '',
      dateTime: '',
      witnesses: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-emergency border-emergency bg-emergency-light';
      case 'high': return 'text-emergency border-emergency';
      case 'medium': return 'text-warning border-warning';
      case 'low': return 'text-success border-success';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning border-warning';
      case 'investigating': return 'text-primary border-primary';
      case 'resolved': return 'text-success border-success';
      case 'closed': return 'text-muted-foreground border-muted-foreground';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-accent">
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
          <div>
            <h1 className="text-xl font-bold">E-FIR Management</h1>
            <p className="text-sm text-muted-foreground">Electronic First Information Report System</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create E-FIR
          </Button>
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending ({pendingFirs.filter(f => f.status === 'pending').length})
          </Button>
          <Button 
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            <FileText className="w-4 h-4 mr-2" />
            All FIRs
          </Button>
        </div>

        {/* Create E-FIR Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Create New E-FIR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tourist ID</Label>
                    <Input
                      value={firForm.touristId}
                      onChange={(e) => setFirForm(prev => ({ ...prev, touristId: e.target.value }))}
                      placeholder="Enter Digital Tourist ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Incident Type</Label>
                    <Select value={firForm.incidentType} onValueChange={(value) => setFirForm(prev => ({ ...prev, incidentType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="assault">Assault</SelectItem>
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="lost_documents">Lost Documents</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="property_damage">Property Damage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={firForm.priority} onValueChange={(value) => setFirForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date & Time of Incident</Label>
                    <Input
                      type="datetime-local"
                      value={firForm.dateTime}
                      onChange={(e) => setFirForm(prev => ({ ...prev, dateTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Incident Location</Label>
                  <Input
                    value={firForm.location}
                    onChange={(e) => setFirForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter detailed location of incident"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Incident Description</Label>
                  <Textarea
                    value={firForm.description}
                    onChange={(e) => setFirForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed description of the incident"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Witnesses (if any)</Label>
                  <Textarea
                    value={firForm.witnesses}
                    onChange={(e) => setFirForm(prev => ({ ...prev, witnesses: e.target.value }))}
                    placeholder="Names and contact details of witnesses"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="w-full">
                    Save as Draft
                  </Button>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleCreateFir}
                    disabled={!firForm.touristId || !firForm.incidentType || !firForm.description}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Submit E-FIR
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Search Tourist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Mark Location
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Evidence
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Templates</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      Theft Report Template
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      Lost Documents Template
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      Harassment Report Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pending FIRs Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingFirs.map((fir) => (
              <Card key={fir.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{fir.id}</h3>
                        <p className="text-sm text-muted-foreground">{fir.incidentType}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getPriorityColor(fir.priority)}>
                          {fir.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(fir.status)}>
                          {fir.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Tourist</p>
                        <p className="font-medium">{fir.touristName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{fir.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Reported</p>
                        <p className="font-medium">{new Date(fir.reportedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{fir.assignedOfficer || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="default" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Assign Officer
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                    <Button variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* All FIRs Tab */}
        {activeTab === 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All E-FIRs</span>
                <div className="flex gap-2">
                  <Input placeholder="Search FIRs..." className="w-64" />
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...pendingFirs, ...Array(3).fill(0).map((_, i) => ({
                  id: `FIR_00${i + 3}`,
                  touristName: ['Alice Brown', 'Bob Smith', 'Carol Davis'][i],
                  incidentType: ['Fraud', 'Property Damage', 'Harassment'][i],
                  location: ['Guwahati', 'Tezpur', 'Dibrugarh'][i],
                  priority: ['medium', 'low', 'high'][i],
                  status: ['resolved', 'closed', 'investigating'][i],
                  reportedAt: new Date(2024, 0, 14 - i).toISOString(),
                  assignedOfficer: ['Officer Sharma', 'Officer Singh', 'Officer Kumar'][i]
                }))].map((fir) => (
                  <div key={fir.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-sm">{fir.id}</p>
                        <p className="text-xs text-muted-foreground">{fir.incidentType} - {fir.touristName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getPriorityColor(fir.priority)}>
                        {fir.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(fir.status)}>
                        {fir.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(fir.reportedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EFirScreen;