import {StyleSheet, View, FlatList, TouchableOpacity} from "react-native";
import {useIsFocused, useRoute} from '@react-navigation/native';
import { color } from "../config/color";
import {Searchbar} from "react-native-paper";
import {Text} from '@rneui/themed';
import React, {useEffect, useState} from "react";
import {font} from "../config/font";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "../../firebase";

const NoteListScreen = ({navigation}) => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);

    const route = useRoute();
    const { folderId } = route.params;

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
            where('uid', '==', auth.currentUser.uid),
            where('fid', '==', folderId)
        );
        getDocs(q)
            .then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
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
                onPress={() => navigation.navigate('NoteList', {folderId: item.id})}
            >
                <View style={styles.memoContainer}>
                    <Text h4 style={styles.noteName}>{item.content}</Text>
                    <Text style={styles.noteName}>Wednesday 10:05</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text h2 style={styles.notes}>Notes</Text>
            <Text h1 style={styles.edit}>+</Text>
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
    );
};

export default NoteListScreen;

// make one css file for notelistscreen and mainscreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: color.primary
    },
    notes: {
        color: color.secondary,
        fontWeight: 'bold',
        marginTop: 50
    },
    edit: {
        position: 'absolute',
        right: 30,
        bottom: 25,
        zIndex: 2,
        color: color.warning
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
        marginLeft: 10
    },
    memoCount: {
        color: 'gray',
        fontSize: font.md,
        textAlign: 'right'
    },
});
