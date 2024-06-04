const TaskManager = require("expo-task-manager");
const Location = require("expo-location");

const { addLocation } = require("./storage");

/**
 * The unique name of the background location task.
 */
const locationTaskName = "office-marathon";

/**
 * Check if the background location is started and running.
 * This is a wrapper around `Location.hasStartedLocationUpdatesAsync` with the task name prefilled.
 */
export async function isNowTracking() {
  return await Location.hasStartedLocationUpdatesAsync(locationTaskName);
}

/**
 * Start the background location monitoring and add new locations to the storage.
 * This is a wrapper around `Location.startLocationUpdatesAsync` with the task name prefilled.
 */
export async function startTracking() {
  await Location.startLocationUpdatesAsync(locationTaskName, {
    timeInterval: 1000,
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1,
    deferredUpdatesInterval: 1000,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      killServiceOnDestroy: false,
      notificationTitle: "Using your location",
      notificationBody:
        "To turn off, go back to the app and switch something off.",
    },
  });
  console.log("[tracking]", "started background location task");
}

/**
 * Stop the background location monitoring.
 * This is a wrapper around `Location.stopLocationUpdatesAsync` with the task name prefilled.
 */
async function stopTracking() {
  await Location.stopLocationUpdatesAsync(locationTaskName);
  console.log("[tracking]", "stopped background location task");
}

/**
 * Define the background task that's adding locations to the storage.
 * This method isn't "directly" connected to React, that's why we store the data locally.
 */
TaskManager.defineTask(locationTaskName, async (event) => {
  if (event.error) {
    return console.error(
      "[tracking]",
      "Something went wrong within the background location task...",
      event.error
    );
  }

  const locations = event.data.locations;
  console.log("[tracking]", "Received new locations", locations);

  try {
    // have to add it sequentially, parses/serializes existing JSON
    for (const location of locations) {
      await addLocation(location);
    }
  } catch (error) {
    console.log(
      "[tracking]",
      "Something went wrong when saving a new location...",
      error
    );
  }
});
