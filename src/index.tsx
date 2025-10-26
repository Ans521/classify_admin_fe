import React from 'react';
import ReactDOM from 'react-dom/client';
import './../src/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserDocument from './component/userdocument/UserDocument';
import { IdProvider } from './component/context';
import { Sidebar, User } from 'lucide-react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './component/redux/store';
import AddProvider from './component/ProviderList/addProvider';
import ViewProvider from './component/ProviderList/viewProviders';
import PhoneVerification from './component/ProviderList/PhoneVerification';
import Category from './component/ProviderList/Category';
import BannerCategory from './component/ProviderList/banner';
import ProviderOffers from './component/offers/ProviderOffers';
import Auth from './component/auth/Auth';
import PrivateRoute from './component/auth/privateRoute';
import GeneralNotify from './component/ProviderList/generalNotify';
import UserView from './component/users/UserView';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path:"/auth",
    element: <Auth />,
  },
  {
    path: '/',
    element : <PrivateRoute element={<App/>}/>
  },  
  {
    path : "/document/:id",
    element :  <PrivateRoute element={<UserDocument/>}/>
  },
  {
    path : "/service-zone",
    element :  <PrivateRoute element={<Sidebar/>} />
  },
  {
    path : "/service-provider/view",
    element :  <PrivateRoute element={<ViewProvider/>}/>
  },
  {
  path : "/service-provider/phone",
  element :  <PrivateRoute element={<PhoneVerification/>}/>
  },
  {
    path : "/service-provider/provider-add",  
    element :  <PrivateRoute element={<AddProvider/>}/>
  },
  {
    path : "/service-provider/view/:id",
    element : <PrivateRoute element={ <UserDocument/>}  />
  },
  {
    path : "/category",
    element :  <PrivateRoute element={<Category/>}/>
  },
  {
    path : "/banner",
    element :  <PrivateRoute element={<BannerCategory/>}/>
  },
  {
    path : "/offers",
    element :  <PrivateRoute element={<ProviderOffers/>} path='/offers'/>
  },
  {
    path : '/general-notify',
    element : <PrivateRoute element={<GeneralNotify/>}/>
  },
  {
    path : '/all-users',
    element : <PrivateRoute element={<UserView/>}/>
  }
])

root.render(
    <ReduxProvider store={store}>
    <IdProvider>
      <RouterProvider router={router}/>
    </IdProvider>
    </ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
