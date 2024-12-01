interface AuthState {
    user: User | null;
    error: boolean;
}

export interface Action {
    type: string;
    payload?: User;
}

interface User {
    _id: string;
    username: string;
}

const AuthReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload!,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                error: true
            }
        case "LOGOUT":
            return {
                user: null,
                error: false
            }
        default:
            return state;
    }
}

export default AuthReducer;