import React, {useEffect, useState, useRef} from "react";
import {
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    FlatList
} from "react-native";
import {onAuthStateChanged, signOut} from 'firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import { Icon, Text } from '@rneui/themed';
import { collection, getDocs, deleteDoc, query, where, doc } from 'firebase/firestore';
import {auth, db} from '../../firebase';
import {color} from "../config/color";
import {font} from "../config/font";
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import FolderMenu from "../components/FolderMenu";

const MainScreen = ({ navigation }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [folders, setFolders] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigation.navigate('Login');
            }
        });
    
        if (isFocused) {
            fetchFolders();
        }
    
        return () => {
            unsubscribe();
        };
    }, [isFocused, navigation]);

    const handleSearch = (key) => {
        const result = folders.filter(folder => folder.name.toLowerCase().includes(key.toLowerCase()));
        setFilteredFolders(result);
    }

    const handleSignOut = async () => {
        await signOut(auth);
    }

    const fetchFolders = () => {
        const foldersRef = collection(db, 'folders');
        const q = query(foldersRef, where('uid', '==', auth.currentUser.uid));
        getDocs(q)
            .then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setFolders(data);
                setFilteredFolders(data);
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


    return (
        <View style={styles.container}>
            <Text h2 style={styles.folder}>Folders</Text>
            <Text h4 style={styles.edit}>Edit</Text>
            <TextInput
                style={styles.search}
                placeholder="Search"
                placeholderTextColor="gray"
                onChangeText={handleSearch}
            />
            <View style={styles.content}>
                <View style={styles.wrapper}>
                    <FlatList
                        data={filteredFolders}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => (
                            <LongPressGestureHandler
                                onHandlerStateChange={({ nativeEvent }) => {
                                    console.log(nativeEvent);
                                if (nativeEvent.state === State.ACTIVE) {
                                    setMenuVisible(true);
                                }
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('NoteList', { folderId: item.id })}
                                >
                                    <View style={styles.memoContainer}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Icon style={styles.icon} name='folder' color={color.warning} size={30} />
                                            <Text style={styles.folderName}>{item.name}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.memoCount}>30</Text>
                                        </View>
                                        <FolderMenu
                                            item={item}
                                            menuVisible={menuVisible}
                                            setMenuVisible={setMenuVisible}
                                            deleteFolder={deleteFolder}
                                            />
                                    </View>
                                </TouchableOpacity>
                            </LongPressGestureHandler>
                        )}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Folder')}>
                <Text>
                    <Icon style={styles.icon} name='create-new-folder' color={color.warning} size={35} />
                </Text>
            </TouchableOpacity>
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
    edit: {
        position: 'absolute',
        right: 20,
        top: 50,
        color: color.warning
    },
    search:{
        backgroundColor: color.charcoal,
        color: color.secondary,
        borderRadius:10,
        height:45,
        marginVertical:20,
        justifyContent:"center",
        paddingHorizontal:20
    },
    content: {
        flex: 1,
    },
    wrapper: {
      paddingHorizontal: 20,
      paddingTop: 5,
      marginBottom: 10,
      backgroundColor: color.charcoal,
      borderRadius:10,
    },
    memoContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: '#333337',
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
})
