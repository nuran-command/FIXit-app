import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OrderProvider, useOrder } from './src/context/OrderContext';
import { COLORS } from './src/data/mockData';
import { LoginScreen } from './src/screens/LoginScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { OrderIntakeScreen } from './src/screens/OrderIntakeScreen';
import { CustomRequestScreen } from './src/screens/CustomRequestScreen';
import { ProDashboardScreen } from './src/screens/ProDashboardScreen';
import { TrackingScreen } from './src/screens/TrackingScreen';
import { KaspiCheckoutScreen } from './src/screens/KaspiCheckoutScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';

const MainShell: React.FC = () => {
  const { isLoggedIn, role, currentStep, toast, dismissToast } = useOrder();

  const renderScreen = () => {
    if (!isLoggedIn || currentStep === 'LOGIN') {
      return <LoginScreen />;
    }

    if (role === 'PRO' || currentStep === 'PRO_DASHBOARD') {
      return <ProDashboardScreen />;
    }

    switch (currentStep) {
      case 'HOME':
        return <CatalogScreen />;
      case 'BOOKING':
        return <OrderIntakeScreen />;
      case 'CUSTOM_REQUEST':
        return <CustomRequestScreen />;
      case 'TRACKING':
        return <TrackingScreen />;
      case 'PAYMENT':
        return <KaspiCheckoutScreen />;
      case 'REVIEW':
        return <ReviewScreen />;
      default:
        return <CatalogScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.screenViewport}>{renderScreen()}</View>

      {toast && (
        <TouchableOpacity
          style={styles.toast}
          onPress={dismissToast}
          activeOpacity={0.9}
        >
          <Text style={styles.toastText}>{toast.text}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <OrderProvider>
      <MainShell />
    </OrderProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  screenViewport: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toast: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
