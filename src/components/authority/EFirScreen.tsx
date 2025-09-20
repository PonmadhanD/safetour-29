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
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-yellow-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'investigating': return 'bg-indigo-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

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
          <div className="p-4 max-w-6xl mx-auto flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthorityPage('dashboard')}
                  className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Dashboard</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-2xl font-bold text-indigo-800">E-FIR Management</h1>
              <p className="text-sm text-indigo-600">Electronic First Information Report System</p>
            </div>
          </div>
        </motion.div>

        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-2 mb-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Button 
                variant={activeTab === 'create' ? 'default' : 'outline'}
                onClick={() => setActiveTab('create')}
                className={activeTab === 'create' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create E-FIR
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Button 
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
                className={activeTab === 'pending' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending ({pendingFirs.filter(f => f.status === 'pending').length})
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Button 
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className={activeTab === 'all' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'}
              >
                <FileText className="w-4 h-4 mr-2" />
                All FIRs
              </Button>
            </motion.div>
          </motion.div>

          {/* Create E-FIR Tab */}
          <AnimatePresence>
            {activeTab === 'create' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="text-lg">Create New E-FIR</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-indigo-700">Tourist ID</Label>
                        <Input
                          value={firForm.touristId}
                          onChange={(e) => setFirForm(prev => ({ ...prev, touristId: e.target.value }))}
                          placeholder="Enter Digital Tourist ID"
                          className="border-indigo-300 focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-indigo-700">Incident Type</Label>
                        <Select value={firForm.incidentType} onValueChange={(value) => setFirForm(prev => ({ ...prev, incidentType: value }))}>
                          <SelectTrigger className="border-indigo-300 focus:border-indigo-500">
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
                        <Label className="text-indigo-700">Priority</Label>
                        <Select value={firForm.priority} onValueChange={(value) => setFirForm(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="border-indigo-300 focus:border-indigo-500">
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
                        <Label className="text-indigo-700">Date & Time of Incident</Label>
                        <Input
                          type="datetime-local"
                          value={firForm.dateTime}
                          onChange={(e) => setFirForm(prev => ({ ...prev, dateTime: e.target.value }))}
                          className="border-indigo-300 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-indigo-700">Incident Location</Label>
                      <Input
                        value={firForm.location}
                        onChange={(e) => setFirForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter detailed location of incident"
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-indigo-700">Incident Description</Label>
                      <Textarea
                        value={firForm.description}
                        onChange={(e) => setFirForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide detailed description of the incident"
                        rows={5}
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-indigo-700">Witnesses (if any)</Label>
                      <Textarea
                        value={firForm.witnesses}
                        onChange={(e) => setFirForm(prev => ({ ...prev, witnesses: e.target.value }))}
                        placeholder="Names and contact details of witnesses"
                        rows={3}
                        className="border-indigo-300 focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                          Save as Draft
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button 
                          variant="default" 
                          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                          onClick={handleCreateFir}
                          disabled={!firForm.touristId || !firForm.incidentType || !firForm.description}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Submit E-FIR
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                        <Search className="w-4 h-4 mr-2" />
                        Search Tourist
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                        <MapPin className="w-4 h-4 mr-2" />
                        Mark Location
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button variant="outline" className="w-full justify-start border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Evidence
                      </Button>
                    </motion.div>
                    
                    <div className="pt-4 border-t border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 mb-2">Templates</h4>
                      <div className="space-y-2">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-indigo-700 hover:bg-indigo-50">
                            Theft Report Template
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-indigo-700 hover:bg-indigo-50">
                            Lost Documents Template
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-indigo-700 hover:bg-indigo-50">
                            Harassment Report Template
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending FIRs Tab */}
          <AnimatePresence>
            {activeTab === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {pendingFirs.map((fir) => (
                  <motion.div
                    key={fir.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="shadow-md hover:shadow-lg transition-shadow bg-white"
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-indigo-800">{fir.id}</h3>
                              <p className="text-sm text-indigo-600">{fir.incidentType}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={getPriorityColor(fir.priority) + ' border-2'}>
                                {fir.priority} priority
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(fir.status) + ' border-2'}>
                                {fir.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="text-indigo-600">Tourist</p>
                              <p className="font-medium text-indigo-800">{fir.touristName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="text-indigo-600">Location</p>
                              <p className="font-medium text-indigo-800">{fir.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="text-indigo-600">Reported</p>
                              <p className="font-medium text-indigo-800">{new Date(fir.reportedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            <div>
                              <p className="text-indigo-600">Assigned To</p>
                              <p className="font-medium text-indigo-800">{fir.assignedOfficer || 'Unassigned'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button variant="default" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
                              View Details
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                              Assign Officer
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                              Update Status
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Button variant="default" size="sm" className="bg-green-600 text-white hover:bg-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Resolved
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* All FIRs Tab */}
          <AnimatePresence>
            {activeTab === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="shadow-md bg-white"
              >
                <Card>
                  <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="text-indigo-800">All E-FIRs</span>
                      <div className="flex gap-2">
                        <Input placeholder="Search FIRs..." className="w-64 border-indigo-300 focus:border-indigo-500" />
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <Button variant="outline" size="icon" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                            <Search className="w-4 h-4" />
                          </Button>
                        </motion.div>
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
                        <motion.div
                          key={fir.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center justify-between p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium text-sm text-indigo-800">{fir.id}</p>
                              <p className="text-xs text-indigo-600">{fir.incidentType} - {fir.touristName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getPriorityColor(fir.priority) + ' border-2'}>
                              {fir.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(fir.status) + ' border-2'}>
                              {fir.status}
                            </Badge>
                            <p className="text-xs text-indigo-500">
                              {new Date(fir.reportedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EFirScreen;