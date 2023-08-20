import "./themes.css";

//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseData";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//context
import GlobalContext from "./store/GlobalContext";

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//pages & loaders
import RootLayout, { rootLayoutLoader } from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect, useState } from "react";

//other
import LoaderFullPage from "./components/UI/LoaderFullPage";

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/dash", element: <DashboardPage /> },
    ],
  },
]);

//Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
function App() {
  const [loading, setLoading] = useState(true);

  //check signed in user, get settings
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user is signed in, id:", uid);
        //get & set settings in context
        setLoading(false);
      } else {
        console.log("user is NOT signed in");
        setLoading(false);
      }
    });
  }, []);

  return (
    <GlobalContext>
      {loading ? <LoaderFullPage /> : <RouterProvider router={router} />}
    </GlobalContext>
  );
}

export default App;
