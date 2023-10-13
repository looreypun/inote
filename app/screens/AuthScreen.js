import React, { useState } from 'react';
import Form from "../components/Form";

const AuthScreen = ({authenticateUser}) => {
    const [isLoginForm, setIsLoginForm] = useState(true);

    const switchAuthScreen = (value) => {
        setIsLoginForm(value);
    }

    return <Form
        isLoginForm={isLoginForm}
        switchAuthScreen={switchAuthScreen}
        authenticateUser={
            (isAuthenticated) => authenticateUser(isAuthenticated)
        }
    />
}

export default AuthScreen;
