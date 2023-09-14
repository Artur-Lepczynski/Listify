import "./themes.css";

//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseData";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//context
import GlobalContext, { context } from "./store/GlobalContext";

//router
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

//pages & loaders
import RootLayout from "./pages/RootLayout";
import HomePage, { HomePageLoader } from "./pages/HomePage";
import DashboardPage, { DashboardPageLoader } from "./pages/DashboardPage";
import ListsPage, { ListsPageLoader } from "./pages/ListsPage";
import ViewSingleListPage, {
  viewSingleListPageLoader,
} from "./pages/ViewSingleListPage";
import AddPage, { AddPageLoader } from "./pages/AddPage";
import EditListsPage, { EditListPageLoader } from "./pages/EditListsPage";
import EditSingleListPage, {
  EditSingleListPageLoader,
} from "./pages/EditSingleListPage";
import EditShopsPage, { EditShopsPageLoader } from "./pages/EditShopsPage";
import AuthPage, { AuthPageLoader } from "./pages/AuthPage";
import AccountPage, { accountPageLoader } from "./pages/AccountPage";

//other
import LoaderFullPage from "./components/UI/LoaderFullPage";
import { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import AccountRemovePage from "./pages/AccountRemovePage";

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />, loader: HomePageLoader },
      { path: "/auth", element: <AuthPage />, loader: AuthPageLoader },
      {
        path: "/dash",
        element: <DashboardPage />,
        loader: DashboardPageLoader,
      },
      { path: "/lists", element: <ListsPage />, loader: ListsPageLoader },
      {
        path: "/lists/:listId",
        element: <ViewSingleListPage />,
        loader: viewSingleListPageLoader,
      },
      { path: "/add", element: <AddPage />, loader: AddPageLoader },
      { path: "/edit", element: <Navigate to={"/edit/lists"} /> },
      {
        path: "/edit/lists",
        element: <EditListsPage />,
        loader: EditListPageLoader,
      },
      {
        path: "/edit/lists/:listId",
        element: <EditSingleListPage />,
        loader: EditSingleListPageLoader,
      },
      {
        path: "/edit/shops",
        element: <EditShopsPage />,
        loader: EditShopsPageLoader,
      },
      { path: "/account", element: <AccountPage />, loader: accountPageLoader },
      { path: "/account/remove", element: <AccountRemovePage/>, loader: accountPageLoader}
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
  const { dispatchSettings } = useContext(context);

  //check signed in user, get settings
  useEffect(() => {
    async function checkUserAndSettings() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user)=>{
      if (user) {
        console.log("user is signed in, id:", user.uid);
        const settingsRef = await getUserSettingsRef(user.uid);

        onValue(settingsRef, (snapshot) => {
          if (snapshot.exists()) {
            const settings = snapshot.val();
            dispatchSettings({ type: "SET_SETTINGS", settings });
            setIsLoading(false);
          }else {
            console.log("user has no settings");
            setIsLoading(false);
          }
        });
      } else {
        console.log("user is NOT signed in");
        setIsLoading(false);
      }
    })
    }
    checkUserAndSettings();
  }, []);

  async function getUserSettingsRef(uid) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const settingsRef = ref(db, "users/" + uid + "/settings");
      resolve(settingsRef);
    });
  }

  return (
    <>
      <LoaderFullPage in={isLoading} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
