/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Colors from '../styles/Colors';
import Home from './Home';
import MapWithLabels from './MapWithLabels/MapWithLabels';
import {CardToPanel} from './CardToPanel/CardToPanel';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const projects = [
    {
      id: 'CardToPanel',
      title: 'Card To Panel',
      component: CardToPanel,
    },
    {
      id: 'MapWithLabels',
      title: 'Map With Labels',
      component: MapWithLabels,
    },
  ];

  return (
    <NavigationContainer>
      <View style={{flex: 1, backgroundColor: Colors.backgrounds.lighter}}>
        <Stack.Navigator headerMode="screen">
          <Stack.Screen
            name="Home"
            component={Home}
            initialParams={{
              projects: projects.map((project) => ({
                ...project,
                component: null,
              })),
            }}
            options={{
              header: () => (
                <>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.backgrounds.lighter}
                  />
                  <SafeAreaView style={styles.header__container}>
                    <Text style={styles.header}>React Native Practice</Text>
                  </SafeAreaView>
                </>
              ),
            }}
          />
          {projects.map(({id, title, component}) => (
            <Stack.Screen
              key={id}
              name={id}
              component={component}
              options={{
                headerTitle: title,
                headerStyle: {
                  backgroundColor: Colors.backgrounds.lighter,
                },
                headerBackTitleVisible: false,
                headerTintColor: Colors.text.lighter,
              }}
            />
          ))}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.lighter,
    padding: 20,
    textAlign: 'center',
    backgroundColor: Colors.backgrounds.lighter,
  },
  header__container: {
    backgroundColor: Colors.backgrounds.lighter,
  },
});

export default App;
