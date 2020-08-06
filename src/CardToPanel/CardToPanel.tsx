import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ViewStyle,
} from 'react-native';
import Animated, {
  cond,
  eq,
  Value,
  useCode,
  interpolate,
  Clock,
  Extrapolate,
  Easing,
  set,
  multiply,
  debug,
  block,
  call,
  not,
  and,
  startClock,
  neq,
  stopClock,
  timing,
  greaterOrEq,
  lessOrEq,
  clockRunning,
} from 'react-native-reanimated';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {
  TouchableWithoutFeedback,
  State,
  RectButton,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {
  useValues,
  useClock,
  useValue,
  withTimingTransition,
  useDebug,
  TimingConfig,
  onGestureEvent as createGestureHandler,
} from 'react-native-redash';
import {useHeaderHeight} from '@react-navigation/stack';
import {useSafeArea} from 'react-native-safe-area-context';

type PanelProps = {
  onClose: () => void;
};

type CardProps = {
  borderRadius: number | Animated.Node<number>;
};

const TAB_BAR_HEIGHT = 70;
const MASTHEAD_HEIGHT = 150;
const POST_INFO_HEIGHT = 72;
const CARD_HEIGHT = MASTHEAD_HEIGHT + POST_INFO_HEIGHT;
const CARD_MARGIN = 16;
const BORDER_RADIUS = 5;
const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedRectButton = Animated.createAnimatedComponent(RectButton);

const reversibleInterpolate = (
  value: Animated.Node<number>,
  outputFrom: number,
  outputTo: number,
  reverse: boolean,
) => {
  const outputRange = [
    reverse ? outputTo : outputFrom,
    reverse ? outputFrom : outputTo,
  ];

  return interpolate(value, {
    inputRange: [0, 1],
    outputRange,
  });
};

const withTimingWithCallback = (onFinishedAnimating?: () => void) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    frameTime: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration: 250,
    easing: Easing.linear,
  };
  return block([
    startClock(clock),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      call([], () => {
        if (onFinishedAnimating) onFinishedAnimating();
      }),
    ]),
    state.position,
  ]);
};

const Messages = () => {
  return (
    <View>
      <Text>Messages</Text>
    </View>
  );
};

const Panel: React.FC<PanelProps> = ({onClose}) => {
  const HEADER_HEIGHT = useHeaderHeight();
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  const inset = useSafeArea();
  const CARD_TOP =
    WINDOW_HEIGHT -
    TAB_BAR_HEIGHT -
    CARD_HEIGHT -
    CARD_MARGIN -
    HEADER_HEIGHT -
    STATUS_BAR_HEIGHT -
    inset.top -
    inset.bottom;
  const PANEL_TOP = 0;

  const [goDown, setGoDown] = useState(false);

  const timingTransition = new Value(0);

  const cardPosition = useMemo(
    () => ({
      top: new Value<number>(CARD_TOP),
      bottom: new Value<number>(CARD_MARGIN + TAB_BAR_HEIGHT),
      left: new Value<number>(CARD_MARGIN),
      right: new Value<number>(CARD_MARGIN),
    }),
    [],
  );

  const cardAppearance = useMemo(
    () => ({
      opacity: new Value(0),
      borderRadius: new Value(0),
    }),
    [],
  );

  useCode(
    () => [
      set(
        timingTransition,
        withTimingWithCallback(goDown ? onClose : undefined),
      ),
      set(
        cardPosition.top,
        reversibleInterpolate(timingTransition, CARD_TOP, PANEL_TOP, goDown),
      ),
      set(
        cardPosition.bottom,
        reversibleInterpolate(
          timingTransition,
          CARD_MARGIN + TAB_BAR_HEIGHT,
          0,
          goDown,
        ),
      ),
      set(
        cardPosition.left,
        reversibleInterpolate(timingTransition, CARD_MARGIN, 0, goDown),
      ),
      set(cardPosition.right, cardPosition.left),
      set(
        cardAppearance.borderRadius,
        reversibleInterpolate(timingTransition, BORDER_RADIUS, 0, goDown),
      ),
      set(
        cardAppearance.opacity,
        reversibleInterpolate(timingTransition, 0, 1, goDown),
      ),
    ],
    [goDown],
  );

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
            position: 'absolute',
            zIndex: 2,
            elevation: 2,
            ...cardPosition,
          },
        ]}>
        <AnimatedRectButton
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            opacity: cardAppearance.opacity,
            zIndex: 10,
            elevation: 10,
            backgroundColor: 'white',
          }}
          onPress={() => {
            setGoDown(true);
          }}>
          <Text>Go Back</Text>
        </AnimatedRectButton>
        <Card borderRadius={cardAppearance.borderRadius} />
      </Animated.View>
      <Animated.View
        style={{
          borderRadius: cardAppearance.borderRadius,
          backgroundColor: 'white',
          paddingTop: CARD_HEIGHT,
          zIndex: 1,
          elevation: 1,
          position: 'absolute',
          ...cardPosition,
        }}>
        <Animated.View style={{opacity: cardAppearance.opacity}}>
          <Messages />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const Card: React.FC<CardProps> = ({borderRadius}) => {
  return (
    <Animated.View
      style={{
        borderRadius,
        overflow: 'hidden',
        backgroundColor: 'white',
      }}>
      <LinearGradient
        colors={['rgba(25, 118, 210, 0.7)', 'rgba(13, 71, 161, 0.9)']}
        style={{
          height: MASTHEAD_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Masthead</Text>
      </LinearGradient>
      <View
        style={{
          height: POST_INFO_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
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
        backgroundColor: Colors.backgrounds.lighter,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        elevation: 1,
      }}
    />
  );
};

const withCardAnimation = (
  animateFromPosition: number,
  animateToPosition: number,
) => {
  const clock = new Clock();
  const state: Animated.TimingState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration: 250,
    easing: Easing.linear,
  };
  const resetState = [
    set(state.finished, 0),
    set(state.time, 0),
    set(state.frameTime, 0),
  ];
  return block([
    cond(not(clockRunning(clock)), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      ...resetState,
      cond(not(state.position), stopClock(clock)),
    ]),
    interpolate(state.position, {
      inputRange: [0, 1],
      outputRange: [animateFromPosition, animateToPosition],
    }),
  ]);
};

const CardToPanel = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  const closePanel = () => {
    setShowPanel(false);
  };

  const openPanel = () => {
    setShowPanel(true);
  };

  const translationY = new Value(0);
  const gestureState = new Value(State.UNDETERMINED);
  const {onGestureEvent, onHandlerStateChange} = createGestureHandler({
    translationY,
    state: gestureState,
  });

  useCode(
    () => [
      cond(and(eq(gestureState, State.ACTIVE), lessOrEq(translationY, -10)), [
        set(translationY, new Value(0)),
        call([], openPanel),
      ]),
    ],
    [showPanel],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.backgrounds.darker,
      }}>
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
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}>
              <Animated.View>
                <Card borderRadius={5} />
              </Animated.View>
            </PanGestureHandler>
          </TouchableWithoutFeedback>
        </View>
      )}
      <TabBar />
    </SafeAreaView>
  );
};

export {CardToPanel};
