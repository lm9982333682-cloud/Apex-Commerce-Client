
import { createBrowserRouter } from "react-router";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import AuthInitializer from "./components/AuthInitializer";


const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },


  {


    element: <AuthInitializer><MainLayout /> </AuthInitializer> ,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/products/add",
            element: <AddProduct />,
          },
          {
            path: "/products/:id",
            element: <ProductDetails />,
          },
          {
            path: "/products/:id/edit",
            element: <EditProduct />,
          },
          {
            path: "/orders",
            element: <Orders />,
          },
          {
            path: "/orders/:id",
            element: <OrderDetails />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/users/:id",
            element: <UserDetails />,
          },
          {
            path: "profile",
            element: <MyProfile />,
          }
        ],
      },
    ],
  },
]);

export default router;
