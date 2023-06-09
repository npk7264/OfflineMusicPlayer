import React, { createContext, useState, useEffect } from 'react';
import { loadSongs, loadSinger, loadAlbum } from '../utils/FirebaseHandler';
export const DataContext = createContext();

export const DataProvider = ({ children, songData, singerData, albumData, genreData, lastSong, lastSinger, lastAlbum }) => {
    const [listGenre, setListGenre] = useState(genreData || []);
    const [listSong, setListSong] = useState(songData || []);
    const [loadedAllSongs, setLoadedAllSongs] = useState(false);
    const [listSinger, setListSinger] = useState(singerData || []);
    const [loadedAllSinger, setLoadedAllSinger] = useState(false);
    const [listAlbum, setListAlbum] = useState(albumData || []);
    const [loadedAllAlbum, setLoadedAllAlbum] = useState(false);
    const [lastVisibleSong, setLastVisibleSong] = useState(lastSong || null);
    const [lastVisibleSinger, setLastVisibleSinger] = useState(lastSinger || null);
    const [lastVisibleAlbum, setLastVisibleAlbum] = useState(lastAlbum || null);


    const [suggestData, setSuggestData] = useState([]); //các bài hát của trang khám phá danh mục gợi ý
    const [listIDArtistFollowing, setListIDArtistFollowing] = useState([]);// các id ca sĩ user đang theo dõi
    const [ArtistFollowing, setArtistFollowing] = useState([])// info các các sĩ được user theo dõi
    //load more Data
    const LoadMoreData = async (listData, limit, lastVisibleData, setLoadAll, setLastVisible, setListData, loadFunction) => {
        const [newListData, lastVisible] = await loadFunction(listData, limit, lastVisibleData);
        if (newListData.length < limit)
            setLoadAll(true);
        setLastVisible(lastVisible);
        setListData([...listData, ...newListData]);
    }
    // event press moreSong
    const handleLoadMoreSong = async () => {
        const limitSong = 10;
        await LoadMoreData(listSong, limitSong, lastVisibleSong, setLoadedAllSongs, setLastVisibleSong, setListSong, loadSongs);
    }
    // event press more singer
    const handleLoadMoreSinger = async () => {
        const limitSinger = 5;
        await LoadMoreData(listSinger, limitSinger, lastVisibleSinger, setLoadedAllSinger, setLastVisibleSinger, setListSinger, loadSinger);
    }

    //event press more album
    const handleLoadMoreAlbum = async () => {
        const limitAlbum = 10;
        await LoadMoreData(listAlbum, limitAlbum, lastVisibleAlbum, setLoadedAllAlbum, setLastVisibleAlbum, setListAlbum, loadAlbum);
    }

    const data = {
        ArtistFollowing,
        listIDArtistFollowing,
        listGenre: listGenre,
        listSong: listSong,
        loadedAllSongs: loadedAllSongs,
        listAlbum: listAlbum,
        loadedAllAlbum: loadedAllAlbum,
        listSinger: listSinger,
        loadedAllSinger: loadedAllSinger,
        suggestData: suggestData,
        setArtistFollowing,
        setListIDArtistFollowing,
        setSuggestData,
        setListSinger,
        setListSong,
        setListAlbum,
        handleLoadMoreSong,
        handleLoadMoreSinger,
        handleLoadMoreAlbum,
    };

    return (
        <DataContext.Provider value={data}>{children}</DataContext.Provider>
    );
};
