import { onAuthStateChanged } from 'firebase/auth';
import { PaperProvider, MD2DarkTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { auth } from './firebase';
import Loader from './app/components/Loader';
import Home from "./app/components/Home";
import AuthScreen from "./app/screens/AuthScreen";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setIsLoggedIn(false)

            if (authUser) {
                setIsLoggedIn(true);
            }
        });

        return () => unsubscribe();
    }, []);

    const authenticateUser = (isAuthenticated) => {
        setIsLoggedIn(isAuthenticated);
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
