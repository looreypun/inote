import React, {useEffect, useRef, useState} from 'react';
import { View, Modal, TextInput, StyleSheet } from 'react-native';
import {collection, addDoc} from "firebase/firestore";
import { Icon, Text } from '@rneui/themed';
import {auth, db} from '../../firebase';
import {color} from "../config/color";

const AddFolderModal = ({ isVisible, toggleModal }) => {
    const [folderName, setFolderName] = useState('New Folder');

    const folderNameInputRef = useRef(null);

    useEffect(() => {
        if (folderNameInputRef.current) {
            folderNameInputRef.current.focus();
        }
    }, [isVisible]);

    const createFolder = () => {
        const newFolder = {
            name: folderName,
            uid: auth.currentUser.uid
        };

        const foldersRef = collection(db, 'folders');

        addDoc(foldersRef, newFolder)
            .then((docRef) => {
                toggleModal();
            })
            .catch((error) => {
                alert('Something went wrong');
            });
    };

    return (
        <Modal visible={isVisible} animationType="slideInUp">
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text h4 style={styles.cancel} onPress={toggleModal}>Cancel</Text>
                    <Text h4 style={styles.folder}>New Folder</Text>
                    <Text h4 style={styles.done} onPress={createFolder}>Done</Text>
                </View>
                <TextInput
                    ref={folderNameInputRef}
                    style={styles.input}
                    value={folderName}
                    onChangeText={text => setFolderName(text)}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: color.primary,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    cancel: {
        color: color.warning,
    },
    folder: {
        color: color.secondary,
        fontWeight: 'bold'
    },
    done: {
        color: color.warning,
    },
    input: {
        backgroundColor: color.charcoal,
        color: color.secondary,
        borderRadius:10,
        height:45,
        marginVertical:20,
        justifyContent:"center",
        paddingHorizontal:20
    },
});

export default AddFolderModal;
