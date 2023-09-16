import "./themes.css";

//firebase
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseData";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//context
import { context } from "./store/GlobalContext";

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
      {
        path: "/account/remove",
        element: <AccountRemovePage />,
        loader: accountPageLoader,
      },
      { path: "*", element: <Navigate to={"/"} /> },
    ],
  },
]);

function App() {
  const [userLoading, setUserLoading] = useState(true);
  const { dispatchSettings } = useContext(context);

  useEffect(() => {
    async function checkUserAndSettings() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const settingsRef = await getUserSettingsRef(user.uid);

          onValue(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
              const settings = snapshot.val();
              dispatchSettings({ type: "SET_SETTINGS", settings });
            }
            setUserLoading(false);
          });
        } else {
          setUserLoading(false);
        }
      });
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
      <LoaderFullPage in={userLoading} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
