import "./themes.css";

//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseData";

//context
import GlobalContext from "./store/GlobalContext";

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//pages & loaders
import RootLayout, { rootLayoutLoader } from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect, useState } from "react";

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/", 
    element: <RootLayout/>, 
    children: [
      {index: true, element: <HomePage/>}, 
      {path: "/dash", element: <DashboardPage/>}
    ]
  }
]);

//Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
function App() {

  const [loading, setLoading] = useState(true); 

  //check signed in user, get settings
  useEffect(()=>{
    
  }, [])


  return (
    <GlobalContext>
      <RouterProvider router={router}/>
    </GlobalContext>
  );
}

export default App;
