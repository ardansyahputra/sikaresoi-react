import { createStackNavigator } from '@react-navigation/stack';
import Home from '../admin/home/home';
import UserScreen from '../admin/user/user';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
