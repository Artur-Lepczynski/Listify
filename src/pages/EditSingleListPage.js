import EditableList from "../components/editableList/EditableList";
import { redirect } from "react-router-dom";
import { getUser } from "../util/getUserLoggedInStatus";
import { child, get, getDatabase, ref } from "firebase/database";

export default function EditSingleListPage() {
  return <EditableList mode="edit" />;
}

export async function EditSingleListPageLoader({ params }) {
  const user = await getUser();
  if (!user) return redirect("/");

  const db = getDatabase();
  const listsRef = ref(db);
  const userId = user.uid;
  const listId = params.listId;

  try {
    const snapshot = await get(
      child(listsRef, "users/" + userId + "/lists/" + listId)
    );
    if (snapshot.exists()) {
      return transformListData(snapshot.val());
    } else {
      return { error: "List not found" };
    }
  } catch (err) {
    console.log("Loader error: ", err);
  }

  return null;
}

function transformListData(list) {
  const listItemsTransformed = Object.entries(list.items).map((item) => {
    return {
      shopId: item[0],
      products: item[1],
    };
  });
  list.items = listItemsTransformed;
  return list;
}
