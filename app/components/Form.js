import React, {useEffect, useState} from "react";
import {Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Button, Card, MD3Colors, ProgressBar, Text, TextInput} from "react-native-paper";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";

const Form = ({isLoginForm, switchAuthScreen, authenticateUser}) => {
    const [email, setEmail] = useState('test@gmail.com');
    const [password, setPassword] = useState('testst');
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    let interval;

    const handleAuth = async (authFunction) => {
        try {
            setIsLoading(true)
            interval = setInterval(() => {
                setProgress(progress + 0.5);
            }, 100);
            await authFunction();
            setError(null);
            authenticateUser(true);
            clearInterval(interval);
            setIsLoading(false);
        } catch (error) {
            clearInterval(interval);
            setIsLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                    case 'auth/invalid-login-credentials':
                    setError('Incorrect email or password.');
                    break;
                case 'auth/user-not-found':
                    setError('User not found. Please register.');
                    break;
                case 'auth/email-already-in-use':
                    setError('Email address is already in use.');
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
        }
    };

    const switchScreen = (value) => {
        setError(null);
        switchAuthScreen(value);
    }
    const handleLogin = () => {
        return handleAuth(() => signInWithEmailAndPassword(auth, email, password));
    };

    const handleSignup = () => {
        return handleAuth(() => createUserWithEmailAndPassword(auth, email, password));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    { isLoading? <ProgressBar progress={progress} color='#D4BAFF' />: null }
                    <Card.Title title={isLoginForm? 'LOGIN': 'SIGNUP'} />
                    <Card.Content>
                        {error ? <Text style={styles.error}>※ { error }</Text> : <Text />}
                        <TextInput style={styles.input} label="Email" mode="outlined" value={email} placeholder='Email' onChangeText={(text) => setEmail(text)} />
                        <TextInput style={styles.input} label="Password" mode="outlined" value={password} placeholder='Password' onChangeText={(text) => setPassword(text)} secureTextEntry={true} />
                        <Button dark={true} mode="contained" labelStyle={{fontWeight: 'bold'}} onPress={isLoginForm? handleLogin: handleSignup}>{isLoginForm? 'LOGIN': 'SIGNUP'}</Button>
                        <TouchableOpacity onPress={isLoginForm? () => switchScreen(false): () => switchScreen(true)}>
                            <Text style={styles.link}>{isLoginForm? 'create account': 'login'}</Text>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default Form;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%'
    },
    input: {
        marginBottom: 15
    },
    error: {
        color: 'red',
        marginBottom: 10
    },
    link: {
        color: '#248BF9',
        marginTop: 15
    },
});
