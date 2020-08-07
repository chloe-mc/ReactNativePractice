import React, {useState, useMemo, useRef} from 'react';
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
  add,
  sub,
} from 'react-native-reanimated';
import Colors from '../../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {
  TapGestureHandler,
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
  cardTranslation: Animated.Node<number>;
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
  outputFrom: number | Animated.Value<number> | Animated.Node<number>,
  outputTo: number | Animated.Value<number> | Animated.Node<number>,
  reverse: boolean,
  delta?: number | Animated.Value<number> | Animated.Node<number>,
) => {
  const outputRange = [
    reverse ? outputTo : outputFrom,
    reverse ? outputFrom : outputTo,
  ];

  if (!reverse && delta) {
    outputRange[0] = add(outputFrom, delta);
  }

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

const Panel: React.FC<PanelProps> = ({cardTranslation, onClose}) => {
  const HEADER_HEIGHT = useHeaderHeight();
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
  const FINAL_CARD_TOP =
    WINDOW_HEIGHT -
    TAB_BAR_HEIGHT -
    CARD_HEIGHT -
    CARD_MARGIN -
    HEADER_HEIGHT -
    STATUS_BAR_HEIGHT;
  const FINAL_CARD_BOTTOM = CARD_MARGIN + TAB_BAR_HEIGHT;

  const CARD_TOTAL_TRAVEL = CARD_HEIGHT + CARD_MARGIN;
  const CARD_TRAVEL_DELTA = add(CARD_TOTAL_TRAVEL, cardTranslation);

  const [goDown, setGoDown] = useState(false);

  const timingTransition = new Value(0);

  const cardPosition = useMemo(() => {
    return {
      top: new Value<number>(FINAL_CARD_TOP),
      bottom: new Value<number>(FINAL_CARD_BOTTOM),
      left: new Value<number>(CARD_MARGIN),
      right: new Value<number>(CARD_MARGIN),
    };
  }, []);

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
        reversibleInterpolate(
          timingTransition,
          FINAL_CARD_TOP,
          0,
          goDown,
          CARD_TRAVEL_DELTA,
        ),
      ),
      set(
        cardPosition.bottom,
        reversibleInterpolate(
          timingTransition,
          FINAL_CARD_BOTTOM,
          0,
          goDown,
          multiply(-1, CARD_TRAVEL_DELTA),
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
        // backgroundColor: Colors.backgrounds.lighter,
        borderColor: 'red',
        borderWidth: 2,
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
  return block([
    cond(not(clockRunning(clock)), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    interpolate(state.position, {
      inputRange: [0, 1],
      outputRange: [animateFromPosition, animateToPosition],
    }),
  ]);
};

const CardToPanel = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [animateCard, setAnimateCard] = useState<boolean>(true);

  const gestureY = new Value(0);
  const gestureState = new Value(State.UNDETERMINED);
  const {onGestureEvent, onHandlerStateChange} = createGestureHandler({
    translationY: gestureY,
    state: gestureState,
  });
  const translateY = useValue(0);

  const closePanel = () => {
    setShowPanel(false);
  };

  const openPanel = () => {
    setShowPanel(true);
  };

  // SWIPE UP TO GO FROM CARD TO PANEL
  useCode(
    () => [
      cond(and(eq(gestureState, State.ACTIVE), lessOrEq(gestureY, -20)), [
        set(gestureY, new Value(0)),
        call([], openPanel),
      ]),
    ],
    [],
  );

  // CARD UP & DOWN ON BUTTON PRESS
  useCode(() => {
    if (animateCard) {
      return [
        // debug('translateY', translateY),
        set(translateY, withCardAnimation(0, -CARD_HEIGHT - 16)),
      ];
    } else {
      return [
        // debug('translateY', translateY),
        set(translateY, withCardAnimation(-CARD_HEIGHT - 16, 0)),
      ];
    }
  }, [animateCard]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.backgrounds.darker,
      }}>
      <RectButton
        style={{backgroundColor: 'white'}}
        onPress={() => setAnimateCard((prevState) => !prevState)}>
        <Text>{animateCard ? 'Hide Card' : 'Show Card'}</Text>
      </RectButton>
      {showPanel && <Panel cardTranslation={translateY} onClose={closePanel} />}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: -(CARD_HEIGHT - TAB_BAR_HEIGHT),
            left: CARD_MARGIN,
            right: CARD_MARGIN,
          },
          {transform: [{translateY}]},
        ]}>
        <TapGestureHandler
          onHandlerStateChange={({nativeEvent}) =>
            nativeEvent.state === State.ACTIVE && openPanel()
          }>
          <Animated.View>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}>
              <Animated.View>
                <Card borderRadius={5} />
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
      <TabBar />
    </SafeAreaView>
  );
};

export {CardToPanel};
