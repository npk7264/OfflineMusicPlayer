import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import BackBar from '../../components/BackBar'
import MiniPlayer from '../../components/MiniPlayer'
import FlatListSong from '../../components/FlatListSong'
import { ThemeContext } from '../../context/ThemeContext';
import { AudioContext } from '../../context/AudioContext';
import { fetchTopSongByGenre, fetchSongByIDGenre } from '../../utils/FirebaseHandler';

const GenreDetail = ({ route }) => {
    const { colors, language } = useContext(ThemeContext);
    const { currentAudio } = useContext(AudioContext);
    const [listSong, setListSong] = useState([]);

    const { id, name, image, type } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            const data = (type === "top") ? await fetchTopSongByGenre(id, 10) : await fetchSongByIDGenre(id);
            setListSong(data);
        }
        fetchData();
    }, [])

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <BackBar isSearch={true}></BackBar>
            <View style={styles.header}>
                {/* info Genre */}
                <Image
                    source={{ uri: image }}
                    style={styles.poster} />
                <Text style={[styles.nameGenre, { color: colors.text }]}>{name?.search("Top") === true ? name : `Nhạc ${name}`}</Text>
                <Text style={styles.numSong}>{listSong?.length + " " + language.song} </Text>
                {/* button */}
                <View style={styles.buttons}>
                    {/* <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                        <Ionicons name='shuffle' size={20} color='white' />
                        <Text style={[styles.buttonText, { color: 'white' }]}>Shuffle</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.frame }]}>
                        <Ionicons name='play-circle' size={20} color={colors.primary} />
                        <Text style={[styles.buttonText, { color: colors.primary }]}>{language.play}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* line */}
            <View style={styles.line}></View>

            {/* list song */}
            <FlatListSong
                songs={listSong}
            />
            {currentAudio && <MiniPlayer />}

        </SafeAreaView>
    )
}

export default GenreDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        // flex: 1,
        marginTop: 10,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    poster: {
        width: 200,
        height: 200,
        borderRadius: 35,
    },
    nameGenre: {
        fontSize: 28,
        fontWeight: '900',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 40,
        fontFamily: 'sans-serif',
    },
    numSong: {
        fontSize: 15,
        marginTop: 10,
        color: 'gray',
        fontFamily: 'sans-serif',
    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
    },
    button: {
        height: 45,
        width: 160,
        backgroundColor: '#ff973e',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    line: {
        borderColor: '#efefef',
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 25,
    },
})