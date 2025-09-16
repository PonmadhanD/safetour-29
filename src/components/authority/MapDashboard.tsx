import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertTriangle, Shield, Activity, Phone, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Tourist } from '@/types';
import MapView from '@/components/MapView';

// Mock tourist data
const mockTourists: Tourist[] = [
  // Group 1: Shillong Central (5 tourists, mostly safe)
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    digitalId: 'TID001',
    isVerified: true,
    currentLocation: {
      lat: 25.5788,
      lng: 91.8933,
      address: 'Police Bazar, Shillong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91-9876543211',
    digitalId: 'TID002',
    isVerified: true,
    currentLocation: {
      lat: 25.5800,
      lng: 91.8950,
      address: 'Laitumkhrah, Shillong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:25:00Z'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+91-9876543212',
    digitalId: 'TID003',
    isVerified: true,
    currentLocation: {
      lat: 25.5790,
      lng: 91.8940,
      address: 'Mawphlang, Shillong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T10:20:00Z'
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+91-9876543213',
    digitalId: 'TID004',
    isVerified: true,
    currentLocation: {
      lat: 25.5810,
      lng: 91.8960,
      address: 'Barik, Shillong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:15:00Z'
  },
  {
    id: '5',
    name: 'Emma Brown',
    email: 'emma@example.com',
    phone: '+91-9876543214',
    digitalId: 'TID005',
    isVerified: true,
    currentLocation: {
      lat: 25.5770,
      lng: 91.8920,
      address: 'Happy Valley, Shillong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:10:00Z'
  },
  // Group 2: Cherrapunji Area (6 tourists, mixed status)
  {
    id: '6',
    name: 'Michael Garcia',
    email: 'michael@example.com',
    phone: '+91-9876543215',
    digitalId: 'TID006',
    isVerified: true,
    currentLocation: {
      lat: 25.2993,
      lng: 91.7362,
      address: 'Sohra, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T09:45:00Z'
  },
  {
    id: '7',
    name: 'Sarah Lee',
    email: 'sarah@example.com',
    phone: '+91-9876543216',
    digitalId: 'TID007',
    isVerified: true,
    currentLocation: {
      lat: 25.3000,
      lng: 91.7370,
      address: 'Nohkalikai Falls, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T09:40:00Z'
  },
  {
    id: '8',
    name: 'David Kim',
    email: 'david@example.com',
    phone: '+91-9876543217',
    digitalId: 'TID008',
    isVerified: true,
    currentLocation: {
      lat: 25.2980,
      lng: 91.7350,
      address: 'Root Bridges, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T09:35:00Z'
  },
  {
    id: '9',
    name: 'Lisa Chen',
    email: 'lisa@example.com',
    phone: '+91-9876543218',
    digitalId: 'TID009',
    isVerified: true,
    currentLocation: {
      lat: 25.3010,
      lng: 91.7380,
      address: 'Mawsmai Cave, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'emergency',
    lastActive: '2024-01-08T09:30:00Z'
  },
  {
    id: '10',
    name: 'Tom Patel',
    email: 'tom@example.com',
    phone: '+91-9876543219',
    digitalId: 'TID010',
    isVerified: true,
    currentLocation: {
      lat: 25.3020,
      lng: 91.7390,
      address: 'Seven Sister Falls, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T09:25:00Z'
  },
  {
    id: '11',
    name: 'Anna Singh',
    email: 'anna@example.com',
    phone: '+91-9876543220',
    digitalId: 'TID011',
    isVerified: true,
    currentLocation: {
      lat: 25.3030,
      lng: 91.7400,
      address: 'Thangkharang Park, Cherrapunji'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T09:20:00Z'
  },
  // Group 3: Mawlynnong Village (7 tourists, mostly alert)
  {
    id: '12',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+91-9876543221',
    digitalId: 'TID012',
    isVerified: true,
    currentLocation: {
      lat: 25.2667,
      lng: 91.8667,
      address: 'Mawlynnong Village'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T09:15:00Z'
  },
  {
    id: '13',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543222',
    digitalId: 'TID013',
    isVerified: true,
    currentLocation: {
      lat: 25.2670,
      lng: 91.8670,
      address: 'Living Root Bridge, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T09:10:00Z'
  },
  {
    id: '14',
    name: 'Vikram Reddy',
    email: 'vikram@example.com',
    phone: '+91-9876543223',
    digitalId: 'TID014',
    isVerified: true,
    currentLocation: {
      lat: 25.2680,
      lng: 91.8680,
      address: 'Sky View Point, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T09:05:00Z'
  },
  {
    id: '15',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    phone: '+91-9876543224',
    digitalId: 'TID015',
    isVerified: true,
    currentLocation: {
      lat: 25.2690,
      lng: 91.8690,
      address: 'Bamboo Bridge, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T09:00:00Z'
  },
  {
    id: '16',
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91-9876543225',
    digitalId: 'TID016',
    isVerified: true,
    currentLocation: {
      lat: 25.2700,
      lng: 91.8700,
      address: 'Eco Park, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:55:00Z'
  },
  {
    id: '17',
    name: 'Riya Patel',
    email: 'riya@example.com',
    phone: '+91-9876543226',
    digitalId: 'TID017',
    isVerified: true,
    currentLocation: {
      lat: 25.2710,
      lng: 91.8710,
      address: 'Village Trail, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T08:50:00Z'
  },
  {
    id: '18',
    name: 'Sanjay Joshi',
    email: 'sanjay@example.com',
    phone: '+91-9876543227',
    digitalId: 'TID018',
    isVerified: true,
    currentLocation: {
      lat: 25.2720,
      lng: 91.8720,
      address: 'Mawlynnong School, Mawlynnong'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:45:00Z'
  },
  // Group 4: Dawki River Area (8 tourists, varied status)
  {
    id: '19',
    name: 'Kiran Desai',
    email: 'kiran@example.com',
    phone: '+91-9876543228',
    digitalId: 'TID019',
    isVerified: true,
    currentLocation: {
      lat: 25.2000,
      lng: 92.0167,
      address: 'Umngot River, Dawki'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:40:00Z'
  },
  {
    id: '20',
    name: 'Meera Nair',
    email: 'meera@example.com',
    phone: '+91-9876543229',
    digitalId: 'TID020',
    isVerified: true,
    currentLocation: {
      lat: 25.2010,
      lng: 92.0170,
      address: 'Dawki Boating Point'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T08:35:00Z'
  },
  {
    id: '21',
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    phone: '+91-9876543230',
    digitalId: 'TID021',
    isVerified: true,
    currentLocation: {
      lat: 25.2020,
      lng: 92.0180,
      address: 'Bangladesh Border View, Dawki'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'emergency',
    lastActive: '2024-01-08T08:30:00Z'
  },
  {
    id: '22',
    name: 'Sita Raman',
    email: 'sita@example.com',
    phone: '+91-9876543231',
    digitalId: 'TID022',
    isVerified: true,
    currentLocation: {
      lat: 25.2030,
      lng: 92.0190,
      address: 'Umiam Lake View, Dawki'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:25:00Z'
  },
  {
    id: '23',
    name: 'Arjun Bose',
    email: 'arjun@example.com',
    phone: '+91-9876543232',
    digitalId: 'TID023',
    isVerified: true,
    currentLocation: {
      lat: 25.2040,
      lng: 92.0200,
      address: 'Dawki Market'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T08:20:00Z'
  },
  {
    id: '24',
    name: 'Lila Kaur',
    email: 'lila@example.com',
    phone: '+91-9876543233',
    digitalId: 'TID024',
    isVerified: true,
    currentLocation: {
      lat: 25.2050,
      lng: 92.0210,
      address: 'River Bridge, Dawki'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:15:00Z'
  },
  {
    id: '25',
    name: 'Vikas Thakur',
    email: 'vikas@example.com',
    phone: '+91-9876543234',
    digitalId: 'TID025',
    isVerified: true,
    currentLocation: {
      lat: 25.2060,
      lng: 92.0220,
      address: 'Dawki Forest Trail'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:10:00Z'
  },
  {
    id: '26',
    name: 'Pooja Yadav',
    email: 'pooja@example.com',
    phone: '+91-9876543235',
    digitalId: 'TID026',
    isVerified: true,
    currentLocation: {
      lat: 25.2070,
      lng: 92.0230,
      address: 'Umngot River Bank, Dawki'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T08:05:00Z'
  },
  // Group 5: Kaziranga National Park (5 tourists, mostly safe)
  {
    id: '27',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    phone: '+91-9876543236',
    digitalId: 'TID027',
    isVerified: true,
    currentLocation: {
      lat: 26.6745,
      lng: 93.2076,
      address: 'Kaziranga National Park Entrance'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T08:00:00Z'
  },
  {
    id: '28',
    name: 'Anita Rao',
    email: 'anita@example.com',
    phone: '+91-9876543237',
    digitalId: 'TID028',
    isVerified: true,
    currentLocation: {
      lat: 26.6750,
      lng: 93.2080,
      address: 'Jeep Safari Zone, Kaziranga'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:55:00Z'
  },
  {
    id: '29',
    name: 'Suresh Iyer',
    email: 'suresh@example.com',
    phone: '+91-9876543238',
    digitalId: 'TID029',
    isVerified: true,
    currentLocation: {
      lat: 26.6760,
      lng: 93.2090,
      address: 'Rhino Viewing Area, Kaziranga'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T07:50:00Z'
  },
  {
    id: '30',
    name: 'Kavya Nair',
    email: 'kavya@example.com',
    phone: '+91-9876543239',
    digitalId: 'TID030',
    isVerified: true,
    currentLocation: {
      lat: 26.6770,
      lng: 93.2100,
      address: 'Elephant Safari Point, Kaziranga'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:45:00Z'
  },
  {
    id: '31',
    name: 'Nikhil Das',
    email: 'nikhil@example.com',
    phone: '+91-9876543240',
    digitalId: 'TID031',
    isVerified: true,
    currentLocation: {
      lat: 26.6780,
      lng: 93.2110,
      address: 'Bird Watching Tower, Kaziranga'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:40:00Z'
  },
  // Group 6: Majuli Island (5 tourists, emergency heavy)
  {
    id: '32',
    name: 'Deepa Malhotra',
    email: 'deepa@example.com',
    phone: '+91-9876543241',
    digitalId: 'TID032',
    isVerified: true,
    currentLocation: {
      lat: 26.9500,
      lng: 94.1167,
      address: 'Satra Monastery, Majuli'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'emergency',
    lastActive: '2024-01-08T07:35:00Z'
  },
  {
    id: '33',
    name: 'Gaurav Kapoor',
    email: 'gaurav@example.com',
    phone: '+91-9876543242',
    digitalId: 'TID033',
    isVerified: true,
    currentLocation: {
      lat: 26.9510,
      lng: 94.1170,
      address: 'Brahmaputra River Bank, Majuli'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T07:30:00Z'
  },
  {
    id: '34',
    name: 'Tara Bose',
    email: 'tara@example.com',
    phone: '+91-9876543243',
    digitalId: 'TID034',
    isVerified: true,
    currentLocation: {
      lat: 26.9520,
      lng: 94.1180,
      address: 'Cultural Village, Majuli'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'emergency',
    lastActive: '2024-01-08T07:25:00Z'
  },
  {
    id: '35',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543244',
    digitalId: 'TID035',
    isVerified: true,
    currentLocation: {
      lat: 26.9530,
      lng: 94.1190,
      address: 'Ferry Ghat, Majuli'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:20:00Z'
  },
  {
    id: '36',
    name: 'Sonal Gupta',
    email: 'sonal@example.com',
    phone: '+91-9876543245',
    digitalId: 'TID036',
    isVerified: true,
    currentLocation: {
      lat: 26.9540,
      lng: 94.1200,
      address: 'Island Trail, Majuli'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'emergency',
    lastActive: '2024-01-08T07:15:00Z'
  },
  // Group 7: Tawang Monastery (5 tourists, safe)
  {
    id: '37',
    name: 'Aarav Singh',
    email: 'aarav@example.com',
    phone: '+91-9876543246',
    digitalId: 'TID037',
    isVerified: true,
    currentLocation: {
      lat: 27.5853,
      lng: 91.8665,
      address: 'Tawang Monastery'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:10:00Z'
  },
  {
    id: '38',
    name: 'Kiara Khan',
    email: 'kiara@example.com',
    phone: '+91-9876543247',
    digitalId: 'TID038',
    isVerified: true,
    currentLocation: {
      lat: 27.5860,
      lng: 91.8670,
      address: 'Tawang Market'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:05:00Z'
  },
  {
    id: '39',
    name: 'Yash Patel',
    email: 'yash@example.com',
    phone: '+91-9876543248',
    digitalId: 'TID039',
    isVerified: true,
    currentLocation: {
      lat: 27.5870,
      lng: 91.8680,
      address: 'Sela Pass View, Tawang'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T07:00:00Z'
  },
  {
    id: '40',
    name: 'Mira Joshi',
    email: 'mira@example.com',
    phone: '+91-9876543249',
    digitalId: 'TID040',
    isVerified: true,
    currentLocation: {
      lat: 27.5880,
      lng: 91.8690,
      address: 'Tawang Lake'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:55:00Z'
  },
  {
    id: '41',
    name: 'Karan Dubey',
    email: 'karan@example.com',
    phone: '+91-9876543250',
    digitalId: 'TID041',
    isVerified: true,
    currentLocation: {
      lat: 27.5890,
      lng: 91.8700,
      address: 'Madhuri Lake, Tawang'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:50:00Z'
  },
  // Group 8: Ziro Valley (5 tourists, alert heavy)
  {
    id: '42',
    name: 'Naina Roy',
    email: 'naina@example.com',
    phone: '+91-9876543251',
    digitalId: 'TID042',
    isVerified: true,
    currentLocation: {
      lat: 27.5880,
      lng: 93.8351,
      address: 'Ziro Valley Rice Fields'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T06:45:00Z'
  },
  {
    id: '43',
    name: 'Siddharth Verma',
    email: 'siddharth@example.com',
    phone: '+91-9876543252',
    digitalId: 'TID043',
    isVerified: true,
    currentLocation: {
      lat: 27.5890,
      lng: 93.8360,
      address: 'Apatani Village, Ziro'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T06:40:00Z'
  },
  {
    id: '44',
    name: 'Rhea Das',
    email: 'rhea@example.com',
    phone: '+91-9876543253',
    digitalId: 'TID044',
    isVerified: true,
    currentLocation: {
      lat: 27.5900,
      lng: 93.8370,
      address: 'Ziro Music Festival Site'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:35:00Z'
  },
  {
    id: '45',
    name: 'Aryan Khan',
    email: 'aryan@example.com',
    phone: '+91-9876543254',
    digitalId: 'TID045',
    isVerified: true,
    currentLocation: {
      lat: 27.5910,
      lng: 93.8380,
      address: 'Talley Valley, Ziro'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T06:30:00Z'
  },
  {
    id: '46',
    name: 'Saanvi Sharma',
    email: 'saanvi@example.com',
    phone: '+91-9876543255',
    digitalId: 'TID046',
    isVerified: true,
    currentLocation: {
      lat: 27.5920,
      lng: 93.8390,
      address: 'Ziro Wildlife Sanctuary'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'alert',
    lastActive: '2024-01-08T06:25:00Z'
  },
  // Group 9: Namdapha National Park (5 tourists, safe)
  {
    id: '47',
    name: 'Dev Sharma',
    email: 'dev@example.com',
    phone: '+91-9876543256',
    digitalId: 'TID047',
    isVerified: true,
    currentLocation: {
      lat: 27.4600,
      lng: 95.5800,
      address: 'Namdapha Trekking Trail'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:20:00Z'
  },
  {
    id: '48',
    name: 'Isha Malik',
    email: 'isha@example.com',
    phone: '+91-9876543257',
    digitalId: 'TID048',
    isVerified: true,
    currentLocation: {
      lat: 27.4610,
      lng: 95.5810,
      address: 'Tiger Reserve Zone, Namdapha'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:15:00Z'
  },
  {
    id: '49',
    name: 'Ravi Chawla',
    email: 'ravi@example.com',
    phone: '+91-9876543258',
    digitalId: 'TID049',
    isVerified: true,
    currentLocation: {
      lat: 27.4620,
      lng: 95.5820,
      address: 'Snow Leopard Viewing, Namdapha'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:10:00Z'
  },
  {
    id: '50',
    name: 'Tanya Sethi',
    email: 'tanya@example.com',
    phone: '+91-9876543259',
    digitalId: 'TID050',
    isVerified: true,
    currentLocation: {
      lat: 27.4630,
      lng: 95.5830,
      address: 'Biodiversity Hotspot, Namdapha'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T06:05:00Z'
  }
];

const MapDashboard: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [tourists] = useState<Tourist[]>(mockTourists);

  const handleTouristSelect = (tourist: Tourist) => {
    setSelectedTourist(tourist);
  };

  const safeCount = tourists.filter(t => t.status === 'safe').length;
  const alertCount = tourists.filter(t => t.status === 'alert').length;
  const emergencyCount = tourists.filter(t => t.status === 'emergency').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Authority Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time tourist monitoring</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthorityPage('alerts')}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{safeCount}</p>
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{alertCount}</p>
                <p className="text-xs text-muted-foreground">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-emergency" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emergency">{emergencyCount}</p>
                <p className="text-xs text-muted-foreground">Emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{tourists.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Tourist Details */}
      <div className="p-4 grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Live Tourist Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[420px]">
              <MapView
                mode="authority"
                tourists={tourists}
                onTouristSelect={handleTouristSelect}
                showPanicButton={false}
                className="w-full h-full rounded-b-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tourist Details */}
        <div className="space-y-4">
          {selectedTourist ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tourist Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTourist.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedTourist.digitalId}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={
                    selectedTourist.status === 'safe' ? 'default' :
                    selectedTourist.status === 'alert' ? 'secondary' : 'destructive'
                  }>
                    {selectedTourist.status.toUpperCase()}
                  </Badge>
                  {selectedTourist.isVerified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{selectedTourist.phone}</p>
                  </div>
                  
                  {selectedTourist.currentLocation && (
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTourist.currentLocation.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTourist.currentLocation.lat.toFixed(4)}, {selectedTourist.currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTourist.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Tourist
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a Tourist</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a tourist marker on the map to view their details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('verification')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Tourist IDs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('efir')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                File E-FIR
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('analytics')}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;