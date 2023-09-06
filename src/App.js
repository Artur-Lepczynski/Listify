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
import DashboardPage, { DashboardPageLoader } from "./pages/DashboardPage";
import ListsPage, { ListsPageLoader } from "./pages/ListsPage"
import ViewSingleListPage, { viewSingleListPageLoader } from "./pages/ViewSingleListPage"
import AddPage, { AddPageLoader } from "./pages/AddPage"
import EditListsPage from "./pages/EditListsPage";
import EditSingleListPage, { EditListPageLoader } from "./pages/EditSingleListPage";
import EditShopsPage from "./pages/EditShopsPage";
import AuthPage, { AuthPageLoader } from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";

//other
import LoaderFullPage from "./components/UI/LoaderFullPage";
import { useEffect, useState } from "react";

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/auth", element: <AuthPage/>, loader: AuthPageLoader}, 
      { path: "/dash", element: <DashboardPage />, loader: DashboardPageLoader},
      { path: "/lists", element: <ListsPage/>, loader: ListsPageLoader}, 
      { path: "/lists/:listId", element: <ViewSingleListPage/>, loader: viewSingleListPageLoader},
      { path: "/add", element: <AddPage/>, loader: AddPageLoader},
      { path: "/edit", element: <Navigate to={"/edit/lists"}/>}, 
      { path: "/edit/lists", element: <EditListsPage/>}, 
      { path: "/edit/lists/:listId", element: <EditSingleListPage/>, loader: EditListPageLoader}, 
      { path: "/edit/shops", element: <EditShopsPage/>},
      { path: "/account", element: <AccountPage/>}
    ],
  },
]);

//Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
//icons: 
//house: <i class="fa-solid fa-house-chimney-window"></i>
//list: <i class="fa-solid fa-list-ul"></i>
//plus: <i class="fa-solid fa-plus"></i>
//minus: <i class="fa-solid fa-minus"></i>
//edit: <i class="fa-solid fa-pen-to-square"></i>
//user: <i class="fa-solid fa-user"></i>
//settings: <i class="fa-solid fa-gear"></i>
//check: <i class="fa-solid fa-check"></i>
//x: <i class="fa-solid fa-xmark"></i>
//trash <i class="fa-solid fa-trash-can"></i>
//dots vert: <i class="fa-solid fa-ellipsis-vertical"></i>
//dot: <i className="fa-solid fa-circle"></i>
//eye: <i class="fa-solid fa-eye"></i>
//arrow-right: <i class="fa-solid fa-arrow-right"></i>
//square: <i class="fa-regular fa-square"></i>
//checkbox: <i class="fa-regular fa-square-check"></i>
//info: <i class="fa-solid fa-circle-info"></i>
//error: <i class="fa-solid fa-triangle-exclamation"></i>
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
