import marutiLogo from '../assets/Maruti Suzuki Logo.png';
import hyundaiLogo from '../assets/Hyundai Blue Emblem Logo.png';
import tataLogo from '../assets/TATA Blue Logo on Transparent Background.png';
import mahindraLogo from '../assets/Mahindra Red Emblem Logo.png';
import toyotaLogo from '../assets/Toyota Red Emblem and Wordmark.png';

export const initialBrandsList = [
  {
    id: 1,
    name: 'Maruti Suzuki',
    image: marutiLogo,
    models: 12,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Hyundai',
    image: hyundaiLogo,
    models: 9,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tata',
    image: tataLogo,
    models: 8,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Mahindra',
    image: mahindraLogo,
    models: 7,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Toyota',
    image: toyotaLogo,
    models: 6,
    status: 'Active',
  },
];

export const initialModelsList = [
  {
    id: 1,
    name: 'Swift',
    brand: 'Maruti Suzuki',
    vehicleType: 'Hatchback',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Baleno',
    brand: 'Maruti Suzuki',
    vehicleType: 'Hatchback',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dzire',
    brand: 'Maruti Suzuki',
    vehicleType: 'Sedan',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Creta',
    brand: 'Hyundai',
    vehicleType: 'SUV',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 5,
    name: 'i20',
    brand: 'Hyundai',
    vehicleType: 'Hatchback',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Nexon',
    brand: 'Tata',
    vehicleType: 'Compact SUV',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Harrier',
    brand: 'Tata',
    vehicleType: 'SUV',
    capacity: 5,
    seatCapacity: 5,
    status: 'Active',
  },
  {
    id: 8,
    name: 'Scorpio-N',
    brand: 'Mahindra',
    vehicleType: 'SUV',
    capacity: 7,
    seatCapacity: 7,
    status: 'Active',
  },
  {
    id: 9,
    name: 'Innova Crysta',
    brand: 'Toyota',
    vehicleType: 'MUV / MPV',
    capacity: 8,
    seatCapacity: 8,
    status: 'Active',
  },
  {
    id: 10,
    name: 'BharatBenz Coach 45',
    brand: 'BharatBenz',
    vehicleType: 'Commercial Bus',
    capacity: 45,
    seatCapacity: 45,
    status: 'Active',
  },
];

export const initialColorsList = [
  {
    id: 1,
    name: 'Pure White',
    hex: '#FFFFFF',
    vehiclesCount: 42,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Metallic Silver',
    hex: '#C0C0C0',
    vehiclesCount: 28,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Granite Grey',
    hex: '#4B5563',
    vehiclesCount: 19,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Midnight Black',
    hex: '#111827',
    vehiclesCount: 24,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Blazing Red',
    hex: '#DC2626',
    vehiclesCount: 12,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Royal Blue',
    hex: '#2563EB',
    vehiclesCount: 15,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Golden Yellow',
    hex: '#FED011',
    vehiclesCount: 8,
    status: 'Active',
  },
];

export const initialSeatTypesList = [
  {
    id: 1,
    name: '1A',
    status: 'Active',
  },
  {
    id: 2,
    name: '1B',
    status: 'Active',
  },
  {
    id: 3,
    name: '2A',
    status: 'Active',
  },
  {
    id: 4,
    name: '5D',
    status: 'Active',
  },
];


