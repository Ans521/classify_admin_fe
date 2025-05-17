import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserDocument from './component/userdocument/UserDocument';
import { IdProvider } from './component/context';
import { Phone, Sidebar } from 'lucide-react';
import AddProvider from './component/ProviderList/addProvider';
import ViewProvider from './component/ProviderList/viewProviders';
import PhoneVerification from './component/ProviderList/PhoneVerification';
import Category from './component/ProviderList/Category';
import BannerCategory from './component/ProviderList/banner';

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
    path : 'banner',
    element : <BannerCategory/>
   }
])

root.render(
  <React.StrictMode>
    <IdProvider>
      <RouterProvider router={router}/>
    </IdProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
