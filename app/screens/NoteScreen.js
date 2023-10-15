import {StyleSheet, View, TextInput} from "react-native";
import {useRoute} from '@react-navigation/native';
import { color } from "../config/color";
import React, {useRef, useState, useEffect} from "react";
import {collection, addDoc, getDoc, doc, updateDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../../firebase";
import TopBar from "../components/TopBar";
import moment from 'moment'

const NoteScreen = ({navigation}) => {
    const [note, setNote] = useState('');

    const noteInputRef = useRef(null);
    const notesRef = collection(db, 'notes');

    const route = useRoute();
    const { folderId, noteId } = route.params;

    useEffect(() => {
        if (noteId) {
            fetchNote();
        }

        if (noteInputRef.current) {
            noteInputRef.current.focus();
        }
    }, [navigation]);

    useEffect(() => {
        let content = note;
        const unsubscribe = navigation.addListener('blur', () => {
            updateNote(content);
        });
      
        return unsubscribe;
    }, [note]);

    const fetchNote = async () => {
        try {
            const noteRef = doc(notesRef, noteId);
            const note = (await getDoc(noteRef)).data();
            setNote(note.content);
        } catch (error) {
            console.error("Error fetching note: ", error);
        }
    };

    const updateNote = async (content) => {
        try {
            const notesRef = collection(db, 'notes');

            if (noteId) {
                const noteRef = doc(notesRef, noteId);

                const updatedNote = {
                    content: content,
                    updatedAt: moment.now()
                };
            
                await updateDoc(noteRef, updatedNote);
                return;
            }

            if (!content) {
                return;
            }
    
            const newNote = {
                fid: folderId,
                content: content,
                createdAt: moment.now(),
                updatedAt: moment.now()
            };
    
            await addDoc(notesRef, newNote);
        } catch (error) {
            console.error("Error adding note: ", error);
        }
    };

    return (
        <>
            <TopBar navigation={navigation} />
            <View style={styles.container}>
            <TextInput
                ref={noteInputRef}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setNote(text)}
                value={note}
                style={styles.note}
            />
            </View>
        </>
    );
};

export default NoteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: color.primary
    },
    note: {
        color: color.secondary,
        flex: 1,
        marginTop: 10
    },
});
