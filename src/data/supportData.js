export const supportSummary = {
  totalTickets: '1,248',
  totalLabel: 'Total Tickets',
  open: '286',
  openLabel: 'Open',
  inProgress: '193',
  inProgressLabel: 'In Progress',
  resolved: '712',
  resolvedLabel: 'Resolved',
  closed: '57',
  closedLabel: 'Closed'
};

export const complaintsList = [
  {
    id: 'SC12546',
    numericId: 1,
    user: {
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      email: 'rohit.kumar@gmail.com',
      phone: '+91 98765 43210'
    },
    userType: 'Passenger',
    ticketId: '#SC12546',
    category: 'Ride Issue',
    categoryIcon: 'car',
    subject: 'Driver was late and did not follow the correct route',
    shortSubject: 'Driver was late and...',
    description: 'My pickup was delayed by around 20 minutes, and the driver also took a longer route than shown in the app, which increased the fare. Please look into this and take appropriate action.',
    relatedRide: {
      rideId: 'SC856421',
      date: '02 Nov 2026',
      time: '11:24 AM',
      route: 'Patna → Danapur',
      fare: '₹ 248.00'
    },
    attachments: [
      {
        id: 1,
        name: 'route_screenshot.jpg',
        size: '512 KB',
        type: 'map',
        preview: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 2,
        name: 'fare_details.jpg',
        size: '358 KB',
        type: 'receipt',
        preview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80'
      }
    ],
    ticketStatus: 'Open',
    createdOn: '02 Nov 2026, 11:24 AM',
    createdDate: '02 Nov 2026',
    createdTime: '11:24 AM',
    lastUpdated: '02 Nov 2026, 11:24 AM',
    priority: 'Medium',
    timeline: [
      {
        id: 1,
        title: 'Complaint Created',
        description: 'Ticket #SC12546 created by Rohit Kumar.',
        date: '02 Nov 2026',
        time: '11:24 AM',
        color: 'yellow' // Yellow dot
      },
      {
        id: 2,
        title: 'Assigned to Support',
        description: 'Ticket assigned to support team.',
        date: '02 Nov 2026',
        time: '11:32 AM',
        color: 'blue' // Blue dot
      },
      {
        id: 3,
        title: 'Pending for Resolution',
        description: 'Awaiting admin action.',
        date: '02 Nov 2026',
        time: '11:32 AM',
        color: 'gray' // Gray dot
      }
    ]
  },
  {
    id: 'SC12545',
    numericId: 2,
    user: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      email: 'priya.sharma@gmail.com',
      phone: '+91 98765 12345'
    },
    userType: 'Driver',
    ticketId: '#SC12545',
    category: 'Payment',
    categoryIcon: 'payment',
    subject: 'Payment not received in wallet after ride',
    shortSubject: 'Payment not received...',
    description: 'Payment not received in wallet after completing ride SC856379. Cash settlement is pending from passenger.',
    relatedRide: {
      rideId: 'SC856379',
      date: '02 Nov 2026',
      time: '10:18 AM',
      route: 'Kankarbagh → AIIMS Patna',
      fare: '₹ 340.00'
    },
    attachments: [
      {
        id: 1,
        name: 'payment_slip.jpg',
        size: '420 KB',
        type: 'receipt',
        preview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80'
      }
    ],
    ticketStatus: 'In Progress',
    createdOn: '02 Nov 2026, 10:18 AM',
    createdDate: '02 Nov 2026',
    createdTime: '10:18 AM',
    lastUpdated: '02 Nov 2026, 11:00 AM',
    priority: 'High',
    timeline: [
      {
        id: 1,
        title: 'Complaint Created',
        description: 'Ticket #SC12545 created by Priya Sharma.',
        date: '02 Nov 2026',
        time: '10:18 AM',
        color: 'yellow'
      },
      {
        id: 2,
        title: 'Assigned to Finance',
        description: 'Assigned to finance verification desk.',
        date: '02 Nov 2026',
        time: '10:45 AM',
        color: 'blue'
      }
    ]
  },
  {
    id: 'SC12544',
    numericId: 3,
    user: {
      name: 'Amit Verma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      email: 'amit.verma@gmail.com',
      phone: '+91 98123 45678'
    },
    userType: 'Passenger',
    ticketId: '#SC12544',
    category: 'Safety',
    categoryIcon: 'safety',
    subject: 'Driver was not following safety rules and overspeeding',
    shortSubject: 'Driver was not following...',
    description: 'Driver was rash driving and overspeeding beyond 95 km/h on highway. Felt very unsafe.',
    relatedRide: {
      rideId: 'SC856215',
      date: '01 Nov 2026',
      time: '08:47 PM',
      route: 'Boring Road → Airport',
      fare: '₹ 180.00'
    },
    attachments: [],
    ticketStatus: 'Resolved',
    createdOn: '01 Nov 2026, 08:47 PM',
    createdDate: '01 Nov 2026',
    createdTime: '08:47 PM',
    lastUpdated: '02 Nov 2026, 09:30 AM',
    priority: 'High',
    timeline: [
      {
        id: 1,
        title: 'Complaint Created',
        description: 'Ticket created by passenger Amit Verma.',
        date: '01 Nov 2026',
        time: '08:47 PM',
        color: 'yellow'
      },
      {
        id: 2,
        title: 'Driver Warned',
        description: 'Safety team investigated telemetry and warned driver.',
        date: '02 Nov 2026',
        time: '09:30 AM',
        color: 'blue'
      },
      {
        id: 3,
        title: 'Resolved',
        description: 'Issue marked resolved and apology credit issued.',
        date: '02 Nov 2026',
        time: '10:00 AM',
        color: 'green'
      }
    ]
  }
];
