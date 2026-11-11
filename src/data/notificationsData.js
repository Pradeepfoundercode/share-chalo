export const notificationsSummary = {
  totalNotifications: '2,460',
  sent: '2,214',
  scheduled: '186',
  failed: '60'
};

export const notificationsList = [
  {
    id: 'NTF12546',
    numericId: 1,
    title: 'Diwali Special Offer',
    iconType: 'megaphone',
    message: 'Get 20% off on your next 3 rides. Use code: DIWALI20...',
    fullMessage: 'Get 20% off on your next 3 rides. Use code: DIWALI20 and enjoy a safer, more affordable ride with Share Chalo. 🎉',
    recipient: 'All Users',
    recipientType: 'All Users',
    sentOn: '02 Nov 2026, 10:00 AM',
    createdOn: '02 Nov 2026, 09:58 AM',
    createdBy: 'Admin',
    date: '02 Nov 2026',
    time: '10:00 AM',
    status: 'Sent',
    totalRecipients: '2,214 Users',
    breakdown: {
      passengers: '1,652',
      drivers: '562'
    },
    deliverySummary: {
      sent: '2,214',
      delivered: '2,198',
      deliveredPercent: '99.3%',
      pending: '10',
      pendingPercent: '0.5%',
      failed: '6',
      failedPercent: '0.2%'
    },
    failedRecipients: [
      {
        id: 1,
        user: 'Rahul Verma',
        userType: 'Passenger',
        reason: 'Invalid FCM token'
      },
      {
        id: 2,
        user: 'Sandeep Yadav',
        userType: 'Driver',
        reason: 'App not installed'
      },
      {
        id: 3,
        user: 'Neha Singh',
        userType: 'Passenger',
        reason: 'Notifications disabled'
      }
    ]
  },
  {
    id: 'NTF12545',
    numericId: 2,
    title: 'Refer & Earn',
    iconType: 'gift',
    message: 'Refer Share Chalo to your friends and earn up to ₹200...',
    fullMessage: 'Refer Share Chalo to your friends and earn up to ₹200 reward in your platform wallet for every successful first ride.',
    recipient: 'Passengers',
    recipientType: 'Passengers',
    sentOn: '01 Nov 2026, 05:30 PM',
    createdOn: '01 Nov 2026, 05:25 PM',
    createdBy: 'Admin',
    date: '01 Nov 2026',
    time: '05:30 PM',
    status: 'Sent',
    totalRecipients: '1,450 Users',
    breakdown: {
      passengers: '1,450',
      drivers: '0'
    },
    deliverySummary: {
      sent: '1,450',
      delivered: '1,420',
      deliveredPercent: '97.9%',
      pending: '22',
      pendingPercent: '1.5%',
      failed: '8',
      failedPercent: '0.6%'
    },
    failedRecipients: [
      {
        id: 1,
        user: 'Rohit Raj',
        userType: 'Passenger',
        reason: 'Token expired'
      }
    ]
  },
  {
    id: 'NTF12544',
    numericId: 3,
    title: 'Driver Safety Update',
    iconType: 'car',
    message: 'Please follow the latest safety guidelines during rides...',
    fullMessage: 'Please follow the latest safety guidelines during rides. Maintain speed limits and ensure vehicle cleanliness before starting any trip.',
    recipient: 'Drivers',
    recipientType: 'Drivers',
    sentOn: '01 Nov 2026, 11:00 AM',
    createdOn: '01 Nov 2026, 10:45 AM',
    createdBy: 'Admin',
    date: '01 Nov 2026',
    time: '11:00 AM',
    status: 'Sent',
    totalRecipients: '562 Users',
    breakdown: {
      passengers: '0',
      drivers: '562'
    },
    deliverySummary: {
      sent: '562',
      delivered: '550',
      deliveredPercent: '97.8%',
      pending: '8',
      pendingPercent: '1.4%',
      failed: '4',
      failedPercent: '0.8%'
    },
    failedRecipients: []
  },
  {
    id: 'NTF12543',
    numericId: 4,
    title: 'App Maintenance',
    iconType: 'info',
    message: 'The app will be under maintenance on 03 Nov, 12:00 AM to 02:00 AM...',
    fullMessage: 'The app will be under scheduled maintenance on 03 Nov from 12:00 AM to 02:00 AM. In-app bookings and payments will be temporarily unavailable during this window.',
    recipient: 'All Users',
    recipientType: 'All Users',
    sentOn: '03 Nov 2026, 12:00 AM',
    createdOn: '02 Nov 2026, 04:00 PM',
    createdBy: 'Admin',
    date: '03 Nov 2026',
    time: '12:00 AM',
    status: 'Scheduled',
    totalRecipients: '2,214 Users',
    breakdown: {
      passengers: '1,652',
      drivers: '562'
    },
    deliverySummary: {
      sent: '0',
      delivered: '0',
      deliveredPercent: '0%',
      pending: '2,214',
      pendingPercent: '100%',
      failed: '0',
      failedPercent: '0%'
    },
    failedRecipients: []
  },
  {
    id: 'NTF12542',
    numericId: 5,
    title: 'Ride Discount',
    iconType: 'percent',
    message: 'Flat ₹50 off on 2 rides this weekend. Book now and save more...',
    fullMessage: 'Flat ₹50 off on 2 rides this weekend. Book your seats now on Patna, Danapur, or Bihta routes and save more with Share Chalo.',
    recipient: 'Passengers',
    recipientType: 'Passengers',
    sentOn: '31 Oct 2026, 06:15 PM',
    createdOn: '31 Oct 2026, 05:40 PM',
    createdBy: 'Admin',
    date: '31 Oct 2026',
    time: '06:15 PM',
    status: 'Sent',
    totalRecipients: '1,200 Users',
    breakdown: {
      passengers: '1,200',
      drivers: '0'
    },
    deliverySummary: {
      sent: '1,200',
      delivered: '1,180',
      deliveredPercent: '98.3%',
      pending: '15',
      pendingPercent: '1.2%',
      failed: '5',
      failedPercent: '0.5%'
    },
    failedRecipients: []
  },
  {
    id: 'NTF12541',
    numericId: 6,
    title: 'Safety Reminder',
    iconType: 'shield',
    message: 'For a safer ride, always verify the driver and vehicle details in the app...',
    fullMessage: 'For a safer ride, always verify the driver name, vehicle number, and seat details shown in your Share Chalo app before boarding.',
    recipient: 'All Users',
    recipientType: 'All Users',
    sentOn: '30 Oct 2026, 02:00 PM',
    createdOn: '30 Oct 2026, 01:30 PM',
    createdBy: 'Admin',
    date: '30 Oct 2026',
    time: '02:00 PM',
    status: 'Sent',
    totalRecipients: '2,214 Users',
    breakdown: {
      passengers: '1,652',
      drivers: '562'
    },
    deliverySummary: {
      sent: '2,214',
      delivered: '2,200',
      deliveredPercent: '99.4%',
      pending: '10',
      pendingPercent: '0.4%',
      failed: '4',
      failedPercent: '0.2%'
    },
    failedRecipients: []
  },
  {
    id: 'NTF12540',
    numericId: 7,
    title: 'Payment Issue Update',
    iconType: 'alert',
    message: 'Some users may face a delay in payment processing. We are working on it...',
    fullMessage: 'Some users may face a brief delay in UPI payment gateway processing. Our technical team is actively coordinating with bank servers to resolve it.',
    recipient: 'Drivers',
    recipientType: 'Drivers',
    sentOn: '28 Oct 2026, 09:30 AM',
    createdOn: '28 Oct 2026, 09:15 AM',
    createdBy: 'Admin',
    date: '28 Oct 2026',
    time: '09:30 AM',
    status: 'Failed',
    totalRecipients: '562 Users',
    breakdown: {
      passengers: '0',
      drivers: '562'
    },
    deliverySummary: {
      sent: '562',
      delivered: '120',
      deliveredPercent: '21.4%',
      pending: '0',
      pendingPercent: '0%',
      failed: '442',
      failedPercent: '78.6%'
    },
    failedRecipients: []
  }
];
