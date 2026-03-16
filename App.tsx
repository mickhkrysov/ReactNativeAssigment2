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

type CustomButtonProps = {
  title: string;
  onPress: () => void;
};

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [currentNumber, setCurrentNumber] = useState<string>('…');
  const { incrementNumber } = useStatistics();

  const generateNumber = () => {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    setCurrentNumber(String(randomNum));
    incrementNumber(randomNum);
  };

  useFocusEffect(
    useCallback(() => {
      setCurrentNumber('…');
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{currentNumber}</Text>
      </View>

      <CustomButton title="Generate" onPress={generateNumber} />
      <CustomButton
        title="View Statistics"
        onPress={() => navigation.navigate('Statistics')}
      />
    </View>
  );
};

type StatisticsScreenProps = {
  navigation: any;
};

const StatisticsScreen = ({ navigation }: StatisticsScreenProps) => {
  const { statistics, clearStatistics } = useStatistics();

  const data = Object.keys(statistics).map(key => ({
    id: key,
    number: key,
    count: statistics[Number(key)],
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.statRow}>
            <Text style={styles.statNumber}>Number {item.number}</Text>
            <Text style={styles.statCount}>{item.count}</Text>
          </View>
        )}
      />

      <CustomButton title="Clear Statistics" onPress={clearStatistics} />
      <CustomButton
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};
