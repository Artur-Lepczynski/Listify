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
  const [removeShopModalShown, setRemoveShopModalShown] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [newShopLoading, setNewShopLoading] = useState(false);
  const [noShopsError, setNoShopsError] = useState(false);

  const {
    showNotification,
    settings: {
      askBeforeShopDelete,
      removeShopNotification,
      addShopNotification,
    },
  } = useContext(context);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const shopsRef = ref(db, "users/" + userId + "/shops");

    onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setShops(data);
        setNoShopsError(false);
      } else {
        setShops({});
        setNoShopsError(true);
      }
    });

    setShopsLoading(false);
  }, []);

  function validateShopName(shopName) {
    return shopName.trim() !== "" && shopName.length <= 32;
  }

  function handleNewShopModalOpen() {
    if (!newShopLoading) {
      setNewShopModalShown(true);
    }
  }

  function handleNewShopModalCancel() {
    setNewShopModalShown(false);
  }

  function handleNewShopModalConfirm(shopName) {
    setNewShopModalShown(false);
    setNewShopLoading(true);

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const newShop = { name: shopName };
    const newShopKey = push(child(ref(db), "users/" + userId + "/shops/")).key;

    update(ref(db, "users/" + userId + "/shops/" + newShopKey), newShop)
      .then(() => {
        if (addShopNotification) {
          showNotification(
            "information",
            "Shop added",
            'The shop "' + shopName + '" has been added successfully.'
          );
        }
        setNewShopLoading(false);
      })
      .catch(() => {
        showNotification(
          "error",
          "Shop adding failed",
          "There was a network error when adding this shop. We're sorry about that. Please try again."
        );
        setNewShopLoading(false);
      });
  }

  const [removedShopData, setRemovedShopData] = useState({});
  function handleShopDelete(shopId, shopName) {
    if (askBeforeShopDelete) {
      setRemovedShopData({ shopId, shopName });
      setRemoveShopModalShown(true);
    } else {
      deleteShop(shopId, shopName);
    }
  }

  function handleRemoveShopModalConfirm() {
    deleteShop(removedShopData.shopId, removedShopData.shopName);
    setRemoveShopModalShown(false);
  }

  function handleRemoveShopModalCancel() {
    setRemoveShopModalShown(false);
  }

  function deleteShop(shopId, shopName) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    remove(ref(db, "users/" + userId + "/shops/" + shopId))
      .then(() => {
        if (removeShopNotification) {
          showNotification(
            "information",
            "Shop deleted",
            'The shop "' + shopName + '" has been deleted successfully.'
          );
        }
      })
      .catch(() => {
        showNotification(
          "error",
          "Shop removal failed",
          "There was a network error when removing this shop. We're sorry about that. Please try again."
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
          {noShopsError && (
            <p className={style["no-shops-text"]}>
              You don't have any shops yet. You need at least one in order to
              add products to it when creating a new list.
            </p>
          )}
          <div role="list">
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
          </div>
          <Button
            type="button"
            look="primary"
            className={style["add-shop-button"]}
            onClick={handleNewShopModalOpen}
            loading={newShopLoading}
          >
            Add a new shop
          </Button>
        </Card>
      </CSSTransition>
      <Modal
        in={newShopModalShown}
        title="Adding a new shop"
        message="Please enter a name for the new shop:"
        type="input"
        validateFunction={validateShopName}
        onCancel={handleNewShopModalCancel}
        cancelText="Cancel"
        onConfirm={handleNewShopModalConfirm}
        confirmText="Add"
        placeholderText="New shop name"
      />
      <Modal
        in={removeShopModalShown}
        title="Confirm shop removal"
        message={
          'Are you sure you want to remove "' +
          removedShopData.shopName +
          '"? If you remove this shop, it will be displayed as "Removed shop" on all lists that use it.'
        }
        type="choice"
        onCancel={handleRemoveShopModalCancel}
        cancelText="Cancel"
        onConfirm={handleRemoveShopModalConfirm}
        confirmText="Remove"
      />
    </Page>
  );
}
