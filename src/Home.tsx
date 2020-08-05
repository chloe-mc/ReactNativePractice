/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import Colors from '../styles/Colors';

type HomeProps = {
  projects: Project[];
  navigation: any;
};

const Item = ({title, onPress}) => (
  <TouchableHighlight style={styles.project} onPress={onPress}>
    <Text style={styles.projectTitle}>{title}</Text>
  </TouchableHighlight>
);

const Home: React.FC<HomeProps> = ({navigation, route}) => {
  const {projects} = route.params;
  const renderItem = ({item}) => (
    <Item title={item.title} onPress={() => navigation.navigate(item.id)} />
  );

  return (
    <>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgrounds.lighter}}>
        <FlatList
          data={projects}
          renderItem={renderItem}
          keyExtractor={(project) => project.id}
          style={styles.list__container}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  list__container: {
    backgroundColor: Colors.backgrounds.darker,
  },
  project: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: Colors.backgrounds.lighter,
    elevation: 3,
  },
  projectTitle: {
    fontSize: 18,
    color: Colors.text.lighter,
  },
});

export default Home;
