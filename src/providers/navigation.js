import OnboardingScreen from "../screens/onboarding";
import DistanceScreen from "../screens/distance";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const NavigationProvider = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Distance" component={DistanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationProvider;
