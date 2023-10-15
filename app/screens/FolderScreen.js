import React, {useState} from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import {collection, addDoc} from "firebase/firestore";
import {auth, db} from '../../firebase';
import {color} from "../config/color";
import Loader from '../components/Loader';
import moment from 'moment';

const AddFolderModal = ({ navigation }) => {
    const [folderName, setFolderName] = useState('New Folder');
    const [isLoading, setIsLoading] = useState(false);

    const createFolder = () => {
        if (!folderName) {
            alert('Folder name is empty');
            return;
        }
        setIsLoading(true);
        const newFolder = {
            name: folderName,
            uid: auth.currentUser.uid,
            createdAt: moment.now(),
            updatedAt: moment.now()
        };

        const foldersRef = collection(db, 'folders');

        addDoc(foldersRef, newFolder)
            .then((docRef) => {
                setIsLoading(false);
                navigation.navigate('Main');
            })
            .catch((error) => {
                alert('Something went wrong');
            });
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }

    return (
        <View style={styles.content}>
            <View style={styles.header}>
                <Text h4 style={styles.cancel} onPress={() => navigation.navigate('Main')}>Cancel</Text>
                <Text h4 style={styles.folder}>New Folder</Text>
                <Text h4 style={styles.done} onPress={createFolder}>Done</Text>
            </View>
            <TextInput
                style={styles.input}
                value={folderName}
                onChangeText={text => setFolderName(text)}
                autoFocus={true}
            />
        </View>
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
