import React, {useEffect, useState} from "react";
import {
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import {onAuthStateChanged, signOut} from 'firebase/auth';
import AddFolderModal from "../components/AddFolderModal";
import { Icon, Text } from '@rneui/themed';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {auth, db} from '../../firebase';
import {color} from "../config/color";
import {font} from "../config/font";

const MainScreen = ({ navigation }) => {
    const [folders, setFolders] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (!user) {
                navigation.navigate('Login');
            }
        });
    }, [navigation]);

    // useFocusEffect(
    //
    // );
    useEffect(() => {
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
        fetchFolders();
    }, [navigation]);

    const handleSearch = (key) => {
        const result = folders.filter(folder => folder.name.toLowerCase().includes(key.toLowerCase()));
        setFilteredFolders(result);
    }

    const handleSignOut = async () => {
        await signOut(auth);
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                <View style={styles.memoContainer}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon style={styles.icon} name='folder' color={color.warning} size={30} />
                                        <Text style={styles.memoTitle}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.memoCount}>25</Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={toggleModal}>
                    <Text>
                        <Icon style={styles.icon} name='create-new-folder' color={color.warning} size={35} />
                    </Text>
                </TouchableOpacity>
                <AddFolderModal isVisible={isModalVisible} toggleModal={toggleModal} />
            </View>
        </TouchableWithoutFeedback>
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
    memoTitle: {
        color: color.secondary,
        fontSize: font.md,
        marginLeft: 10
    },
    memoCount: {
        color: 'gray',
        fontSize: font.md
    },
})
