import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, View } from "react-native";

import {
  SmartBottomSheetState,
  SmartMapMode,
  SmartMapNavigationUserTask,
  SmartMapObject,
  SmartMapUserTaskResponse,
  SmartMapUserTaskType,
  SmartMapView,
  SmartMapViewMethods,
  SmartMapViewStatus
} from "react-native-steerpath-smart-map";

import { RootScreenProps } from "./Navigation";

import useSteerpath, { API_KEY } from "./useSteerpath";
import Drawer from "./Drawer";

const MapScreen: FC<RootScreenProps<"Map">> = ({ navigation }) => {
  const smartMapRef = useRef<SmartMapViewMethods>(null);
  const [selectedObject, setSelectedObject] = useState<SmartMapObject | null>(
    null
  );
  const [bottomSheetState, setBottomSheetState] =
    useState<SmartBottomSheetState>();
  const [searchResults, setSearchResults] = useState<SmartMapObject[]>();
  const [mapLoaded, setMapLoaded] = useState(false);
  const sdkReady = useSteerpath();

  useEffect(() => {
    if (selectedObject && searchResults) {
      const otherObjs = searchResults.filter(
        (res) =>
          res.localRef !== selectedObject.localRef &&
          res.buildingRef === selectedObject.buildingRef
      );
      smartMapRef.current?.selectMapObject(selectedObject);
      smartMapRef.current?.addMarkers(otherObjs, null, null, null, null);
      setSelectedObject(null);
    }
  }, [selectedObject, searchResults]);

  useEffect(() => {
    if (mapLoaded && Platform.OS === "android") {
      navigation.addListener("blur", () => {
        smartMapRef.current?.stop();
      });

      navigation.addListener("focus", () => {
        smartMapRef.current?.start();
      });
    }
  }, [mapLoaded]);

  const onMapLoaded = useCallback(() => {
    smartMapRef.current?.setMapMode(SmartMapMode.SEARCH);

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (bottomSheetState === SmartBottomSheetState.EXPANDED) {
        smartMapRef.current?.onBackPressed(() => {});
        return true;
      }
      return false;
    });

    setMapLoaded(true);
  }, []);

  if (!sdkReady) {
    return null;
  }

  return (
    <View style={{ flex: 10, flexDirection: "row" }}>
      <View style={{ flex: 7 }}>
        <SmartMapView
          accessibilityComponentType="none"
          accessibilityTraits="none"
          style={{ flex: 1 }}
          apiKey={API_KEY}
          ref={smartMapRef}
          onMapLoaded={onMapLoaded}
          onMapClicked={(payload) => {
            // eslint-disable-next-line no-console
            console.log("payload", payload);

            const { mapObjects } = payload;
            if (mapObjects.length > 0) {
              const smartmapObject = mapObjects[0];
              // use selectMapObject() to open the default info bottomsheet of selected smartMapObject
              smartMapRef.current?.selectMapObject(smartmapObject);
            }
          }}
          onUserFloorChanged={(payload) =>
            // eslint-disable-next-line no-console
            console.log("User floor changed", payload)
          }
          onVisibleFloorChanged={(payload) =>
            // eslint-disable-next-line no-console
            console.log("Visible Floor changed", payload)
          }
          onSearchResultSelected={(payload) => {
            setSelectedObject(payload.mapObject);
          }}
          onViewStatusChanged={(payload) => {
            // eslint-disable-next-line no-console
            console.log("onViewstatuschanged", payload);
            if (payload.status === SmartMapViewStatus.CARD_VIEW) {
              // eslint-disable-next-line no-console
              console.log("card");
            }
            if (payload.status === SmartMapViewStatus.SEARCH_VIEW) {
              // eslint-disable-next-line no-console
              console.log("search");
            }
            if (payload.status === SmartMapViewStatus.SETTING_VIEW) {
              // eslint-disable-next-line no-console
              console.log("settings");
            }
            if (payload.status === SmartMapViewStatus.NAVIGATING_VIEW) {
              // eslint-disable-next-line no-console
              console.log("nav");
            }
            if (payload.status === SmartMapViewStatus.ERROR_VIEW) {
              // eslint-disable-next-line no-console
              console.log("err");
            }
            if (payload.status === SmartMapViewStatus.ONLY_MAP) {
              // eslint-disable-next-line no-console
              console.log("map");
            }
          }}
          onBottomSheetStateChanged={(payload) => {
            setBottomSheetState(payload.state);
            // eslint-disable-next-line no-console
            console.log("onBottomSheetStatusChanged", payload.state);
          }}
          onNavigationEnded={() => {
            // eslint-disable-next-line no-console
            console.log("navigation ended");
          }}
          onNavigationStarted={() => {
            // eslint-disable-next-line no-console
            console.log("navigation started");
          }}
          onNavigationPreviewAppeared={() =>
            // eslint-disable-next-line no-console
            console.log("navigation PreviewAppeared")
          }
          onNavigationDestinationReached={() =>
            // eslint-disable-next-line no-console
            console.log("navigation DestinationReached")
          }
          onUserTaskResponse={(taskInfo) => {
            const { response, userTask } = taskInfo;
            // eslint-disable-next-line no-console
            console.log("response", response);
            // eslint-disable-next-line no-console
            console.log("userTask", userTask);

            if (
              response === SmartMapUserTaskResponse.COMPLETED ||
              response === SmartMapUserTaskResponse.CANCELLED
            ) {
              if (userTask.type === SmartMapUserTaskType.NAVIGATION) {
                const smartMapObject: SmartMapObject =
                  userTask.payload as SmartMapNavigationUserTask as SmartMapObject;
                smartMapRef.current?.selectMapObject(smartMapObject);
              }
            }
          }}
          onSearchCategorySelected={(payload) => {
            // eslint-disable-next-line no-console
            console.log("alltags  ", payload.searchAction.action.allTags);
            // eslint-disable-next-line no-console
            console.log("anyTags  ", payload.searchAction.action.anyTags);
            // eslint-disable-next-line no-console
            console.log("title  ", payload.searchAction.title);
            // eslint-disable-next-line no-console
            console.log("type  ", payload.searchAction.action.type);
            if (searchResults && searchResults.length > 0) {
              setSearchResults([]);
              smartMapRef.current?.removeAllMarkers();
            }
            setSearchResults(payload.searchResults);
          }}
        />
      </View>
      <View style={{ flex: 3 }}>
        <Drawer smartMapRef={smartMapRef} selectedMapObject={selectedObject} />
      </View>
    </View>
  );
};

export default MapScreen;
