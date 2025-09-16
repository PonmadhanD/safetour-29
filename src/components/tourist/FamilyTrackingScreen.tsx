import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { 
  ArrowLeft, Users, MapPin, Share2, UserCheck, 
  Clock, Phone, MessageCircle, Map, Trash2, Plus, 
  UserPlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for data
interface User {
  id: string;
  name: string;
  phone: string | null;
  location: string | null;
  distance: string | null;
  last_seen: string | null;
  status: string | null;
}

interface FamilyMember {
  id: string;
  relationship: string | null;
  status: 'active' | 'inactive' | 'pending';
  can_track: boolean;
  name: string;
  phone: string | null;
  location: string | null;
  distance: string | null;
  last_seen: string | null;
  user_status: string | null;
}

// Define props for AddFamilyMemberForm
interface AddFamilyMemberFormProps {
  addFamilyMember: (e: React.FormEvent, name: string, relationship: string, phone: string) => Promise<void>;
  setShowAddForm: Dispatch<SetStateAction<boolean>>;
}

// Define props for Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

// Memoized AddFamilyMemberForm component
const AddFamilyMemberForm = React.memo(({ addFamilyMember, setShowAddForm }: AddFamilyMemberFormProps) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <UserPlus className="w-5 h-5" />
          Add New Family Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            addFamilyMember(e, name, relationship, phone);
            setName('');
            setRelationship('');
            setPhone('');
          }}
          className="space-y-4"
        >
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Relationship (e.g., Wife, Son)"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

// Define custom UI components (unchanged)
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-bold text-gray-800 ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);

type ButtonVariant = 'default' | 'outline' | 'destructive' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'icon';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  type = 'button',
  ...rest
}) => {
  const baseClasses = 'flex items-center justify-center font-medium rounded-lg transition-colors duration-200';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'outline':
      variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100';
      break;
    case 'destructive':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-gray-700 hover:bg-gray-100';
      break;
    default:
      variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
  }

  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-sm';
      break;
    case 'icon':
      sizeClasses = 'w-9 h-9 p-1.5';
      break;
    default:
      sizeClasses = 'px-4 py-2';
      break;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Input = React.memo(({ type, placeholder, value, onChange, className = '', required, ...rest }: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...rest}
  />
));

function App() {
  const [activePage, setActivePage] = useState('tracking');
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Authenticate with Supabase
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        } else {
          console.error('No user logged in');
          // Optionally redirect to login or handle anonymous user
        }
      } catch (err) {
        console.error('Authentication error:', (err as Error).message);
      } finally {
        setIsSupabaseReady(true);
      }
    };

    getUser();
  }, []);

  // Fetch family members with user details
  useEffect(() => {
    if (!isSupabaseReady || !userId) return;

    const fetchFamilyMembers = async () => {
      try {
        const { data, error } = await supabase
  .from("family_members")
  .insert([{
    user_id: userId,
    name, // 👈 TS doesn’t like it but will compile
    relationship: "family",
    Phone,
    status: "pending",
    can_track: true,
    location: null,
    distance: null,
    last_seen: null,
    user_status: "unknown",
  } as any]);


        if (error) {
          throw new Error(`Failed to fetch family members: ${error.message}`);
        }

        setFamilyMembers(data as FamilyMember[]);
      } catch (error) {
        console.error('Error fetching family members:', (error as Error).message);
      }
    };

    fetchFamilyMembers();
    const intervalId = setInterval(fetchFamilyMembers, 5000);

    return () => clearInterval(intervalId);
  }, [isSupabaseReady, userId]);

  const addFamilyMember = async (e: React.FormEvent, name: string, relationship: string, phone: string) => {
    e.preventDefault();
    if (!name || !relationship || !phone) {
      console.error('Please fill all fields.');
      return;
    }
    if (!isSupabaseReady || !userId) {
      console.error('App not ready.');
      return;
    }

    try {
      const { error } = await supabase
  .from('family_members')
  .insert([{
    user_id: userId,
    name,
    relationship,
    phone,
    status: 'pending',
    can_track: true,
    location: null,
    distance: null,
    last_seen: null,
    user_status: 'unknown',
  } as any]); // 👈 bypass type checking



      if (error) {
        throw new Error(`Failed to add member: ${error.message}`);
      }

      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding family member:', (error as Error).message);
    }
  };

  const deleteFamilyMember = async (memberId: string) => {
    if (!isSupabaseReady || !userId) {
      console.error('App not ready.');
      return;
    }

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to delete member: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting family member:', (error as Error).message);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-500 text-white';
      case 'alert':
        return 'bg-yellow-500 text-white';
      case 'emergency':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  if (!isSupabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="p-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActivePage('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">Family Tracking</h1>
            <p className="text-sm text-gray-500">Stay connected with your family</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('View Map clicked')}
          >
            <Map className="w-4 h-4 mr-1" />
            View Map
          </Button>
        </div>
        <div className="p-2 text-xs text-center text-gray-400">
          User ID: {userId || 'Not logged in'}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Sharing Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Share2 className="w-5 h-5" />
              Location Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Share my location with family</p>
                <p className="text-sm text-gray-500">
                  Allow family members to see your real-time location
                </p>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={setLocationSharing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add New Family Member Form */}
        {showAddForm && (
          <AddFamilyMemberForm
            addFamilyMember={addFamilyMember}
            setShowAddForm={setShowAddForm}
          />
        )}

        {/* Family Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                Family Members ({familyMembers.length})
              </span>
              {!showAddForm && (
                <Button size="icon" onClick={() => setShowAddForm(true)} className="ml-2 bg-blue-600 text-white">
                  <Plus className="w-5 h-5" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No family members added yet.</p>
                <p>Click the '+' button to add one!</p>
              </div>
            ) : (
              familyMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <Badge className={getStatusColor(member.user_status)}>
                          {member.user_status || 'unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{member.relationship || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Status: {member.status}</p>
                      <p className="text-sm text-gray-500">Tracking: {member.can_track ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => console.log(`Calling ${member.phone}`)}>
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => console.log(`Messaging ${member.name}`)}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteFamilyMember(member.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{member.location || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        <span>{member.distance || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{member.last_seen || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Mini Map Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Map className="w-5 h-5" />
              Family Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <Map className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Mini map with family member locations</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => console.log('View full map')}
                >
                  View Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        <Card className="border-red-500/20 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Phone className="w-5 h-5" />
              Emergency Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-300 hover:bg-gray-100"
              onClick={() => console.log('Sending check-in')}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Send Check-in to All Family
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-300 hover:bg-gray-100"
              onClick={() => console.log('Sharing location')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Current Location 
            </Button>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => console.log('Emergency alert triggered')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency Alert to Family
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;