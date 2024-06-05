import { LocationObject } from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import * as Storage from "./storage";
import { isNowTracking, startTracking, stopTracking } from "./track";
// import * as Track from "./track";

/**
 * An easy-to-use hook that combines all required functionality.
 * It keeps the data in sync as much as possible.
 */
export function useLocationTracking() {
  const [isTracking, setIsTracking] = useState(false);

  const onStartTracking = useCallback(async () => {
    await startTracking();
    setIsTracking(true);
  }, []);

  const onStopTracking = useCallback(async () => {
    await stopTracking();
    setIsTracking(false);
  }, []);

  const onClearTracking = useCallback(async () => {
    if (isTracking) {
      await onStopTracking();
    }
    await Storage.clearLocations();
  }, [isTracking]);

  useEffect(() => {
    isNowTracking().then(setIsTracking);
  }, []);

  return {
    isTracking,
    startTracking: onStartTracking,
    stopTracking: onStopTracking,
    clearTracking: onClearTracking,
  };
}

/**
 * A hook to poll for changes in the storage, updates the UI if locations were added.
 */
export function useLocationData(interval = 1000) {
  const locations = useRef([]);
  const [count, setCount] = useState(0); // count state is only used as rerender trigger, from timer callback

  const onLocations = useCallback(
    (stored) => {
      // check if data was changed using ref data.
      // this method is called from outside react, so we can't use state data without reinitializing it
      if (stored.length !== locations.current.length) {
        // update the locations, but this won't trigger a rerender or update
        locations.current = stored;
        // update the state value, triggering a rerender
        setCount(locations.current.length);
      }
    },
    [setCount, locations]
  );

  useEffect(() => {
    // load the locations on first render
    Storage.getLocations().then(onLocations);
    // create a timer to poll for changes
    const timerId = window.setInterval(
      () => Storage.getLocations().then(onLocations),
      interval
    );
    // when the hook is unmounted, remove the timer
    return () => window.clearInterval(timerId);
  }, [interval]);

  return locations.current;
}
