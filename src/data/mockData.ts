export type ServiceCategory = 'All' | 'Plumbing' | 'Electrical' | 'Appliances';

export type CustomCategory = Exclude<ServiceCategory, 'All'> | 'Other';

export type RoleMode = 'CLIENT' | 'PRO';

export type ScreenStep =
  | 'LOGIN'
  | 'HOME'
  | 'BOOKING'
  | 'CUSTOM_REQUEST'
  | 'PRO_DASHBOARD'
  | 'TRACKING'
  | 'PAYMENT'
  | 'REVIEW';

export type OrderStatus =
  | 'IDLE'
  | 'DISPATCHING'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'COMPLETED_UNPAID'
  | 'PAID'
  | 'REVIEWED';

export interface ServiceItem {
  id: string;
  title: string;
  category: CustomCategory;
  priceKzt: number;
  etaMinutes: number;
  subtitle: string;
}

export interface ProProfile {
  name: string;
  fullName: string;
  title: string;
  rating: number;
  verifiedJobs: number;
  vehicleInfo: string;
  phone: string;
  district: string;
  experienceYears: number;
  earningsToday: number;
  completedToday: number;
}

export interface ClientProfile {
  name: string;
  fullName: string;
  phone: string;
  defaultAddress: string;
  district: string;
  memberSince: string;
}

export interface ActiveOrder {
  orderId: string;
  service: ServiceItem;
  clientName: string;
  clientPhone: string;
  address: string;
  issueDescription: string;
  photoUri: string | null;
  usedSamplePhoto: boolean;
  status: OrderStatus;
  distanceKm: number;
  etaMinutes: number;
  routeProgress: number; // 0 to 1
  paidAt?: string;
  rating?: number;
  reviewTags?: string[];
  reviewComment?: string;
}

export const COLORS = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  divider: '#F1F5F9',
  border: '#E2E8F0',
  primary: '#0F172A',
  ink: '#0F172A',
  secondaryText: '#64748B',
  mutedText: '#94A3B8',
  emerald: '#10B981',
  emeraldSurface: '#ECFDF5',
  kaspiRed: '#F14635',
  amber: '#F59E0B',
  white: '#FFFFFF',
};

export const ASTANA_ADDRESSES = [
  'Mangilik El 55, Apt 42',
  'Kabanbay Batyr 11, Apt 18',
  'Turan Ave 37, Apt 90',
];

export const DEFAULT_CLIENT: ClientProfile = {
  name: 'Aidana',
  fullName: 'Aidana Kassymova',
  phone: '+7 701 555 0192',
  defaultAddress: ASTANA_ADDRESSES[0],
  district: 'Yesil District, Astana',
  memberSince: '2024',
};

export const INITIAL_PRO_PROFILE: ProProfile = {
  name: 'Marat',
  fullName: 'Marat Zhakupov',
  title: 'Master Plumber & Electrician',
  rating: 4.9,
  verifiedJobs: 127,
  vehicleInfo: 'VW Caddy · 01 777 AST',
  phone: '+7 702 884 1920',
  district: 'Yesil District, Astana',
  experienceYears: 14,
  earningsToday: 32500,
  completedToday: 4,
};

export const FIXED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-faucet-leak',
    title: 'Kitchen Faucet Leak',
    category: 'Plumbing',
    priceKzt: 8500,
    etaMinutes: 15,
    subtitle: 'Faucet, cartridge, or hose repair · ~15 min arrival',
  },
  {
    id: 'srv-pipe-burst',
    title: 'Pipe Burst Repair',
    category: 'Plumbing',
    priceKzt: 14000,
    etaMinutes: 10,
    subtitle: 'Rapid shutoff and pipe sealing · ~10 min arrival',
  },
  {
    id: 'srv-short-circuit',
    title: 'Short Circuit & Breaker Fix',
    category: 'Electrical',
    priceKzt: 11000,
    etaMinutes: 12,
    subtitle: 'Panel diagnostics and breaker replacement · ~12 min arrival',
  },
  {
    id: 'srv-socket-switch',
    title: 'Socket & Switch Replacement',
    category: 'Electrical',
    priceKzt: 6500,
    etaMinutes: 18,
    subtitle: 'Wall outlet or dimmer installation · ~18 min arrival',
  },
  {
    id: 'srv-washer-drain',
    title: 'Washing Machine Drain Fix',
    category: 'Appliances',
    priceKzt: 9500,
    etaMinutes: 20,
    subtitle: 'Filter cleaning and drain pump check · ~20 min arrival',
  },
  {
    id: 'srv-dishwasher-install',
    title: 'Dishwasher Hookup & Seal',
    category: 'Appliances',
    priceKzt: 10500,
    etaMinutes: 25,
    subtitle: 'Water line connection and leak test · ~25 min arrival',
  },
];

export const PRO_RECENT_JOBS = [
  {
    id: 'job-1',
    title: 'Kitchen Faucet Leak',
    payoutKzt: 8500,
    client: 'Saule M.',
    address: 'Kabanbay Batyr 19',
    time: 'Today, 11:30 AM',
    paymentType: 'Kaspi QR',
  },
  {
    id: 'job-2',
    title: 'Socket & Switch Replacement',
    payoutKzt: 6500,
    client: 'Daniyar T.',
    address: 'Mangilik El 38',
    time: 'Today, 09:15 AM',
    paymentType: 'Kaspi QR',
  },
  {
    id: 'job-3',
    title: 'Pipe Burst Emergency',
    payoutKzt: 14000,
    client: 'Berik K.',
    address: 'Turan Ave 22',
    time: 'Yesterday',
    paymentType: 'Kaspi QR',
  },
];

export const REVIEW_QUICK_TAGS = ['On time', 'Fixed price', 'Clean work'];

export function formatKzt(amount: number): string {
  return `${amount.toLocaleString('en-US')} ₸`;
}
