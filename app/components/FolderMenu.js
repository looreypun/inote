import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import {signOut} from 'firebase/auth';
import {auth} from '../../firebase';

const FolderMenu = ({ item, menuVisible, setMenuVisible, deleteFolder }) => {
    if (!item || !menuVisible) {
        return null;
    }

    const removeFolder = (id) => {
        deleteFolder(id);
        setMenuVisible(false);
    }

    const logout = async() => {
        await signOut(auth);
        setMenuVisible(false);
    }

    return (
        <Modal
            visible={menuVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
                setMenuVisible(false);
            }}
        >
            <View style={styles.modal}>
                <View>
                    <Text style={styles.menuItem} onPress={() => removeFolder(item.id)}>
                        Delete
                    </Text>
                    <Text style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                        Cancel
                    </Text>
                    <Text style={styles.menuItem} onPress={logout}>
                        Logout
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

export default FolderMenu;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    menuItem: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
});
