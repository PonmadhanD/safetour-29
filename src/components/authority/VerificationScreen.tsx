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
    // Simulate verification process
    setTimeout(() => {
      setVerificationResult(mockTourist);
    }, 1500);
  };

  const handleQRScan = () => {
    setScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      setScanning(false);
      setVerificationResult(mockTourist);
    }, 2000);
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
            <h1 className="text-xl font-bold">Tourist ID Verification</h1>
            <p className="text-sm text-muted-foreground">Verify digital tourist identification</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Search & Scan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Search by ID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Digital ID or Tourist Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={!searchQuery}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-secondary" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full h-16"
                onClick={handleQRScan}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 mr-2" />
                    Scan QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <Card className="border-2 border-success">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-success" />
                  Verification Successful
                </span>
                <Badge className="bg-success text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{verificationResult.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Digital ID</p>
                        <p className="font-medium font-mono">{verificationResult.digitalId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{verificationResult.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Location</p>
                        <p className="font-medium">{verificationResult.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Verification Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{verificationResult.issueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">{verificationResult.expiryDate}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex gap-2">
                        <Badge className="bg-success text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Valid ID
                        </Badge>
                        <Badge className="bg-primary text-white">
                          Blockchain Verified
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-success-light p-3 rounded-lg">
                      <p className="text-sm font-medium text-success">✓ Digital signature valid</p>
                      <p className="text-sm font-medium text-success">✓ Blockchain verification passed</p>
                      <p className="text-sm font-medium text-success">✓ Document not tampered</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Information */}
              <div className="mt-6 p-4 bg-emergency-light rounded-lg">
                <h4 className="font-semibold text-emergency mb-2">Emergency Contact</h4>
                <p className="text-sm">
                  <span className="font-medium">Contact:</span> {verificationResult.emergencyContact}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button variant="success" className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Verified
                </Button>
                <Button variant="outline" className="flex-1">
                  View Travel History
                </Button>
                <Button variant="warning">
                  Flag for Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Tourist ID Verified</p>
                      <p className="text-xs text-muted-foreground">John Doe - DID_1642857600000</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-success text-white">Verified</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{i} hour{i !== 1 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationScreen;