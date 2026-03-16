/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Statistics: undefined;
};

type StatisticsType = {
  [key: number]: number;
};

type StatisticsContextType = {
  statistics: StatisticsType;
  incrementNumber: (num: number) => void;
  clearStatistics: () => void;
};

const createInitialStatistics = (): StatisticsType => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
});

const StatisticsContext = createContext<StatisticsContextType | undefined>(
  undefined
);

const useStatistics = (): StatisticsContextType => {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error('useStatistics must be used inside StatisticsProvider');
  }
  return context;
};

const StatisticsProvider = ({ children }: { children: ReactNode }) => {
  const [statistics, setStatistics] = useState<StatisticsType>(
    createInitialStatistics()
  );

  const incrementNumber = (num: number) => {
    setStatistics(prev => ({
      ...prev,
      [num]: prev[num] + 1,
    }));
  };

  const clearStatistics = () => {
    setStatistics(createInitialStatistics());
  };

  const value = useMemo(
    () => ({
      statistics,
      incrementNumber,
      clearStatistics,
    }),
    [statistics]
  );

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};