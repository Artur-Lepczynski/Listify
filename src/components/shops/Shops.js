import { useContext, useEffect, useState } from "react";
import Card from "../UI/Card";
import Page from "../UI/Page";
import style from "./Shops.module.css";
import Modal from "../UI/Modal";
import { getAuth } from "firebase/auth";
import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  update,
} from "firebase/database";
import Loader from "../UI/Loader";
import { CSSTransition } from "react-transition-group";
import Button from "../UI/Button";
import EditableShop from "./EditableShop";
import { context } from "../../store/GlobalContext";

export default function Shops() {
  const [shops, setShops] = useState({});
  const [newShopModalShown, setNewShopModalShown] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [newShopLoading, setNewShopLoading] = useState(false);
  const [error, setError] = useState(false);

  const { showNotification } = useContext(context);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const shopsRef = ref(db, "users/" + userId + "/shops");

    onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setShops(data);
        setError(false);
      } else {
        setShops({});
        setError(true);
      }
    });

    setShopsLoading(false);
  }, []);

  function validateShopName(shopName) {
    return shopName.trim() !== "" && shopName.length <= 32;
  }

  function handleModalOpen(){
    if(!newShopLoading){
      setNewShopModalShown(true);
    }
  }

  function handleModalCancel() {
    setNewShopModalShown(false);
  }

  function handleModalConfirm(shopName) {
    
      setNewShopModalShown(false);
      setNewShopLoading(true);

      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const db = getDatabase();

      const newShop = { name: shopName };
      const newShopKey = push(
        child(ref(db), "users/" + userId + "/shops/")
      ).key;

      update(ref(db, "users/" + userId + "/shops/" + newShopKey), newShop)
        .then(() => {
          showNotification(
            "information",
            "Shop added",
            'The shop "' + shopName + '" has been added successfully'
          );
          setNewShopLoading(false);
        })
        .catch((err) => {
          showNotification(
            "error",
            "Shop saving failed",
            "An error occured while saving the shop. Please try again later."
          );
          setNewShopLoading(false);
        });
    
  }

  function handleShopDelete(shopId, shopName) {
    //TODO: propmpt user to confirm if settings say so
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    remove(ref(db, "users/" + userId + "/shops/" + shopId))
      .then(() => {
        showNotification(
          "information",
          "Shop deleted",
          'The shop "' + shopName + '" has been deleted successfully'
        );
      })
      .catch((error) => {
        showNotification(
          "error",
          "Shop deletion failed",
          "An error occured while deleting the shop. Please try again later."
        );
      });
  }

  return (
    <Page>
      {shopsLoading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      <CSSTransition
        in={!shopsLoading}
        appear={!shopsLoading}
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-enter"],
          enterActive: style["fade-enter-active"],
        }}
      >
        <Card>
          <h2 className={style.title}>Shops</h2>
          {error && (
            <p className={style["no-shops-text"]}>
              You don't have any shops yet. You need at least one in order to
              add products to it when creating a new list.
            </p>
          )}
          {Object.entries(shops).map((item) => {
            return (
              <EditableShop
                key={item[0]}
                shopId={item[0]}
                shopName={item[1].name}
                onDelete={handleShopDelete}
              />
            );
          })}
          <Button
            type="button"
            look="primary"
            className={style["add-shop-button"]}
            onClick={handleModalOpen}
            loading={newShopLoading}
          >
            Add a new shop
          </Button>
        </Card>
      </CSSTransition>
      <Modal
        in={newShopModalShown}
        title="Add a new shop"
        message="Please enter a name for the new shop"
        type="input"
        validateFunction={validateShopName}
        onCancel={handleModalCancel}
        cancelText="Cancel"
        onConfirm={handleModalConfirm}
        confirmText="Add"
      />
    </Page>
  );
}
