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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <StatisticsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#7f5539',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#f5ebe0',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Random Number Generator' }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{ title: 'Statistics' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </StatisticsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ebe0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  numberBox: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#b08968',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
  },
  numberText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    width: '80%',
    backgroundColor: '#7f5539',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  statRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b08968',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  statCount: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});