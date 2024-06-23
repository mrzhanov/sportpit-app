import React from 'react';
import Scanner from './screens/Scanner';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Search from './screens/Search';
import AddProduct from './screens/AddProduct';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './components/AuthContext';
import PasswordScreen from './screens/PasswordScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
console.log('render fr')
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Добавить') {
          iconName = focused ? 'add' : 'add';
        } else if (route.name === 'Поиск') {
          iconName = focused ? 'search' : 'search';
        } else if (route.name === 'Домой') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'Сканировать') {
          iconName = focused ? 'scan' : 'scan';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        display: 'flex',
        backgroundColor: 'white', // Цвет фона
        height: 60, // Высота панели вкладок
        paddingBottom: 10, // Нижний отступ
        paddingTop: 10, // Верхний отступ
        borderTopWidth: 1, // Ширина верхней границы
        borderTopColor: 'lightgray', // Цвет верхней границы
      },
      tabBarLabelStyle: {
        fontSize: 12, // Размер шрифта для меток вкладок
      },
    })}
  >
    <Tab.Screen name="Сканировать" component={Scanner} />
    <Tab.Screen name="Поиск" component={Search} />
    <Tab.Screen name="Добавить" component={AddProduct} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="PasswordScreen"
            component={PasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
