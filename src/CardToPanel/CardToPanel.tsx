import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import Animated, {
  cond,
  eq,
  Value,
  useCode,
  interpolate,
  set,
  Clock,
  Easing,
  Extrapolate,
  multiply,
  debug,
} from 'react-native-reanimated';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  useValues,
  timing,
  useClock,
  useValue,
  withTimingTransition,
  useDebug,
} from 'react-native-redash';
import {useHeaderHeight} from '@react-navigation/stack';
import {useSafeArea} from 'react-native-safe-area-context';

type PanelProps = {
  onClose: () => void;
};

type CardProps = {
  borderRadius: number | Animated.Node<number>;
};

type MessagesProps = {
  opacity: number | Animated.Node<number>;
};

const TAB_BAR_HEIGHT = 70;
const MASTHEAD_HEIGHT = 150;
const POST_INFO_HEIGHT = 72;
const CARD_HEIGHT = MASTHEAD_HEIGHT + POST_INFO_HEIGHT;
const CARD_MARGIN = 16;
const BORDER_RADIUS = 5;
const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const interpolateWithValue = (
  value: Animated.Node<number>,
  outputFrom: number,
  outputTo: number,
  direction: 'FORWARD' | 'BACKWARD' = 'FORWARD',
) =>
  interpolate(value, {
    inputRange: [0, 1],
    outputRange: [
      direction === 'FORWARD' ? outputFrom : outputTo,
      direction === 'FORWARD' ? outputTo : outputFrom,
    ],
  });

const Messages = () => {
  return (
    <View>
      <Text>Messages</Text>
    </View>
  );
};

const Panel: React.FC<PanelProps> = ({onClose}) => {
  const HEADER_HEIGHT = useHeaderHeight();
  const inset = useSafeArea();
  const CARD_TOP =
    WINDOW_HEIGHT -
    TAB_BAR_HEIGHT -
    CARD_HEIGHT -
    CARD_MARGIN -
    HEADER_HEIGHT -
    inset.bottom;
  const PANEL_TOP = 0;
  const initiateTimingTransition = new Value<0 | 1>(0);
  const timingTransition = withTimingTransition(initiateTimingTransition, {
    duration: 250,
    easing: Easing.ease,
  });

  const animatedBorderRadius = interpolateWithValue(
    timingTransition,
    BORDER_RADIUS,
    0,
  );

  const animatedOpacity = interpolateWithValue(timingTransition, 0, 1);

  const animatedTop = interpolateWithValue(
    timingTransition,
    CARD_TOP,
    PANEL_TOP,
  );

  const animatedBottom = interpolateWithValue(
    timingTransition,
    CARD_MARGIN + TAB_BAR_HEIGHT,
    0,
  );

  const animatedHorizontal = interpolateWithValue(
    timingTransition,
    CARD_MARGIN,
    0,
  );

  useCode(
    () => [
      set(initiateTimingTransition, 1),
      debug('initiateTimingTransition', initiateTimingTransition),
    ],
    [],
  );

  useDebug({initiateTimingTransition});

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        elevation: 2,
      }}>
      <Animated.View
        style={[
          {
            zIndex: 2,
            elevation: 2,
            height: CARD_HEIGHT,
            position: 'absolute',
            bottom: animatedBottom,
            left: animatedHorizontal,
            right: animatedHorizontal,
            top: animatedTop,
          },
        ]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Card borderRadius={animatedBorderRadius} />
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View
        style={{
          borderRadius: animatedBorderRadius,
          backgroundColor: 'white',
          position: 'absolute',
          top: animatedTop,
          bottom: animatedBottom,
          left: animatedHorizontal,
          right: animatedHorizontal,
          paddingTop: CARD_HEIGHT,
          zIndex: 1,
          elevation: 1,
        }}>
        <Animated.View style={{opacity: animatedOpacity}}>
          <Messages />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const Card: React.FC<CardProps> = ({borderRadius}) => {
  return (
    <Animated.View
      style={{borderRadius, overflow: 'hidden', backgroundColor: 'white'}}>
      <AnimatedLinearGradient
        colors={['rgba(25, 118, 210, 0.7)', 'rgba(13, 71, 161, 0.9)']}
        style={{
          height: MASTHEAD_HEIGHT,
        }}>
        <Text>Tap Me!</Text>
      </AnimatedLinearGradient>
      <View style={{height: POST_INFO_HEIGHT}}>
        <Text>Post info</Text>
      </View>
    </Animated.View>
  );
};

const TabBar = () => {
  return (
    <View
      style={{
        width: WINDOW_WIDTH,
        height: TAB_BAR_HEIGHT,
        backgroundColor: 'blue',
        opacity: 0.8,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        elevation: 1,
      }}
    />
  );
};

const CardToPanel = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const closePanel = () => {
    setShowPanel(false);
  };

  const openPanel = () => {
    setShowPanel(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.backgrounds.darker,
      }}>
      <TabBar />
      {showPanel ? (
        <Panel onClose={closePanel} />
      ) : (
        <View
          style={{
            marginBottom: CARD_MARGIN + TAB_BAR_HEIGHT,
            marginHorizontal: CARD_MARGIN,
            marginTop: 'auto',
          }}>
          <TouchableWithoutFeedback onPress={openPanel}>
            <Card borderRadius={5} />
          </TouchableWithoutFeedback>
        </View>
      )}
    </SafeAreaView>
  );
};

export {CardToPanel};
