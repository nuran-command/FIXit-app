import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ActiveOrder,
  ClientProfile,
  DEFAULT_CLIENT,
  FIXED_SERVICES,
  INITIAL_PRO_PROFILE,
  ProProfile,
  RoleMode,
  ScreenStep,
  ServiceItem,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  text: string;
}

interface OrderContextValue {
  isLoggedIn: boolean;
  role: RoleMode;
  currentStep: ScreenStep;

  clientProfile: ClientProfile;
  clientPhone: string;
  clientAddress: string;
  setClientPhone: (phone: string) => void;
  setClientAddress: (address: string) => void;

  proProfile: ProProfile;
  isProOnline: boolean;
  setIsProOnline: (online: boolean) => void;

  loginWithRole: (selectedRole: RoleMode, phone?: string) => void;
  logout: () => void;
  navigateToStep: (step: ScreenStep) => void;

  selectedService: ServiceItem;
  selectServiceForBooking: (service: ServiceItem) => void;
  activeOrder: ActiveOrder | null;
  createAndDispatchOrder: (params: {
    description: string;
    photoUri: string | null;
    usedSamplePhoto: boolean;
    customService?: ServiceItem;
  }) => void;

  acceptIncomingJob: () => void;
  declineIncomingJob: () => void;
  proArrivedAtClient: () => void;
  completeOrderToPayment: () => void;
  confirmKaspiPayment: () => void;
  submitReview: (rating: number, tags: string[], comment: string) => void;
  simulateIncomingOrder: () => void;

  toast: ToastMessage | null;
  showToast: (text: string) => void;
  dismissToast: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<RoleMode>('CLIENT');
  const [currentStep, setCurrentStep] = useState<ScreenStep>('LOGIN');

  const [clientProfile] = useState<ClientProfile>(DEFAULT_CLIENT);
  const [clientPhone, setClientPhone] = useState<string>(DEFAULT_CLIENT.phone);
  const [clientAddress, setClientAddress] = useState<string>(DEFAULT_CLIENT.defaultAddress);

  const [proProfile, setProProfile] = useState<ProProfile>(INITIAL_PRO_PROFILE);
  const [isProOnline, setIsProOnline] = useState<boolean>(true);

  const [selectedService, setSelectedService] = useState<ServiceItem>(FIXED_SERVICES[0]);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string) => {
    const id = String(Date.now());
    setToast({ id, text });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const buildOrder = useCallback(
    (status: ActiveOrder['status'], serviceOverride?: ServiceItem): ActiveOrder => {
      const srv = serviceOverride || selectedService || FIXED_SERVICES[0];
      return {
        orderId: '#FX-2048',
        service: srv,
        clientName: clientProfile.name,
        clientPhone: clientPhone,
        address: clientAddress || DEFAULT_CLIENT.defaultAddress,
        issueDescription: 'Water dripping under kitchen sink when cold valve is open.',
        photoUri: null,
        usedSamplePhoto: true,
        status,
        distanceKm: status === 'ARRIVED' ? 0 : 1.4,
        etaMinutes: status === 'ARRIVED' ? 0 : 5,
        routeProgress: status === 'ARRIVED' ? 1 : 0.08,
      };
    },
    [selectedService, clientProfile.name, clientPhone, clientAddress]
  );

  // Smooth 1-second route progression when technician is EN_ROUTE
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'EN_ROUTE') return;

    const interval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev || prev.status !== 'EN_ROUTE') return prev;
        const nextProgress = Math.min(1, Number((prev.routeProgress + 0.16).toFixed(2)));
        const remainingRatio = Math.max(0, 1 - nextProgress);
        const nextDistance = Number((1.4 * remainingRatio).toFixed(1));
        const nextEta = Math.max(0, Math.ceil(5 * remainingRatio));

        if (nextProgress >= 1) {
          return {
            ...prev,
            routeProgress: 1,
            distanceKm: 0,
            etaMinutes: 0,
            status: 'ARRIVED',
          };
        }

        return {
          ...prev,
          routeProgress: nextProgress,
          distanceKm: nextDistance,
          etaMinutes: nextEta,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  const loginWithRole = useCallback((selectedRole: RoleMode, phone?: string) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
    if (phone) {
      setClientPhone(phone);
    }
    setCurrentStep(selectedRole === 'PRO' ? 'PRO_DASHBOARD' : 'HOME');
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentStep('LOGIN');
    showToast('Signed out successfully');
  }, [showToast]);

  const selectServiceForBooking = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setCurrentStep('BOOKING');
  }, []);

  const createAndDispatchOrder = useCallback(
    ({
      description,
      photoUri,
      usedSamplePhoto,
      customService,
    }: {
      description: string;
      photoUri: string | null;
      usedSamplePhoto: boolean;
      customService?: ServiceItem;
    }) => {
      const targetService = customService || selectedService;
      if (customService) {
        setSelectedService(customService);
      }
      const newOrder: ActiveOrder = {
        orderId: '#FX-2048',
        service: targetService,
        clientName: clientProfile.name,
        clientPhone: clientPhone,
        address: clientAddress,
        issueDescription:
          description.trim() || `${targetService.title} at ${clientAddress}`,
        photoUri,
        usedSamplePhoto,
        status: 'DISPATCHING',
        distanceKm: 1.4,
        etaMinutes: 5,
        routeProgress: 0,
      };
      setActiveOrder(newOrder);

      // In real-world Client app, the client stays in client flow and goes to tracking
      if (role === 'CLIENT') {
        setCurrentStep('TRACKING');
        showToast('Technician request sent');
      } else {
        setCurrentStep('PRO_DASHBOARD');
      }
    },
    [selectedService, clientProfile.name, clientPhone, clientAddress, role, showToast]
  );

  const acceptIncomingJob = useCallback(() => {
    setActiveOrder((prev) => {
      const base = prev || buildOrder('DISPATCHING');
      return {
        ...base,
        status: 'EN_ROUTE',
        distanceKm: 1.4,
        etaMinutes: 5,
        routeProgress: 0.08,
      };
    });
    showToast('Job accepted · En route to client');
  }, [buildOrder, showToast]);

  const declineIncomingJob = useCallback(() => {
    setActiveOrder(null);
    showToast('Request declined');
  }, [showToast]);

  const proArrivedAtClient = useCallback(() => {
    setActiveOrder((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'ARRIVED',
        distanceKm: 0,
        etaMinutes: 0,
        routeProgress: 1,
      };
    });
    showToast('Marked as arrived at client location');
  }, [showToast]);

  const completeOrderToPayment = useCallback(() => {
    setActiveOrder((prev) => {
      const base = prev || buildOrder('ARRIVED');
      return {
        ...base,
        routeProgress: 1,
        distanceKm: 0,
        etaMinutes: 0,
        status: 'COMPLETED_UNPAID',
      };
    });
    if (role === 'CLIENT') {
      setCurrentStep('PAYMENT');
    }
    showToast('Repair completed · Kaspi QR ready');
  }, [buildOrder, role, showToast]);

  const confirmKaspiPayment = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setActiveOrder((prev) => {
      const base = prev || buildOrder('COMPLETED_UNPAID');
      return {
        ...base,
        status: 'PAID',
        paidAt: timeStr,
      };
    });
    setProProfile((prev) => ({
      ...prev,
      earningsToday: prev.earningsToday + (activeOrder?.service.priceKzt || 8500),
      completedToday: prev.completedToday + 1,
    }));
    showToast('Payment confirmed via Kaspi QR');
  }, [activeOrder?.service.priceKzt, buildOrder, showToast]);

  const submitReview = useCallback(
    (rating: number, tags: string[], comment: string) => {
      setProProfile((prev) => ({
        ...prev,
        rating: 4.92,
        verifiedJobs: prev.verifiedJobs + 1,
      }));
      setActiveOrder(null);
      setCurrentStep('HOME');
      showToast('Thank you for your feedback');
    },
    [showToast]
  );

  const simulateIncomingOrder = useCallback(() => {
    const order = buildOrder('DISPATCHING', FIXED_SERVICES[0]);
    setActiveOrder(order);
    showToast('Incoming job alert nearby!');
  }, [buildOrder, showToast]);

  const navigateToStep = useCallback((step: ScreenStep) => {
    setCurrentStep(step);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        isLoggedIn,
        role,
        currentStep,
        clientProfile,
        clientPhone,
        clientAddress,
        setClientPhone,
        setClientAddress,
        proProfile,
        isProOnline,
        setIsProOnline,
        loginWithRole,
        logout,
        navigateToStep,
        selectedService,
        selectServiceForBooking,
        activeOrder,
        createAndDispatchOrder,
        acceptIncomingJob,
        declineIncomingJob,
        proArrivedAtClient,
        completeOrderToPayment,
        confirmKaspiPayment,
        submitReview,
        simulateIncomingOrder,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextValue => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return ctx;
};
