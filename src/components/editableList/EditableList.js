import style from "./EditableList.module.css";
import Page from "../UI/Page";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  CSSTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";
import Card from "../UI/Card";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  child,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import Loader from "../UI/Loader";
import Icon from "../UI/Icon";
import { useTheme } from "../../hooks/useTheme";
import Button from "../UI/Button";
import Prompt from "../UI/Prompt";
import EditableShop from "./EditableShop";
import { context } from "../../store/GlobalContext";
import Modal from "../UI/Modal";

export default function EditableList(props) {
  const getClassNames = useTheme(style);

  const {
    showNotification,
    settings: {
      askBeforeProductDeleteEdit,
      askBeforeShopDeleteEdit,
      addListNotification,
    },
  } = useContext(context);

  const [productDeleteModalShown, setProductDeleteModalShown] = useState(false);
  const [shopDeleteModalShown, setShopDeleteModalShown] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const listData = useLoaderData();

  const PRODUCT_MIN_QTY = 1;
  const PRODUCT_MAX_QTY = 999;

  const [shopsLoading, setShopsLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [noShopsError, setNoShopsError] = useState(false);
  const [listUpdateLoading, setListUpdateLoading] = useState(false);
  const [list, dispatchList] = useReducer(
    listReducer,
    listData || {
      name: "List",
      createDate: new Date(),
      note: "",
      done: false,
      items: [],
    }
  );

  function listReducer(prevState, action) {
    const copy = { ...prevState };
    if (action.type === "CHANGE_LIST_NAME") {
      return {
        ...prevState,
        name: action.value,
      };
    } else if (action.type === "ADD_SHOP") {
      copy.items.push({ shopId: action.value, products: {} });
      setTimeout(() => {
        setShops((prev) => {
          const copy = [...prev];
          const shop = copy.find((item) => item.shopId === action.value);
          shop.used = true;
          return copy;
        });
      }, 150);
      return copy;
    } else if (action.type === "CHANGE_SHOP_NAME") {
      const index = copy.items.findIndex((item) => {
        return item.shopId === action.value.oldShopId;
      });
      copy.items[index].shopId = action.value.shopId;
      Object.values(copy.items[index].products).forEach((item) => {
        if (item.name !== "") {
          item.edit = false;
        }
      });
      setTimeout(() => {
        setShops((prev) => {
          let copy = [...prev];
          const oldShop = copy.find(
            (item) => item.shopId === action.value.oldShopId
          );
          const newShop = copy.find(
            (item) => item.shopId === action.value.shopId
          );
          if (oldShop) oldShop.used = false;
          newShop.used = true;
          return copy;
        });
      }, 150);
      return copy;
    } else if (action.type === "DELETE_SHOP") {
      copy.items = copy.items.filter((item) => {
        return item.shopId !== action.value;
      });
      setShops((prev) => {
        let copy = [...prev];
        const shop = copy.find((item) => item.shopId === action.value);
        if (shop) shop.used = false;
        return copy;
      });
      return copy;
    } else if (action.type === "ADD_PRODUCT") {
      const product = { edit: true, name: "", qty: 1, done: false };
      const productKey = getRandomProductKey();
      const shop = copy.items.find((item) => {
        return item.shopId === action.value;
      });
      shop.products[productKey] = product;
      return copy;
    } else if (action.type === "CHANGE_PRODUCT_NAME") {
      const product = findProduct(
        copy,
        action.value.shopId,
        action.value.productId
      );
      product.name = action.value.name;
      return copy;
    } else if (action.type === "DELETE_PRODUCT") {
      const shop = copy.items.find((item) => {
        return item.shopId === action.value.shopId;
      });
      delete shop.products[action.value.productId];
      return copy;
    } else if (action.type === "CHANGE_PRODUCT_QTY") {
      const product = findProduct(
        copy,
        action.value.shopId,
        action.value.productId
      );
      product.qty = action.value.qty;
      return copy;
    } else if (action.type === "CHANGE_DONE_STATUS") {
      const product = findProduct(
        copy,
        action.value.shopId,
        action.value.productId
      );
      product.done = !product.done;
      return copy;
    } else if (action.type === "CHANGE_NOTE") {
      copy.note = action.value;
      return copy;
    }
  }

  function findProduct(copy, shopId, productId) {
    const shop = copy.items.find((item) => {
      return item.shopId === shopId;
    });
    return shop.products[productId];
  }

  function findShopByName(name) {
    return shops.find((item) => item.shopName === name);
  }

  function getRandomProductKey() {
    return (Math.random() + "").slice(2);
  }

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const shopsRef = ref(db, "users/" + userId + "/shops");

    onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const databeseShops = snapshot.val();
        let shopsArray = Object.entries(databeseShops).map((dbShop) => {
          const shopAlreadyUsed = list.items.some((listShop) => {
            return listShop.shopId === dbShop[0];
          });
          return {
            shopId: dbShop[0],
            shopName: dbShop[1].name,
            used: shopAlreadyUsed,
          };
        });
        setShops(shopsArray);
      } else if (!snapshot.exists() && props.mode === "add") {
        setNoShopsError(true);
      }
      setShopsLoading(false);
    });
  }, []);

  const [editingListName, setEditingListName] = useState(false);
  const [enteredListName, setEnteredListName] = useState(list.name);
  const listNameValid =
    enteredListName.trim() !== "" && enteredListName.length <= 32;

  const listNameInputRef = useRef(null);

  function handleListNameEdit() {
    if (!editingListName) {
      setEditingListName(true);
      setTimeout(()=>{
        listNameInputRef.current.focus();
      }, 1)
    } else if (listNameValid) {
      setEditingListName(false);
      dispatchList({ type: "CHANGE_LIST_NAME", value: enteredListName });
    }
  }

  function handleListNameChange(event) {
    setEnteredListName(event.target.value);
  }


  function handleListNameEnterClick(event){
    if(event.key === "Enter" && document.activeElement === listNameInputRef.current){
      handleListNameEdit();
    }
  }

  const [shopPromptShown, setShopPromptShown] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

  function handleAddShopButtonPress(event) {
    setClickCoordinates({ x: event.pageX, y: event.pageY });
    setShopPromptShown(true);
  }

  function handlePromptBackgroundClick() {
    setShopPromptShown(false);
  }

  function handleAddShop(shop) {
    setShopPromptShown(false);
    const selectedShop = findShopByName(shop);
    dispatchList({ type: "ADD_SHOP", value: selectedShop.shopId });
  }

  function handleShopNameEdit(shopId, name) {
    const selectedShop = findShopByName(name);
    dispatchList({
      type: "CHANGE_SHOP_NAME",
      value: { oldShopId: shopId, shopId: selectedShop.shopId },
    });
  }

  const [deletedShopId, setDeletedShopId] = useState(null);
  function handleShopDelete(shopId) {
    if (askBeforeShopDeleteEdit) {
      setDeletedShopId(shopId);
      setShopDeleteModalShown(true);
    } else {
      dispatchList({ type: "DELETE_SHOP", value: shopId });
    }
  }

  function handleShopDeleteModalConfirm() {
    setShopDeleteModalShown(false);
    dispatchList({ type: "DELETE_SHOP", value: deletedShopId });
    setDeletedShopId(null);
  }

  function handleShopDeleteModalCancel() {
    setShopDeleteModalShown(false);
    setDeletedShopId(null);
  }

  function handleAddProduct(shopId) {
    dispatchList({ type: "ADD_PRODUCT", value: shopId });
  }

  function handleProductNameChange(shopId, productId, name) {
    dispatchList({
      type: "CHANGE_PRODUCT_NAME",
      value: { shopId, productId, name },
    });
  }

  const [deletedProductId, setDeletedProductId] = useState(null);
  function handleProductDelete(shopId, productId) {
    if (askBeforeProductDeleteEdit) {
      setDeletedProductId({ productId, shopId });
      setProductDeleteModalShown(true);
    } else {
      dispatchList({ type: "DELETE_PRODUCT", value: { shopId, productId } });
    }
  }

  function handleProductDeleteModalConfirm() {
    setProductDeleteModalShown(false);
    dispatchList({
      type: "DELETE_PRODUCT",
      value: {
        shopId: deletedProductId.shopId,
        productId: deletedProductId.productId,
      },
    });
    setDeletedProductId(null);
  }

  function handleProductDeleteModalCancel() {
    setProductDeleteModalShown(false);
    setDeletedProductId(null);
  }

  function handleQtyChange(shopId, productId, qty) {
    dispatchList({
      type: "CHANGE_PRODUCT_QTY",
      value: { shopId, productId, qty },
    });
  }

  function handleDoneStatusChange(shopId, productId) {
    dispatchList({
      type: "CHANGE_DONE_STATUS",
      value: { shopId, productId },
    });
  }

  const NOTE_MAX_LENGTH = 1000;
  const noteValid = list.note.length <= NOTE_MAX_LENGTH;

  function handleNoteChange(event) {
    dispatchList({ type: "CHANGE_NOTE", value: event.target.value });
  }

  const [listValid, setListValid] = useState(false);

  useEffect(() => {
    const shopsEmpty = list.items.length === 0;
    const shopsValid = list.items.every((shop) => {
      const emptyShop = Object.keys(shop.products).length === 0;
      const noInvalidProducts = Object.values(shop.products).every((item) => {
        return (
          item.name &&
          item.qty >= PRODUCT_MIN_QTY &&
          item.qty <= PRODUCT_MAX_QTY &&
          !Number.isNaN(item.qty)
        );
      });
      return !emptyShop && noInvalidProducts;
    });

    const listValid =
      !shopsEmpty &&
      shopsValid &&
      listNameValid &&
      !editingListName &&
      noteValid;
    setListValid(listValid);
  }, [list, listNameValid, editingListName, noteValid]);

  function handleAddOrUpdateList() {
    if (listValid && !listUpdateLoading) {
      const copy = { ...list };
      const result = {};

      copy.items.forEach((item) => {
        Object.values(item.products).forEach((item) => {
          delete item.edit;
        });
        result[item.shopId] = item.products;
      });
      copy.items = result;

      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const db = getDatabase();
      let listKey;

      if (props.mode === "add") {
        listKey = push(child(ref(db), "users/" + userId + "/lists/")).key;
      } else if (props.mode === "edit") {
        listKey = params.listId;
      }

      update(ref(db, "users/" + userId + "/lists/" + listKey), copy)
        .then(() => {
          trackStats(copy, db, userId, listKey);
          if (addListNotification) {
            showNotification(
              "information",
              props.mode === "add" ? "List saved" : "List updated",
              props.mode === "add"
                ? 'Your list "' + list.name + '" was saved successfully.'
                : 'Your list "' + list.name + '" was updated successfully.'
            );
          }
          setListUpdateLoading(false);
          navigate("/dash");
        })
        .catch(() => {
          setListUpdateLoading(false);
          showNotification(
            "error",
            props.mode === "add"
              ? "Saving the list failed"
              : "Updating the list failed",
            "There was a network error when " +
              (props.mode === "add" ? "saving" : "updating") +
              " your list. We're sorry about that. Please try again."
          );
        });
    }
  }

  function trackStats(copy, db, userId, listKey) {
    let createDate = copy.createDate;
    if (typeof copy.createDate === "string")
      createDate = new Date(copy.createDate);

    let prodNumber = 0;
    const prodDoneNumber = Object.values(copy.items).reduce((acc, shop) => {
      return (
        acc +
        Object.values(shop).reduce((acc, product) => {
          prodNumber++;
          return acc + +product.done;
        }, 0)
      );
    }, 0);

    const stats = {
      done: copy.done,
      prodNumber,
      prodDoneNumber,
    };

    const statsRef = ref(
      db,
      "users/" +
        userId +
        "/stats/" +
        createDate.getFullYear() +
        "/" +
        (createDate.getMonth() + 1) +
        "/" +
        createDate.getDate() +
        "/" +
        listKey
    );
    update(statsRef, stats).catch(() => {
      showNotification(
        "error",
        "Tracking stats failed",
        "There was a network error when tracking usage statistics for this list. We're sorry about that. Please repeat this action to try again."
      );
    });
  }

  function handleNoShopsModalConfirm() {
    navigate("/edit/shops");
  }

  function handleNoShopsModalCancel() {
    navigate("/dash");
  }

  return (
    <Page>
      {shopsLoading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      <Modal
        in={!shopsLoading && noShopsError}
        type="choice"
        title="No shops registered"
        message="You don't have any shops registered. You need at least one shop in order to add products to it when creating a list. Would you like to manage your shops now?"
        confirmText="Manage shops"
        cancelText="Cancel"
        onConfirm={handleNoShopsModalConfirm}
        onCancel={handleNoShopsModalCancel}
      />
      <Modal
        in={shopDeleteModalShown}
        type="choice"
        title="Confirm shop removal"
        message="Are you sure you want to remove this shop? All products in this shop will be removed as well."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleShopDeleteModalConfirm}
        onCancel={handleShopDeleteModalCancel}
      />
      <Modal
        in={productDeleteModalShown}
        type="choice"
        title="Confirm product removal"
        message="Are you sure you want to remove this product?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleProductDeleteModalConfirm}
        onCancel={handleProductDeleteModalCancel}
      />
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
        <>
          {listData?.error && (
            <Card>
              <p className={style["no-list-text"]}>
                The requested list does not exist.
              </p>
            </Card>
          )}
          {!listData?.error && (
            <>
              <Card>
                <div className={style["list-title-wrapper"]}>
                  {!editingListName && (
                    <>
                      <h2 className={style["list-title"]}>{list.name}</h2>
                      <Icon
                        type="button"
                        icon="fa-solid fa-pen-to-square"
                        className={style["list-title-icon"]}
                        onClick={handleListNameEdit}
                        aria-label="Edit list name"
                      />
                    </>
                  )}
                  {editingListName && (
                    <>
                      <div onKeyDown={handleListNameEnterClick}>
                        <input
                          className={`${
                            style["list-title-input"]
                          } ${getClassNames("list-title-input")}`}
                          type="text"
                          value={enteredListName}
                          onChange={handleListNameChange}
                          ref={listNameInputRef}
                          placeholder="List name"
                        ></input>
                        {!listNameValid && (
                          <p
                            className={`${
                              style["input-invalid-text"]
                            } ${getClassNames("input-invalid-text")}`}
                          >
                            List name must be between 1 and 32 characters long
                          </p>
                        )}
                      </div>
                      <Icon
                        type="button"
                        icon="fa-solid fa-check"
                        className={style["list-title-icon"]}
                        onClick={handleListNameEdit}
                        aria-label={`Save list name ${listNameValid ? "" : " (disabled - list name too long)"}`}
                      />
                    </>
                  )}
                </div>
                <TransitionGroup role="list">
                  {list.items.map((shop) => {
                    const currentShop = shops.find((item) => {
                      return item.shopId === shop.shopId;
                    });
                    let shopName = "Removed shop";
                    if (currentShop) shopName = currentShop.shopName;
                    return (
                      <CSSTransition
                        timeout={150}
                        key={shop.shopId}
                        classNames={{
                          enter: style["shop-enter"],
                          enterActive: style["shop-enter-active"],
                          exit: style["shop-exit"],
                          exitActive: style["shop-exit-active"],
                        }}
                      >
                        <EditableShop
                          id={shop.shopId}
                          name={shopName}
                          products={shop.products}
                          shops={shops}
                          maxProductQty={PRODUCT_MAX_QTY}
                          minProductQty={PRODUCT_MIN_QTY}
                          onShopNameEdit={handleShopNameEdit}
                          onShopDelete={handleShopDelete}
                          onAddProduct={handleAddProduct}
                          onProductNameChange={handleProductNameChange}
                          onProductDelete={handleProductDelete}
                          onQtyChange={handleQtyChange}
                          onDoneStatusChange={handleDoneStatusChange}
                        />
                      </CSSTransition>
                    );
                  })}
                </TransitionGroup>

                <Button
                  type="button"
                  look="primary"
                  className={style.button}
                  onClick={handleAddShopButtonPress}
                  aria-haspopup="menu"
                  aria-controls="shop-prompt"
                >
                  Add a new shop
                </Button>

                <Prompt
                  id="shop-prompt"
                  shown={shopPromptShown}
                  setShown={setShopPromptShown}
                  coordinates={clickCoordinates}
                  options={shops
                    .filter((item) => !item.used)
                    .map((item) => item.shopName)}
                  noOptionsText="There are no more shops to add"
                  onBackgroundClick={handlePromptBackgroundClick}
                  onSelect={handleAddShop}
                />

                <Card nested={true}>
                  <h3 className={style["note-header"]}>Note</h3>
                  <textarea
                    className={`${style["note"]} ${getClassNames("note")}`}
                    value={list.note}
                    onChange={handleNoteChange}
                    placeholder="Note"
                  ></textarea>
                  <div
                    className={`${style["note-footer"]} ${
                      !noteValid && getClassNames("note-footer-invalid")
                    }`}
                  >
                    <p className={style["note-footer-text"]}>
                      {!noteValid && "Note is too long"}
                    </p>
                    <p className={style["note-footer-text"]}>
                      {list.note.length} / {NOTE_MAX_LENGTH}
                    </p>
                  </div>
                </Card>

              </Card>
              <Button
                className={style.button}
                type="button"
                look="primary"
                onClick={handleAddOrUpdateList}
                loading={listUpdateLoading}
                disabled={!listValid}
              >
                {props.mode === "add" ? "Add list" : "Save list"}
              </Button>
            </>
          )}
        </>
      </CSSTransition>
    </Page>
  );
}
