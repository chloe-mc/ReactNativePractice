import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Colors from '../../styles/Colors';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoicHJvamVjdGF0bGFzIiwiYSI6ImNqZ25wZ2JtbjBqYWoycXIxZTQ1cmZvOGQifQ.lOIDJAADqZ8SNXUobycfiQ',
);

type Post = {
  id: string;
  color: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const postsFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        color: 'red',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79985046386719, 32.80127183199039],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'blue',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79961442947388, 32.80109146836195],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79948568344116, 32.80165059441901],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79939985275269, 32.801307904672164],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.7996734380722, 32.801197432037995],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79952323436737, 32.80122223202906],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79956078529358, 32.80121997748471],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79948836565018, 32.80122448657334],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79951250553131, 32.801206450217364],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'purple',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79982095956802, 32.801233504749966],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.7993488907814, 32.80170244867353],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.7994374036789, 32.80144092255972],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'green',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.799997985363, 32.801348486421674],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'green',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79980486631393, 32.801470231559016],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79958760738373, 32.801425140786854],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'green',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79970026016235, 32.801319177382226],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'blue',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79966807365417, 32.80153110406517],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'blue',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.799818277359, 32.800994522760476],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79941862821579, 32.801420631708375],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'red',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79946154356003, 32.801422886247636],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'green',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79957956075668, 32.80155364942726],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.799818277359, 32.80145219525289],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'green',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79972976446152, 32.80163932175098],
      },
    },
    {
      type: 'Feature',
      properties: {
        color: 'orange',
      },
      geometry: {
        type: 'Point',
        coordinates: [-96.79999262094498, 32.801233504749966],
      },
    },
  ],
};

const posts = new Map([
  [
    'id1',
    {id: 'id1', color: 'red', coordinates: {latitude: 32.8, longitude: -97.5}},
  ],
  [
    'id2',
    {
      id: 'id2',
      color: 'blue',
      coordinates: {latitude: 32.75, longitude: -97.4},
    },
  ],
]);

const mapStyles = {
  icon: {
    iconAllowOverlap: true,
    iconColor: ['get', 'color'],
    iconImage: 'dog-park-11',
    symbolAvoidEdges: true,
    textAllowOverlap: false,
    textField: [
      'format',
      ['upcase', ['get', 'color']],
      {'font-scale': 0.8},
      '\n',
      {},
      ['downcase', ['get', 'color']],
      {'font-scale': 0.6},
    ],
    textFont: ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    textJustify: 'auto',
    textRadialOffset: 0.6,
    textVariableAnchor: ['left', 'right', 'bottom'],
  },
};

const postsToGeoJson = (
  postsMap: Map<string, Post>,
): GeoJSON.FeatureCollection => {
  const geoJsonFeatures = Array.from(postsMap.values()).map((post: Post) => {
    return {
      type: 'Feature',
      id: post.id,
      properties: {
        color: post.color,
      },
      geometry: {
        type: 'Point',
        coordinates: [post.coordinates.longitude, post.coordinates.latitude],
      },
    } as GeoJSON.Feature;
  });
  return {
    type: 'FeatureCollection',
    features: geoJsonFeatures,
  };
};

const MapWithLabels = () => {
  return (
    <View style={styles.screen}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={17}
          centerCoordinate={[-96.7996895313263, 32.801434158943124]}
        />
        <MapboxGL.ShapeSource id="posts-source" shape={postsFeatureCollection}>
          <MapboxGL.SymbolLayer id="posts-layer" style={mapStyles.icon} />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgrounds.lighter,
    color: Colors.text.lighter,
  },
});

export default MapWithLabels;
