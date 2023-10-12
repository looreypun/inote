import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {auth} from '../../firebase';
import {Button, Input, Text} from "@rneui/themed";
import {color} from "../config/color";

function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate('Main');
            }
        });
    }, []);

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
            setError(null);
            navigation.navigate('Main');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/email-already-in-use':
                    setError('Email address is already in use.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                    case 'auth/missing-password':
                    setError('Invalid password.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Account creation is currently not allowed.');
                    break;
                case 'auth/weak-password':
                    setError('Weak password. Password must be at least 6 characters long.');
                    break;
                default:
                    setError(errorMessage); // Handle other errors
                    break;
            }
        });
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text h4 style={styles.title}>SIGNUP</Text>
                    {error ? <Text style={styles.error}>※ { error }</Text> : <Text />}
                    <Input value={email} placeholder='Email' onChangeText={(text) => setEmail(text)} />
                    <Input value={password} placeholder='Password' onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
                    <Button radius={"md"} color={color.primary} onPress={handleSignup}>SINGUP</Button>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.login}>login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title:{
        fontWeight: "bold",
    },
    error: {
        color: 'red',
    },
    center: {
        width: '80%'
    },
    login: {
        color: '#248BF9',
        marginTop: 15
    }
});
