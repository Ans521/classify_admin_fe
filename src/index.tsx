import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserDocument from './component/userdocument/UserDocument';
import { IdProvider } from './component/context';
import { Sidebar } from 'lucide-react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './component/redux/store';
import AddProvider from './component/ProviderList/addProvider';
import ViewProvider from './component/ProviderList/viewProviders';
import PhoneVerification from './component/ProviderList/PhoneVerification';
import Category from './component/ProviderList/Category';
import BannerCategory from './component/ProviderList/banner';
import ProviderOffers from './component/offers/ProviderOffers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>
  }, 
  {
    path: "/login",
    // element: <loginPage />,
  },
  {
    path : "/document/:id",
    element : <UserDocument/>
  },
  {
    path : "/service-zone",
    element : <Sidebar/>
  },
  {
    path : "/service-provider/view",
    element : <ViewProvider/>
  },
  {
  path : "/service-provider/phone",
  element : <PhoneVerification/>
  },
  {
    path : "/service-provider/provider-add",
    element : <AddProvider/>
  },
  {
    path : "/service-provider/view/:id",
    element : <UserDocument/>
  },
  {
    path : "/category",
    element : <Category/>
  },
  {
    path : '/banner',
    element : <BannerCategory/>
  },
  {
    path : '/offers',
    element : <ProviderOffers/>
  }
])

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
    <IdProvider>
      <RouterProvider router={router}/>
    </IdProvider>
    </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
