import { updateRecent, updateRecentestPositon } from "./FirebaseHandler";

// play audio
export const play = async (playbackObj, uri, lastPosition) => {
  console.log("🚀 ~ file: AudioController.js:5 ~ play ~ lastPosition:", lastPosition)
  try {
    if (!lastPosition)
      return await playbackObj.loadAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
      );

    // but if there is lastPosition then we will play audio from the lastPosition
    await playbackObj.loadAsync(
      { uri },
      { progressUpdateIntervalMillis: 1000 }
    );

    return await playbackObj.playFromPositionAsync(lastPosition);
  } catch (error) {
    console.log("error inside play helper method", error.message);
  }
};

// pause audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error inside pause helper method", error.message);
  }
};

// resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error inside resume helper method", error.message);
  }
};

// select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return play(playbackObj, uri);
  } catch (error) {
    console.log("error inside playNext helper method", error.message);
  }
};

export const selectSong = async (
  context,
  audio,
  songData,
  contextPlaylist,
  contextNotify
) => {
  const {
    userId,
    // songData,
    soundObj,
    playbackObj,
    currentAudio,
    currentAudioIndex,
    isPlaying,
    updateState,
    onPlaybackStatusUpdate,
    playbackPosition,
  } = context;

  const { pushNotification, setActionPrev, setAction, setActionNext } =
    contextNotify;
  const { recentID, setRecentID, recentData, setRecentData } = contextPlaylist;

  // handle Notification play/pause

  let pauseFunction = async () => {
    pushNotification({
      title: audio.name + " - " + audio.singer.name,
      isPlay: false,
    });
    const status = await pause(playbackObj);
    const index = songData?.findIndex(({ id }) => id === audio.id);
    updateState(context, {
      currentAudio: audio,
      currentAudioIndex: index,
      songData: songData,
      soundObj: status,
      isPlaying: false,
      playbackPosition: status.positionMillis,
    });
    updateRecentestPositon(
      userId,
      status.positionMillis,
      status.durationMillis
    );
    // setActionNext(() => nextFunction);
    setAction(() => resumeFunction);
    // setActionNext(() => nextFunction);
    return;
  };

  let resumeFunction = async () => {
    pushNotification({
      title: audio.name + " - " + audio.singer.name,
      isPlay: true,
    });
    const status = await resume(playbackObj);
    const index = songData?.findIndex(({ id }) => id === audio.id);
    updateState(context, {
      currentAudio: audio,
      currentAudioIndex: index,
      songData: songData,
      soundObj: status,
      isPlaying: true,
    });
    // setActionNext(() => nextFunction);
    setAction(() => pauseFunction);
    // setActionNext(() => nextFunction);
    return;
  };

  let prevFunction = async () => {
    console.log("prevFunction");
    return;
  };

  let nextFunction = async () => {
    console.log("nextFunction");
    return;
  };

  try {
    // playing audio for the first time.
    if (soundObj === null) {
      console.log("114 audioControler: playing audio for the first time.");
      const status = await play(
        playbackObj,
        audio.uri,
        currentAudio ? (audio.id == currentAudio.id ? playbackPosition : 0) : 0
      );
      const index = songData?.findIndex(({ id }) => id === audio.id);
      console.log(index);
      updateState(context, {
        currentAudio: audio,
        currentAudioIndex: index,
        soundObj: status,
        songData: songData,
        isPlaying: true,
        playbackDuration: status.durationMillis,
        playbackPosition: 0,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      // updateRecent(userId, audio.id);
      pushNotification({
        title: audio.name + " - " + audio.singer.name,
        isPlay: true,
      });
      setActionPrev(() => prevFunction);
      setAction(() => pauseFunction);
      setActionNext(() => nextFunction);

      updateRecent(
        userId,
        audio.id,
        audio,
        recentID,
        setRecentID,
        recentData,
        setRecentData
      );

      return;
    }

    // pause audio
    if (isPlaying && currentAudio.id === audio.id) {
      console.log("182 audioControler: pause audio");

      const status = await pause(playbackObj);
      updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
      updateRecentestPositon(
        userId,
        status.positionMillis,
        status.durationMillis
      );
      pushNotification({
        title: audio.name + " - " + audio.singer.name,
        isPlay: false,
      });
      setAction(() => resumeFunction);
      // setActionNext(() => nextFunction);
      return;
    }

    // resume audio
    if (!isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      updateState(context, { soundObj: status, isPlaying: true });
      pushNotification({
        title: audio.name + " - " + audio.singer.name,
        isPlay: true,
      });
      setAction(() => pauseFunction);
      // setActionNext(() => nextFunction);
      return;
    }

    // select another audio
    if (currentAudio.id !== audio.id) {
      console.log("219 audioControler: select another audio");

      const status = await playNext(playbackObj, audio.uri);
      const index = songData.findIndex(({ id }) => id === audio.id);
      console.log("select another audio", index);
      updateState(context, {
        currentAudio: audio,
        currentAudioIndex: index,
        soundObj: status,
        isPlaying: true,
        songData: songData,
        isLooping: false,
        playbackDuration: status.durationMillis,
        playbackPosition: 0,
      });

      // updateRecent(userId, audio.id);
      pushNotification({
        title: audio.name + " - " + audio.singer.name,
        isPlay: true,
      });
      setActionPrev(() => prevFunction);
      setAction(() => pauseFunction);
      setActionNext(() => nextFunction);

      // updateRecent(userId, audio.id);
      updateRecent(
        userId,
        audio.id,
        audio,
        recentID,
        setRecentID,
        recentData,
        setRecentData
      );

      return;
    }
  } catch (error) {
    console.log("error inside select audio method.", error.message);
  }
};

export const changeSong = async (
  context,
  option,
  contextPlaylist,
  contextNotify
) => {
  const {
    userId,
    songData,
    soundObj,
    playbackObj,
    currentAudio,
    currentAudioIndex,
    isPlaying,
    updateState,
  } = context;
  const { pushNotification, setActionPrev, setAction, setActionNext } =
    contextNotify;

  const { recentID, setRecentID, recentData, setRecentData } = contextPlaylist;

  let nextIndex;

  // set next/previous song
  if (option == "next") {
    const temp = currentAudioIndex + 1;
    nextIndex = temp < songData.length ? temp : 0;
  } else if (option == "previous") {
    const temp = currentAudioIndex - 1;
    nextIndex = temp >= 0 ? temp : songData.length - 1;
  }

  // play new song
  try {
    const nextAudio = songData[nextIndex];
    const status = await playNext(playbackObj, nextAudio.uri);
    updateState(context, {
      currentAudio: nextAudio,
      currentAudioIndex: nextIndex,
      soundObj: status,
      isPlaying: true,
      isLooping: false,
      playbackDuration: status.durationMillis,
    });

    updateRecent(
      userId,
      nextAudio.id,
      nextAudio,
      recentID,
      setRecentID,
      recentData,
      setRecentData
    );

    // updateRecent(userId, nextAudio.id);
    pushNotification({
      title: nextAudio.name + " - " + nextAudio.singer.name,
      isPlay: true,
    });

    let pauseFunction = async () => {
      pushNotification({
        title: nextAudio.name + " - " + nextAudio.singer.name,
        isPlay: false,
      });
      const status = await pause(playbackObj);
      const index = songData?.findIndex(({ id }) => id === nextAudio.id);
      updateState(context, {
        currentAudio: nextAudio,
        currentAudioIndex: index,
        songData: songData,
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
        playbackDuration: status.durationMillis,
      });
      updateRecentestPositon(
        userId,
        status.positionMillis,
        status.durationMillis
      );
      setAction(() => resumeFunction);
      setActionNext(() => nextFunction);
      return;
    };

    let resumeFunction = async () => {
      pushNotification({
        title: nextAudio.name + " - " + nextAudio.singer.name,
        isPlay: true,
      });
      const status = await resume(playbackObj);
      const index = songData?.findIndex(({ id }) => id === nextAudio.id);
      updateState(context, {
        currentAudio: nextAudio,
        currentAudioIndex: index,
        songData: songData,
        soundObj: status,
        isPlaying: true,
        playbackDuration: status.durationMillis,
      });
      setAction(() => pauseFunction);
      setActionNext(() => nextFunction);
      return;
    };

    let prevFunction = async () => {
      console.log("prevFunction");
      return;
    };

    let nextFunction = async () => {
      console.log("nextFunction");
      return;
    };

    setAction(() => pauseFunction);
    // setActionNext(() => nextFunction);

    return;
  } catch (e) {
    console.log("error inside change audio method", e);
  }
};
