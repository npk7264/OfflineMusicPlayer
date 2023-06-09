import { FlatList, SafeAreaView } from "react-native";
import React, { useState, useContext } from "react";
import OptionModal from "./OptionModal";
import SongItem from "./SongItem";
import { optionSong } from "../utils/optionModal";

const FlatListSong = ({ songs, RenderMoreData, loadAll, handleLoadMore }) => {
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const renderMoreData = () => {
    if (RenderMoreData) {
      return <RenderMoreData loadAll={loadAll} handleLoadMore={handleLoadMore} />;
    }
    return null;
  };

  return (
    <>
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <SongItem
            info={item}
            onPressOptionModal={() => {
              setOptionModalVisible(true);
              setCurrentItem(item);
            }}
            data={songs}
          />
        )}
        ListFooterComponent={renderMoreData}
        keyExtractor={(item) => item.id}
      />
      <OptionModal
        type="song"
        options={optionSong}
        currentItem={currentItem}
        onClose={() => setOptionModalVisible(false)}
        visible={optionModalVisible}
      />
    </>
  );
};

export default FlatListSong;
