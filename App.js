import { onAuthStateChanged } from 'firebase/auth';
import { PaperProvider, MD2DarkTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { auth } from './firebase';
import Home from "./app/components/Home";
import AuthScreen from "./app/screens/AuthScreen";
import Loader from './app/components/Loader';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setIsLoggedIn(false)

            if (authUser) {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authenticateUser = (isAuthenticated) => {
        setIsLoggedIn(isAuthenticated);
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <PaperProvider theme={MD2DarkTheme}>
            {
                isLoggedIn
                    ? <Home />
                    : <AuthScreen authenticateUser={authenticateUser} />
            }
        </PaperProvider>
    );
}
