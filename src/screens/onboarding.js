import { useCallback, useEffect } from "react";
// import { Box, Button, Paragraph, Spinner, Title } from "../providers/theme";

import { useForegroundPermissions } from "expo-location";
import { Text, View } from "react-native";
// const { useCallback, useEffect } = require("react");

// import { StackParamList } from '../providers/navigation';
// const {
//   Box,
//   Button,
//   Spinner,
//   Title,
//   Paragraph,
// } = require("../providers/theme");

// Assuming StackParamList is defined elsewhere
// type OnboardingScreenProps = StackScreenProps<StackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation }) => {
  const [permission, askPermission] = useForegroundPermissions();

  const onContinue = useCallback(() => {
    navigation.navigate("Distance");
  }, [navigation]);

  useEffect(() => {
    // Only redirect on first render or permission change,
    // not when users go back to this screen.
    if (permission?.granted) {
      onContinue();
    }
  }, [onContinue, permission?.granted]);

  if (permission?.granted) {
    return (
      <View>
        <Text>
          <Text>Permissions granted</Text>
          <Text>
            To monitor your office marathon, we need access to your location.
          </Text>
        </Text>
        <Text onPress={onContinue}>
          Let's start!
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View>
        <Text>We need your permission</Text>
        <Text>
          To monitor your office marathon, we need access to your location.
        </Text>
      </View>
      {!permission ? (
        <Text>Loading...</Text>
      ) : (
        <Text onPress={askPermission}>Grant permission</Text>
      )}
    </View>
  );
};

export default OnboardingScreen;
