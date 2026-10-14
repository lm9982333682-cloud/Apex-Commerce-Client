
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./router";
import "./index.css";
import { Provider } from 'react-redux'
import store from "./store/store";
import { ToastContainer } from "react-toastify";



createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
            <ToastContainer/>
        </Provider>

    </StrictMode>
);
