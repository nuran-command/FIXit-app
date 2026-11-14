import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ActiveOrder,
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
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  setClientPhone: (phone: string) => void;
  setClientAddress: (address: string) => void;
  loginWithRole: (selectedRole: RoleMode) => void;

  role: RoleMode;
  currentStep: ScreenStep;
  switchRole: (newRole: RoleMode) => void;
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

  proProfile: ProProfile;
  acceptIncomingJob: () => void;
  declineIncomingJob: () => void;
  completeOrderToPayment: () => void;
  confirmKaspiPayment: () => void;
  submitReview: (rating: number, tags: string[], comment: string) => void;

  toast: ToastMessage | null;
  showToast: (text: string) => void;
  dismissToast: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [clientName] = useState<string>(DEFAULT_CLIENT.name);
  const [clientPhone, setClientPhone] = useState<string>(DEFAULT_CLIENT.phone);
  const [clientAddress, setClientAddress] = useState<string>(DEFAULT_CLIENT.defaultAddress);

  const [role, setRole] = useState<RoleMode>('CLIENT');
  const [currentStep, setCurrentStep] = useState<ScreenStep>('LOGIN');

  const [selectedService, setSelectedService] = useState<ServiceItem>(FIXED_SERVICES[0]);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [proProfile, setProProfile] = useState<ProProfile>(INITIAL_PRO_PROFILE);
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
        clientName: 'Aidana',
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
    [selectedService, clientAddress]
  );

  // If presenter switches to Pro mode with no active order, surface an incoming request after 2 seconds
  useEffect(() => {
    if (role !== 'PRO' || activeOrder) return;
    const timer = setTimeout(() => {
      setActiveOrder(buildOrder('DISPATCHING', FIXED_SERVICES[0]));
    }, 1800);
    return () => clearTimeout(timer);
  }, [role, activeOrder, buildOrder]);

  // Smooth 1-second route progression when technician is EN_ROUTE (~6 seconds total)
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

  const loginWithRole = useCallback((selectedRole: RoleMode) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
    setCurrentStep(selectedRole === 'PRO' ? 'PRO_DASHBOARD' : 'HOME');
  }, []);

  const selectServiceForBooking = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setRole('CLIENT');
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
        clientName: 'Aidana',
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
      // Switch seamlessly to Pro Mode so the presenter/user can accept the incoming request
      setRole('PRO');
      setCurrentStep('PRO_DASHBOARD');
    },
    [selectedService, clientAddress]
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
    setRole('CLIENT');
    setCurrentStep('TRACKING');
  }, [buildOrder]);

  const declineIncomingJob = useCallback(() => {
    setActiveOrder(null);
    showToast('Request declined');
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
    setRole('CLIENT');
    setCurrentStep('PAYMENT');
  }, [buildOrder]);

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
  }, [buildOrder]);

  const submitReview = useCallback(
    (rating: number, tags: string[], comment: string) => {
      setProProfile((prev) => ({
        ...prev,
        rating: 4.92,
        verifiedJobs: prev.verifiedJobs + 1,
      }));
      setActiveOrder(null);
      setRole('CLIENT');
      setCurrentStep('HOME');
      showToast('Thank you for your feedback');
    },
    [showToast]
  );

  const switchRole = useCallback(
    (newRole: RoleMode) => {
      setRole(newRole);
      if (newRole === 'PRO') {
        setCurrentStep('PRO_DASHBOARD');
      } else {
        if (!isLoggedIn && currentStep === 'LOGIN') {
          setCurrentStep('LOGIN');
        } else if (activeOrder?.status === 'EN_ROUTE' || activeOrder?.status === 'ARRIVED') {
          setCurrentStep('TRACKING');
        } else if (
          activeOrder?.status === 'COMPLETED_UNPAID' ||
          activeOrder?.status === 'PAID'
        ) {
          setCurrentStep('PAYMENT');
        } else {
          setIsLoggedIn(true);
          setCurrentStep('HOME');
        }
      }
    },
    [activeOrder, currentStep, isLoggedIn]
  );

  const navigateToStep = useCallback((step: ScreenStep) => {
    setCurrentStep(step);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        isLoggedIn,
        clientName,
        clientPhone,
        clientAddress,
        setClientPhone,
        setClientAddress,
        loginWithRole,
        role,
        currentStep,
        switchRole,
        navigateToStep,
        selectedService,
        selectServiceForBooking,
        activeOrder,
        createAndDispatchOrder,
        proProfile,
        acceptIncomingJob,
        declineIncomingJob,
        completeOrderToPayment,
        confirmKaspiPayment,
        submitReview,
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
