import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import {Icon, Text} from '@rneui/themed';
import {collection, deleteDoc, updateDoc, doc, getDocs, query, where, orderBy} from 'firebase/firestore';
import {auth, db} from '../../firebase';
import {color} from "../config/color";
import {font} from "../config/font";
import {Searchbar, Portal, Modal, Button, TextInput} from "react-native-paper";
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment'

const MainScreen = ({navigation}) => {
    const [folder, setFolder] = useState({});
    const [folders, setFolders] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);
    const [visible, setVisible] = React.useState(false);

    const isFocused = useIsFocused();
    const _swipeListView = useRef(null)

    useEffect(() => {
        if (isFocused) {
            fetchFolders();
        }
    }, [isFocused, navigation]);

    const handleSearch = (key) => {
        const result = folders.filter(folder => folder.name.toLowerCase().includes(key.toLowerCase()));
        setFilteredFolders(result);
    }

    const fetchFolders = () => {
        const foldersRef = collection(db, 'folders');
        const notesRef = collection(db, 'notes');

        const q = query(foldersRef, where('uid', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'));
        getDocs(q)
            .then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
                    const q2 = query(notesRef, where('fid', '==', doc.id));
                    getDocs(q2)
                        .then((querySnapshot) => {
                            data.push({
                                id: doc.id,
                                total: querySnapshot.size,
                                ...doc.data()
                            });
                            setFolders(data);
                            setFilteredFolders(data);
                        })
                        .catch(error => {
                            console.error('Error fetching folders:', error);
                    });
                });
            }).catch(error => {
            console.error('Error fetching folders:', error);
        });
    }

    const deleteFolder = (folderId) => {
        const foldersRef = collection(db, 'folders');
        deleteDoc(doc(foldersRef, folderId))
            .then(() => {
                fetchFolders();
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
            });
    };

    const updateFolder = () => {
        const foldersRef = collection(db, 'folders');
        const folderRef = doc(foldersRef, folder.id);

        const updatedFolder = {
            name: folder.name,
            updatedAt: moment.now()
        };
    
        updateDoc(folderRef, updatedFolder)
            .then(() => {
                fetchFolders();
                setFolder({});
                setVisible(false);
                if (_swipeListView.current) {
                    _swipeListView.current.closeAllOpenRows();
                }
            })
            .catch((error) => {
                console.error('Error updating folder: ', error);
            });
          
    };

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('NoteList', {folderName: item.name, folderId: item.id, title: 'Folders'})}
                activeOpacity={1}
            >
                <View style={styles.memoContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon style={styles.icon} name='folder' color={color.warning} size={30}/>
                        <Text style={styles.folderName}>{item.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.memoCount}>{item.total}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text h2 style={styles.folder}>Folders</Text>
            <Searchbar
                style={styles.search}
                placeholder="Search"
                onChangeText={handleSearch}
            />
            <View style={styles.content}>
                <View style={styles.wrapper}>
                    <SwipeListView
                        ref={_swipeListView}
                        data={filteredFolders}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        renderHiddenItem={(data) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity onPress={() => {
                                    setFolder(data.item);
                                    setVisible(true);
                                }}>
                                    <Text style={styles.editBtn}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteFolder(data.item.id)}>
                                    <Text style={styles.deleteBtn}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Folder')}>
                <Text>
                    <Icon style={styles.icon} name='create-new-folder' color={color.warning} size={35}/>
                </Text>
            </TouchableOpacity>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
                    <TextInput
                        label="Folder Name"
                        value={folder.name}
                        onChangeText={text => {
                            let changedFolder = {...folder, name: text};
                            setFolder(changedFolder);
                        }}
                        style={styles.renameFolderInput}
                        autoFocus={true}
                    />
                    <Button style={styles.saveFolder} dark={true} mode="contained" labelStyle={{fontWeight: 'bold'}} onPress={updateFolder}>SAVE</Button>
                </Modal>
            </Portal>
        </View>
    )
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: color.primary
    },
    folder: {
        color: color.secondary,
        fontWeight: 'bold',
        marginTop: 50
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
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: '#333337',
        backgroundColor: color.charcoal,
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    folderName: {
        color: color.secondary,
        fontSize: font.md,
        marginLeft: 10
    },
    memoCount: {
        color: 'gray',
        fontSize: font.md,
        textAlign: 'right'
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editBtn: {
        color: color.secondary,
        backgroundColor: '#7D3C98',
        paddingVertical: 17,
        paddingHorizontal: 30
    },
    deleteBtn: {
        color: color.secondary,
        backgroundColor: '#C70039',
        paddingVertical: 17,
        paddingHorizontal: 20
    },
    renameFolderInput: {
        width: '100%',
    },
    saveFolder: {
        width: '100%',
        marginTop: 10
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: 'white',
        width: '60%'
}
})
