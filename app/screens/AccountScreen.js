import React from "react";
import {View, Text} from "react-native";
import {signOut} from "firebase/auth";
import {auth} from "../../firebase";

const AccountScreen = () => {

    const logout = async() => {
        await signOut(auth);
    }

    return (
        <View style={{flex: 1, marginLeft: 30, marginTop: 70}}>
            <Text style={{fontWeight: 'bold', color: '#fff'}} onPress={logout}>LOGOUT</Text>
        </View>
    )
}

export default AccountScreen;
