import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken, setAuthLoading, clearAuth } from "../store/features/auth/authSlice";
import { refreshAccessToken, getCurrentAdmin } from "../services/authService";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const refreshResponse = await refreshAccessToken();

                const accessToken = refreshResponse.accessToken;

                if (!accessToken) {
                    throw new Error("Access token not received");
                }

                dispatch(setAccessToken(accessToken));

                const userResponse = await getCurrentAdmin();

                // Backend response: { success: true, user: {...} }
                const user = userResponse.user;

                if (!user) {
                    throw new Error("Admin details not received");
                }

                dispatch(setUser(user));
            } catch (error) {
                dispatch(clearAuth());
            } finally {
                dispatch(setAuthLoading(false));
            }
        };

        initializeAuth();
    }, [dispatch]);

    return children;
};

export default AuthInitializer;