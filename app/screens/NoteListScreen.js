import {StyleSheet, View, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback} from "react-native";
import {useIsFocused, useRoute} from '@react-navigation/native';
import { color } from "../config/color";
import {Searchbar, FAB} from "react-native-paper";
import {Text} from '@rneui/themed';
import React, {useEffect, useState} from "react";
import {collection, getDocs, query, where, orderBy} from "firebase/firestore";
import {db} from "../../firebase";
import TopBar from "../components/TopBar";
import moment from 'moment'

const NoteListScreen = ({navigation}) => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);

    const route = useRoute();
    const { folderName, folderId } = route.params;

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchNotes();
        }
    }, [isFocused, navigation]);

    const fetchNotes = () => {
        const notesRef = collection(db, 'notes');
        const q = query(
            notesRef,
            where('fid', '==', folderId),
            orderBy('updatedAt', 'desc')
        );

        getDocs(q)
            .then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
                    const res = doc.data();
                    data.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setNotes(data);
                setFilteredNotes(data);
            }).catch(error => {
            console.error('Error fetching folders:', error);
        });
    }

    const handleSearch = (key) => {
        const result = notes.filter(note => note.name.toLowerCase().includes(key.toLowerCase()));
        setFilteredNotes(result);
    }

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onLongPress={() => openContextMenu(item)}
                onPress={() => navigation.navigate('Note', {folderId: folderId, noteId: item.id, title: folderName })}
            >
                <View style={styles.memoContainer}>
                    <View>
                        <Text h4 style={styles.noteName}>{item.content.split('\n')[0]}</Text>
                        <Text style={styles.noteName}>{moment(item.updatedAt).format('YYYY/MM/DD')}</Text>
                    </View>
                    {/* <View>
                    <Icon name='delete' color='red' size={30}/>
                    </View> */}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <TopBar navigation={navigation} />
            <View style={styles.container}>
                <Text h2 style={styles.notes}>{folderName}</Text>
                <FAB
                    icon="plus"
                    size="small"
                    style={styles.fab}
                    onPress={() => navigation.navigate('Note', { folderId: folderId, title: folderName })}
                />
                <Searchbar
                    style={styles.search}
                    placeholder="Search"
                    onChangeText={handleSearch}
                />
                <View style={styles.content}>
                    <View style={styles.wrapper}>
                        <FlatList
                            data={filteredNotes}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

export default NoteListScreen;

// make one css file for notelistscreen and mainscreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: color.primary
    },
    notes: {
        color: color.secondary,
        fontWeight: 'bold',
        marginTop: 10
    },
    fab: {
        borderRadius: 10,
        backgroundColor: '#248BF9',
        position: 'absolute',
        margin: 16,
        right: 15,
        bottom: 5,
        zIndex: 1
      },
    search: {
        backgroundColor: color.charcoal,
        borderRadius: 10,
        marginVertical: 20,
    },
    content: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 5,
        marginBottom: 10,
        backgroundColor: color.charcoal,
        borderRadius: 10,
    },
    memoContainer: {
        borderBottomColor: '#333337',
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    noteName: {
        color: color.secondary,
        marginLeft: 10,
        marginBottom: 5
    }
});
