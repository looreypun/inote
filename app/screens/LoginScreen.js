import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, Input, Text} from "@rneui/themed";
import {auth} from '../../firebase';
import {color} from "../config/color";

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('test@gmail.com');
    const [password, setPassword] = useState('testst');
    const [error, setError] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate('Main');
            }
        });
    }, []);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
            setError(null);
            navigation.navigate('Main');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/user-not-found':
                    setError('User not found. Please register.');
                    break;
                default:
                    setError(errorMessage);
                    break;
            }
        });
    };

    const handleSignup = () => {
        navigation.navigate('Signup');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text h4 style={styles.title}>LOGIN</Text>
                    {error ? <Text style={styles.error}>※ { error }</Text> : <Text />}
                    <Input value={email} placeholder='Email' onChangeText={(text) => setEmail(text)} />
                    <Input value={password} placeholder='Password' onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
                    <Button radius={"md"} color={color.primary} onPress={handleLogin}>LOGIN</Button>
                    <TouchableOpacity onPress={handleSignup}>
                        <Text style={styles.signin}>create account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontWeight: "bold"
    },
    error: {
        color: 'red',
    },
    center: {
        width: '80%'
    },
    signin: {
        color: '#248BF9',
        marginTop: 15
    }
});
