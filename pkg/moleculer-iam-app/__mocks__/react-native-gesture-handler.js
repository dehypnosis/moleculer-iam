const View = require("react-native-web").View;
module.exports = {
  Swipeable: View,
  DrawerLayout: View,
  State: {},
  ScrollView: View,
  Slider: View,
  Switch: View,
  TextInput: View,
  ToolbarAndroid: View,
  ViewPagerAndroid: View,
  DrawerLayoutAndroid: View,
  WebView: View,
  NativeViewGestureHandler: View,
  TapGestureHandler: View,
  FlingGestureHandler: View,
  ForceTouchGestureHandler: View,
  LongPressGestureHandler: View,
  PanGestureHandler: View,
  PinchGestureHandler: View,
  RotationGestureHandler: View,

  /* Buttons */
  RawButton: View,
  BaseButton: View,
  RectButton: View,
  BorderlessButton: View,

  /* Other */
  FlatList: View,
  gestureHandlerRootHOC: jest.fn(),
  Directions: {},

  ...require("react-native-gesture-handler/__mocks__/RNGestureHandlerModule"),
};
