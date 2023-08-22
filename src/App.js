import "./themes.css";

//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseData";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//context
import GlobalContext from "./store/GlobalContext";

//router
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

//pages & loaders
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ListsPage from "./pages/ListsPage"
import ViewSingleListPage from "./pages/ViewSingleListPage"
import AddPage from "./pages/AddPage"
import EditListsPage from "./pages/EditListsPage";
import EditSingleListPage from "./pages/EditSingleListPage";

//other
import LoaderFullPage from "./components/UI/LoaderFullPage";
import { useEffect, useState } from "react";
import EditShopsPage from "./pages/EditShopsPage";

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/dash", element: <DashboardPage /> },
      { path: "/lists", element: <ListsPage/>}, 
      { path: "/lists/:listId", element: <ViewSingleListPage/>},
      { path: "/add", element: <AddPage/>},
      { path: "/edit", element: <Navigate to={"/edit/lists"}/>}, 
      { path: "/edit/lists", element: <EditListsPage/>}, 
      { path: "/edit/lists/:listId", element: <EditSingleListPage/>}, 
      { path: "/edit/shops", element: <EditShopsPage/>},
    ],
  },
]);

//Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
//icons: 
//house: <i class="fa-solid fa-house-chimney-window"></i>
//list: <i class="fa-solid fa-list-ul"></i>
//plus: <i class="fa-solid fa-plus"></i>
//edit: <i class="fa-solid fa-pen-to-square"></i>
//user: <i class="fa-solid fa-user"></i>
//settings: <i class="fa-solid fa-gear"></i>
//check: <i class="fa-solid fa-check"></i>
//x: <i class="fa-solid fa-xmark"></i>
//trash <i class="fa-solid fa-trash"></i>
//dots vert: <i class="fa-solid fa-ellipsis-vertical"></i>
function App() {
  const [isLoading, setIsLoading] = useState(true);

  //check signed in user, get settings
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user is signed in, id:", uid);
        //get & set settings in context
        setIsLoading(false);
      } else {
        console.log("user is NOT signed in");
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <GlobalContext>
      <LoaderFullPage in={isLoading}/>
      <RouterProvider router={router} />
    </GlobalContext>
  );
}

export default App;
