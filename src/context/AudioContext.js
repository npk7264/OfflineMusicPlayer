import React, { Component, createContext, useContext } from "react";
import { NotificationContext } from "./NotifyContext";
import { PlaylistContext } from "./PlaylistContext";
import { Audio } from "expo-av";
import { changeSong, selectSong } from "../utils/AudioController";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      songData: [],
      playbackObj: null,
      soundObj: null,
      currentAudio: null,
      currentAudioIndex: null,
      isPlaying: false,
      isLooping: false,
      playbackPosition: null,
      playbackDuration: null,
      timeEnd: null,
    };
  }


  static contextNotify = NotificationContext;
  static contextPlaylist = PlaylistContext;


  onPlaybackStatusUpdate = async (playbackStatus) => {
    // if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
    //   this.updateState(this, {
    //     playbackPosition: playbackStatus.positionMillis,
    //   });
    // }

    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      // this.updateState(this, {
      //   playbackPosition: playbackStatus.positionMillis,
      // });
    }

    if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
      console.log("FINISH:", this.state.currentAudio);
      await changeSong(
        { ...this.state, updateState: this.updateState },
        "next",
        this.contextPlaylist, this.contextNotify
      );
    }
    console.log("hjhj", this.state.timeEnd)
    const currentDate = new Date();
    console.log("🚀 ~ file: AudioContext.js:58 ~ AudioProvider ~ onPlaybackStatusUpdate= ~ this.state.isPlaying:", this.state.isPlaying)

    if (this.state.timeEnd !== null && this.state.timeEnd - currentDate <= 0) {
      if (this.state.isPlaying)
        await selectSong({ ...this.state, updateState: this.updateState }, this.state.currentAudio, this.state.songData, this.contextPlaylist, this.contextNotify)
      this.setState({ ...this.state, timeEnd: null })
    }
  };

  async componentDidMount() {
    // console.log('to context fetchSong');
    // const songs = await fetchSongs();

    // PHÁT NỀN
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    if (this.state.playbackObj === null) {
      this.setState({
        ...this.state,
        // songData: songs,
        playbackObj: new Audio.Sound(),
      });
    }
  }


  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      userId,
      songData,
      singerData,
      albumData,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      isLooping,
      playbackPosition,
      playbackDuration,
      timeEnd,
    } = this.state;

    return (
      <AudioContext.Provider
        value={{
          ...this.state,
          updateState: this.updateState,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
