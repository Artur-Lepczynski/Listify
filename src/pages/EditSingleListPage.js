import EditableList from "../components/editableList/EditableList";
import { redirect } from "react-router-dom";
import { getUser } from "../util/getUserLoggedInStatus";
import { child, get, getDatabase, ref } from "firebase/database";

export default function EditSingleListPage() {
  return <EditableList mode="edit"/>;
}

export async function EditSingleListPageLoader({ params }) {
  const user = await getUser();
  if (!user) return redirect("/");

  //read list data from database
  const db = getDatabase();
  const listsRef = ref(db);
  const userId = user.uid;
  const listId = params.listId;

  try {
    const snapshot = await get(
      child(listsRef, "users/" + userId + "/lists/" + listId)
    );
    if (snapshot.exists()){ 
      //change items to an array 
      const list = snapshot.val();
      const itemsNew = [];
      Object.entries(list.items).forEach((item)=>{
        let newObj = {
          shopId: item[0],
          products: item[1],
        };
        itemsNew.push(newObj);
      });
      list.items = itemsNew;
      return list;
    }else{
      return {error: "List not found"};
    }
  } catch (err) {
    //TODO: show error notification
    console.log("Loader error: ", err);
  }

  return null;
}
