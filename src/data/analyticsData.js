export const analyticsSummary = {
  totalRides: '3,842',
  totalRidesChange: '+12.6%',
  totalBookings: '2,980',
  totalBookingsChange: '+11.3%',
  totalPassengers: '12,486',
  totalPassengersChange: '+8.9%',
  totalDrivers: '3,276',
  totalDriversChange: '+6.4%',
  totalRevenue: '₹ 8,42,360',
  totalRevenueChange: '+15.2%'
};

export const rideTrendDaily = [
  { date: '26 Oct', rides: 280 },
  { date: '27 Oct', rides: 440 },
  { date: '28 Oct', rides: 510 },
  { date: '29 Oct', rides: 600 },
  { date: '30 Oct', rides: 520 },
  { date: '31 Oct', rides: 670 },
  { date: '01 Nov', rides: 630 },
  { date: '02 Nov', rides: 842 }
];

export const rideStatusData = [
  { label: 'Completed', count: '2,976', percentage: '77.5%', color: '#16a34a' },
  { label: 'Ongoing', count: '268', percentage: '7.0%', color: '#f59e0b' },
  { label: 'Upcoming', count: '312', percentage: '8.1%', color: '#0284c7' },
  { label: 'Cancelled', count: '286', percentage: '7.4%', color: '#dc2626' }
];

export const revenueOverviewData = {
  totalFare: '₹ 8,42,360',
  platformCommission: '₹ 1,26,354',
  commissionRate: '(15%)',
  onlineCollection: '₹ 6,18,420',
  cashCollection: '₹ 2,23,940'
};

export const userOverviewData = {
  passengers: '12,486',
  passengersGrowth: '+8.9%',
  drivers: '3,276',
  driversGrowth: '+6.4%',
  activeUsers: '14,920',
  blockedUsers: '112'
};

export const topRoutesData = [
  { id: 1, route: 'Patna → Danapur', totalRides: 426, revenue: '₹ 92,180' },
  { id: 2, route: 'Patna → Bihta', totalRides: 318, revenue: '₹ 66,940' },
  { id: 3, route: 'Boring Road → Patna Jn', totalRides: 274, revenue: '₹ 58,620' },
  { id: 4, route: 'Danapur → Phulwari', totalRides: 208, revenue: '₹ 44,360' },
  { id: 5, route: 'Kankarbagh → AIIMS', totalRides: 186, revenue: '₹ 39,480' }
];

export const recentRidesAnalytics = [
  {
    id: 1,
    rideId: 'SC856421',
    passenger: {
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    },
    driver: {
      name: 'Amit Verma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
    },
    route: 'Patna → Danapur',
    fare: '₹ 248.00',
    status: 'Completed',
    dateTime: '02 Nov, 11:24 AM'
  },
  {
    id: 2,
    rideId: 'SC856379',
    passenger: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    driver: {
      name: 'Sandeep Yadav',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    route: 'Patna → Bihta',
    fare: '₹ 320.00',
    status: 'Ongoing',
    dateTime: '02 Nov, 10:18 AM'
  },
  {
    id: 3,
    rideId: 'SC856215',
    passenger: {
      name: 'Neha Singh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
    },
    driver: {
      name: 'Vikash Pandey',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    route: 'Boring Rd → Patna',
    fare: '₹ 196.00',
    status: 'Completed',
    dateTime: '01 Nov, 08:47 PM'
  },
  {
    id: 4,
    rideId: 'SC855876',
    passenger: {
      name: 'Kavita Mehta',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    driver: {
      name: 'Rakesh Singh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
    },
    route: 'Danapur → AIIMS',
    fare: '₹ 340.00',
    status: 'Cancelled',
    dateTime: '01 Nov, 02:47 PM'
  }
];

