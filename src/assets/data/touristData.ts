import { Tourist } from "../../types/index";

export const touristsData: Tourist[] = [
  // Group 1: Shillong Central (5 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T10:30:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T10:25:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T10:20:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T10:15:00Z',
    resolvedAt: '2025-09-26T09:00:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T10:10:00Z'
  },
  // Group 2: Cherrapunji Area (6 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T09:45:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T09:40:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T09:35:00Z'
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
    lastActive: '2025-09-26T09:30:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T09:25:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T09:20:00Z',
    resolvedAt: '2025-09-26T08:00:00Z'
  },
  // Group 3: Mawlynnong Village (7 tourists)
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
    status: 'active alerts',
    lastActive: '2025-09-26T09:15:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T09:10:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T09:05:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T09:00:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T08:55:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T08:50:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T08:45:00Z',
    resolvedAt: '2025-09-26T07:30:00Z'
  },
  // Group 4: Dawki River Area (8 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T08:40:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T08:35:00Z'
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
    lastActive: '2025-09-26T08:30:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T08:25:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T08:20:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T08:15:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T08:10:00Z',
    resolvedAt: '2025-09-26T07:00:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T08:05:00Z'
  },
  // Group 5: Kaziranga National Park (5 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T08:00:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T07:55:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T07:50:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T07:45:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T07:40:00Z',
    resolvedAt: '2025-09-26T06:30:00Z'
  },
  // Group 6: Majuli Island (5 tourists)
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
    lastActive: '2025-09-26T07:35:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T07:30:00Z'
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
    lastActive: '2025-09-26T07:25:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T07:20:00Z'
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
    lastActive: '2025-09-26T07:15:00Z'
  },
  // Group 7: Tawang Monastery (5 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T07:10:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T07:05:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T07:00:00Z',
    resolvedAt: '2025-09-26T06:00:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T06:55:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T06:50:00Z'
  },
  // Group 8: Ziro Valley (5 tourists)
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
    status: 'active alerts',
    lastActive: '2025-09-26T06:45:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T06:40:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T06:35:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T06:30:00Z'
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
    status: 'active alerts',
    lastActive: '2025-09-26T06:25:00Z'
  },
  // Group 9: Namdapha National Park (5 tourists)
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
    status: 'active now',
    lastActive: '2025-09-26T06:20:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T06:15:00Z'
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
    status: 'resolved today',
    lastActive: '2025-09-26T06:10:00Z',
    resolvedAt: '2025-09-26T05:30:00Z'
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
    status: 'active now',
    lastActive: '2025-09-26T06:05:00Z'
  }
];