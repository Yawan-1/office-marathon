import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { Box, Button, Paragraph, Title } from "../providers/theme";
import { useLocationData, useLocationTracking } from "../services/location";

function DistanceScreen() {
  const locations = useLocationData();
  const tracking = useLocationTracking();

  return (
    <Box variant="page">
      <Box variant="row">
        {tracking.isTracking ? (
          <Button onPress={tracking.stopTracking}>Stop tracking</Button>
        ) : (
          <Button onPress={tracking.startTracking}>Start tracking</Button>
        )}
        <Button variant="primary" onPress={tracking.clearTracking}>
          Reset data
        </Button>
      </Box>
      <DistanceLocationList locations={locations} />
    </Box>
  );
}

function DistanceLocationList({ locations }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (locations.length) {
      setTimeout(() => listRef.current?.scrollToEnd());
    }
  }, [locations.length]);

  return (
    <Box>
      <FlatList
        ref={listRef}
        style={{ flexGrow: 0, flexBasis: 200 }}
        data={locations}
        keyExtractor={(location, index) => `${location.timestamp}-${index}`}
        renderItem={(entry) => (
          <DistanceLocation number={entry.index} location={entry.item} />
        )}
      />
    </Box>
  );
}

function DistanceLocation({ number, location }) {
  return (
    <Box variant="row">
      <Paragraph>#{number + 1}</Paragraph>
      <Paragraph>lat: {location.coords.latitude}</Paragraph>
      <Paragraph>lng: {location.coords.longitude}</Paragraph>
    </Box>
  );
}

export default DistanceScreen;
