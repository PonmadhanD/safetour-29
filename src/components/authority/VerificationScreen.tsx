import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Shield, QrCode, Search, CheckCircle, 
  XCircle, User, MapPin, Phone, Calendar, Camera
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const VerificationScreen: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  const mockTourist = {
    id: 'tourist_1234',
    name: 'John Doe',
    digitalId: 'DID_1642857600000',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    isVerified: true,
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    currentLocation: 'Shillong, Meghalaya',
    emergencyContact: '+91 87654 32109',
    travelPurpose: 'Tourism',
    status: 'safe'
  };

  const handleSearch = () => {
    setTimeout(() => {
      setVerificationResult(mockTourist);
    }, 1500);
  };

  const handleQRScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setVerificationResult(mockTourist);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/80 shadow-md border-b sticky top-0 z-40"
        >
          <div className="p-4 max-w-4xl mx-auto flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthorityPage('dashboard')}
                  className="text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Dashboard</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-2xl font-semibold text-white">Tourist ID Verification</h1>
              <p className="text-sm text-white">Verify digital tourist identification</p>
            </div>
          </div>
        </motion.div>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Search & Scan */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Search className="w-5 h-5 text-white" />
                  Search by ID
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Digital ID or Tourist Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-purple-300 focus:border-purple-500"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <Button 
                      onClick={handleSearch} 
                      disabled={!searchQuery}
                      className="bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <QrCode className="w-5 h-5 text-white" />
                  QR Code Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 border-purple-300 text-black-700 hover:bg-purple-50"
                    onClick={handleQRScan}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mr-2 text-black-600" />
                        Scan QR Code
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verification Result */}
          <AnimatePresence>
            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-green-500 shadow-lg bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-indigo-50">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-6 h-6" />
                        Verification Successful
                      </span>
                      <Badge className="bg-green-600 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2 text-black">Personal Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Full Name</p>
                              <p className="font-medium text-black-800">{verificationResult.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Digital ID</p>
                              <p className="font-medium font-mono text-black-800">{verificationResult.digitalId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Phone Number</p>
                              <p className="font-medium text-black-800">{verificationResult.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Current Location</p>
                              <p className="font-medium text-black-800">{verificationResult.currentLocation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verification Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2 text-black-800">Verification Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Issue Date</p>
                              <p className="font-medium text-black-800">{verificationResult.issueDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-black-600" />
                            <div>
                              <p className="text-sm text-black-600">Expiry Date</p>
                              <p className="font-medium text-black-800">{verificationResult.expiryDate}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-black-600">Status</p>
                            <div className="flex gap-2">
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Valid ID
                              </Badge>
                              <Badge className="bg-purple-600 text-white">
                                Blockchain Verified
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-700">✓ Digital signature valid</p>
                            <p className="text-sm font-medium text-green-700">✓ Blockchain verification passed</p>
                            <p className="text-sm font-medium text-green-700">✓ Document not tampered</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Information */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-black-800 mb-2">Emergency Contact</h4>
                      <p className="text-sm text-black-600">
                        <span className="font-medium">Contact:</span> {verificationResult.emergencyContact}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button 
                          variant="default" 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Verified
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-purple-300 text-black-700 hover:bg-purple-50"
                        >
                          View Travel History
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                        >
                          Flag for Review
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Verifications */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="shadow-md bg-white">
              <CardHeader className="pb-3 bg-primary/80">
                <CardTitle className="text-lg text-white">Recent Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm text-purple-800">Tourist ID Verified</p>
                          <p className="text-xs text-purple-600">John Doe - DID_1642857600000</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-600 text-white">Verified</Badge>
                        <p className="text-xs text-purple-500 mt-1">{i} hour{i !== 1 ? 's' : ''} ago</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VerificationScreen;