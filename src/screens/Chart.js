import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  // Image
} from "react-native";
import { useState, useContext } from "react";

import SearchBar from "../components/SearchBar";
import SongItem from "../components/SongItem";
import MiniPlayer from "../components/MiniPlayer";

import { AudioContext } from "../context/AudioContext";
import { ThemeContext } from "../context/ThemeContext";

import Icon from "react-native-vector-icons/FontAwesome";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTooltip } from 'victory-native';
import { Image } from 'react-native-svg';
import OptionModal from "../components/OptionModal";
import { optionSong } from "../utils/optionModal";


// const SongBarLabel = ({ datum }) => {
//   return (
//     <View style={{ alignItems: 'center' }}>
//       <Image
//         // source={{ uri: datum.image }}
//         // style={{ width: 20, height: 20 }}
//         href={{ uri: datum.image }}
//         x={20}
//         y={datum.view}
//         width={20}
//         height={20}
//       />
//       <Text style={{ fontSize: 10 }}>
//         {datum?.name?.length > 10 ? `${datum.name.slice(0, 10)}...` : datum.name}
//       </Text>
//     </View>

//   )
// };


const Chart = () => {
  const { songData, soundObj, currentAudio } = useContext(AudioContext);
  const [filterTime, setFilterTime] = useState("day");
  const { colors } = useContext(ThemeContext);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar></StatusBar>

      <SearchBar title={"Nghe nhiều"} />

      <View
        style={{
          // paddingHorizontal: 20,
          // height: 60,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: colors.background,
        }}
      >
        <VictoryChart
          height={300}
          padding={{ top: 20, bottom: 50, left: 40, right: 40 }}
          domainPadding={20}
        >
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 10,
                color: colors.text
              },
            }}
          />
          {/* <VictoryAxis tickLabelComponent={<SongBarLabel />} /> */}
          <VictoryBar
            data={songData.sort((a, b) => b.view - a.view).slice(0, 5)}
            x={(datum) => datum.name.length > 10 ? `${datum.name.slice(0, 10)}...` : datum.name}
            y="view"
            style={{
              data: { fill: '#c43a31' },
              labels: {
                fontSize: 12,
                color: colors.text
              }
            }}
            labels={({ datum }) => datum.name}
            labelComponent={<VictoryTooltip renderInPortal={false} style={{ fontSize: 12 }} />}
          // labelComponent={<SongBarLabel />}
          />
        </VictoryChart>
      </View>

      <FlatList
        data={songData.sort((a, b) => b.view - a.view)}
        renderItem={({ item, index }) => (
          <View style={styles.rank}>
            <Text style={index <= 4 ? styles.topRank : styles.numRank}>{index + 1}</Text>
            <SongItem
              info={item}
              time={item.time}
              onPressOptionModal={() => {
                setOptionModalVisible(true);
                setCurrentItem(item);
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <OptionModal
        options={optionSong}
        currentItem={currentItem}
        onClose={() => setOptionModalVisible(false)}
        visible={optionModalVisible}
      />
      {currentAudio && <MiniPlayer />}
    </SafeAreaView>
  );
};

export default Chart;

const styles = StyleSheet.create({
  rank: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  numRank: {
    marginLeft: 20,
    marginRight: 5,
    fontSize: 20,
  },
  topRank: {
    marginLeft: 20,
    marginRight: 2,
    fontSize: 25,
    color: '#c43a31',
    fontWeight: 900
  }
});
