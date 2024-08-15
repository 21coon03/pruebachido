import * as React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import { MotiView } from "moti";
import { getFeaturedTravelDestinations } from "../lib/data";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const _spacing = 12;
const itemWidth = width * 0.75; // Ancho  expandido
const minimizedWidth = width * 0.6; // Ancho  minimizado
const itemHeight = height * 0.6; // Alto  expandido


type TravelItem = {
  key: string;
  location: string;
  numberOfDays: number;
  image: string;
  color: string;
};

export default function App() {
  const [data, setData] = React.useState<TravelItem[]>([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const lastTap = React.useRef<number | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const travelData = await getFeaturedTravelDestinations(itemWidth);
      setData(travelData);
    }
    fetchData();
  }, []);

  const handlePress = (index: number, item: TravelItem) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // Double tap
      router.push({
        pathname: "/details",
        params: {
          item: JSON.stringify(item),
        },
      });
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={minimizedWidth + _spacing} // Ajuste para el snap entre elementos
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - minimizedWidth) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (minimizedWidth + _spacing),
            index * (minimizedWidth + _spacing),
            (index + 1) * (minimizedWidth + _spacing),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8], // Ajuste escala de 0.8 a 1 y al revez
            extrapolate: "clamp",
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [30, -20, 30], // ELevacion de la del centro
            extrapolate: "clamp",
          });

          return (
            <View
              style={{
                width: minimizedWidth,
                height: itemHeight, // se fija la altura del contenedor
                marginRight: _spacing,
                alignSelf: "center",
              }}
            >
              <Animated.View
                style={{
                  flex: 1,
                  transform: [{ scale }, { translateY }], // Escala y translación
                  borderRadius: _spacing * 2,
                  overflow: "hidden",
                }}
              >
                <Pressable
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    padding: _spacing / 2,
                  }}
                  onPress={() => handlePress(index, item)} //toque simple y doble
                >
                  <Image
                    source={{ uri: item.image }}
                    style={[
                      StyleSheet.absoluteFillObject,
                      { resizeMode: "cover" },
                    ]}
                  />
                  <Animated.View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <MotiView
                      animate={{ backgroundColor: "#fff" }}
                      transition={{ type: "timing", duration: 1000 }}
                      style={{
                        width: "100%",
                        maxWidth: 50,
                        maxHeight: 50,
                        aspectRatio: 1,
                        borderRadius: 100,
                      }}
                    />
                  </Animated.View>
                </Pressable>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Mantener las tarjetas hacia arriba
    paddingTop: Constants.statusBarHeight + 50, 
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
