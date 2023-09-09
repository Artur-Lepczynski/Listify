import style from "./EditableList.module.css";
import Page from "../UI/Page";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Card from "../UI/Card";
import { useContext, useEffect, useReducer, useState } from "react";
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

export default function EditableList(props) {
  //props.mode = "add" or "edit";
  const getClassNames = useTheme(style);

  const { showNotification } = useContext(context);

  const navigate = useNavigate();
  const params = useParams();
  const data = useLoaderData();

  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [shopsError, setShopsError] = useState(false);
  const [list, dispatchList] = useReducer(
    listReducer,
    data || {
      name: "List",
      createDate: new Date(),
      note: "",
      achievementProgress: true,
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
          return prev.filter((shop) => shop.shopId !== action.value);
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
          const shop = findShopById(action.value.oldShopId);
          //shop can not exist, (when changing from removed shop to new shop)
          if (shop) copy.push(shop);
          return copy.filter((item) => {
            return item.shopId !== action.value.shopId;
          });
        });
      }, 150);
      return copy;
    } else if (action.type === "DELETE_SHOP") {
      copy.items = copy.items.filter((item) => {
        return item.shopId !== action.value;
      });
      setShops((prev) => {
        let copy = [...prev];
        const shop = findShopById(action.value);
        //shop can not exist, (when removing removed shop)
        if (shop) copy.push(shop);
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
    return allShops.find((item) => item.shopName === name);
  }

  function findShopById(id) {
    return allShops.find((item) => item.shopId === id);
  }

  function getRandomProductKey() {
    return (Math.random() + "").slice(2);
  }

  //get shops from db
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const shopsRef = ref(db, "users/" + userId + "/shops");

    onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const shops = snapshot.val();
        //transform into array of objects with shopId and shopName
        let shopsArray = Object.entries(shops).map((item) => {
          return { shopId: item[0], shopName: item[1].name };
        });
        setAllShops(shopsArray);
        // remove used shops from list
        shopsArray = shopsArray.filter((shop) => {
          return !list.items.some((item) => item.shopId === shop.shopId);
        });
        setShops(shopsArray);
      } else if (!snapshot.exists() && props.mode === "add") {
        setShopsError(true);
      }
      setLoading(false);
    });
  }, []);

  //list name
  const [listNameEdited, setListNameEdited] = useState(false);
  const [enteredListName, setEnteredListName] = useState(list.name);
  const listNameValid =
    enteredListName.trim() !== "" && enteredListName.length <= 32;

  function handleListNameEdit() {
    if (!listNameEdited) {
      setListNameEdited(true);
    } else {
      if (listNameValid) {
        setListNameEdited(false);
        dispatchList({ type: "CHANGE_LIST_NAME", value: enteredListName });
      }
    }
  }

  function handleListNameChange(event) {
    setEnteredListName(event.target.value);
  }

  //new shop
  const [shopPromptShown, setShopPromptShown] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  function handleAddShopButtonPress(event) {
    const clickCoordinates = { x: event.pageX, y: event.pageY };
    setCoordinates(clickCoordinates);
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

  //edit shop name
  function handleShopNameEdit(shopId, name) {
    const selectedShop = findShopByName(name);
    dispatchList({
      type: "CHANGE_SHOP_NAME",
      value: { oldShopId: shopId, shopId: selectedShop.shopId },
    });
  }

  //delete shop
  function handleShopDelete(shopId) {
    //TODO: check setting to see if prompt is needed
    dispatchList({ type: "DELETE_SHOP", value: shopId });
  }

  //add product to shop
  function handleAddProduct(shopId) {
    dispatchList({ type: "ADD_PRODUCT", value: shopId });
  }

  //change product name
  function handleProductNameChange(shopId, productId, name) {
    dispatchList({
      type: "CHANGE_PRODUCT_NAME",
      value: { shopId, productId, name },
    });
  }

  //delete product
  function handleProductDelete(shopId, productId) {
    //TODO: check setting to see if prompt is needed
    dispatchList({ type: "DELETE_PRODUCT", value: { shopId, productId } });
  }

  //change product qty in input
  function handleQtyChange(shopId, productId, qty) {
    dispatchList({
      type: "CHANGE_PRODUCT_QTY",
      value: { shopId, productId, qty },
    });
  }

  //change done status
  function handleDoneStatusChange(shopId, productId) {
    dispatchList({
      type: "CHANGE_DONE_STATUS",
      value: { shopId, productId },
    });
  }

  //note
  const NOTE_MAX_LENGTH = 1000;
  const noteValid = list.note.length <= NOTE_MAX_LENGTH;

  function handleNoteChange(event) {
    dispatchList({ type: "CHANGE_NOTE", value: event.target.value });
  }

  //check list validity
  const [listValid, setListValid] = useState(false);

  useEffect(() => {
    const shopsEmpty = list.items.length === 0;
    const shopsValid = list.items.every((shop) => {
      const emptyShop = Object.keys(shop.products).length === 0;
      const noEmptyProducts = Object.values(shop.products).every((item) => {
        return item.name;
      });
      return !emptyShop && noEmptyProducts;
    });

    const listValid =
      !shopsEmpty &&
      shopsValid &&
      listNameValid &&
      !listNameEdited &&
      noteValid;
    setListValid(listValid);
  }, [list, listNameValid, listNameEdited, noteValid]);

  //add the list
  function handleAddOrUpdateList() {
    if (listValid) {
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
          showNotification(
            "information",
            props.mode === "add" ? "List saved" : "List updated",
            props.mode === "add"
              ? 'Your list "' + list.name + '" was saved successfully!'
              : 'Your list "' + list.name + '" was updated successfully!'
          );
          navigate("/dash");
        })
        .catch(() => {
          showNotification(
            "error",
            "Error saving list",
            "There was an error saving your list. Please try again."
          );
        });
    }
  }

  return (
    <Page>
      {loading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      {!loading && shopsError && (
        <p>TODO: show no shops in add mode modal here</p>
      )}
      <CSSTransition
        in={!loading}
        appear={!loading}
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-enter"],
          enterActive: style["fade-enter-active"],
        }}
      >
        <>
          {data?.error && (
            <Card>
              <p className={style["no-list-text"]}>
                The requested list does not exist.
              </p>
            </Card>
          )}
          {!data?.error && (
            <>
              <Card>
                <div className={style["list-title-wrapper"]}>
                  {!listNameEdited && (
                    <>
                      <h2 className={style["list-title"]}>{list.name}</h2>
                      <Icon
                        type="button"
                        icon="fa-solid fa-pen-to-square"
                        className={style["list-title-icon"]}
                        onClick={handleListNameEdit}
                      />
                    </>
                  )}
                  {listNameEdited && (
                    <>
                      <div>
                        <input
                          className={`${
                            style["list-title-input"]
                          } ${getClassNames("list-title-input")}`}
                          type="text"
                          value={enteredListName}
                          onChange={handleListNameChange}
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
                      />
                    </>
                  )}
                </div>

                {list.items.map((shop) => {
                  const currentShop = allShops.find((item) => {
                    return item.shopId === shop.shopId;
                  });
                  let shopName = "Removed shop";
                  if (currentShop) shopName = currentShop.shopName;
                  return (
                    <EditableShop
                      key={shop.shopId}
                      id={shop.shopId}
                      name={shopName}
                      products={shop.products}
                      shops={shops}
                      onShopNameEdit={handleShopNameEdit}
                      onShopDelete={handleShopDelete}
                      onAddProduct={handleAddProduct}
                      onProductNameChange={handleProductNameChange}
                      onProductDelete={handleProductDelete}
                      onQtyChange={handleQtyChange}
                      onDoneStatusChange={handleDoneStatusChange}
                    />
                  );
                })}

                <Button
                  type="button"
                  look="primary"
                  className={style["add-shop-button"]}
                  onClick={handleAddShopButtonPress}
                >
                  Add a new shop
                </Button>

                <Card nested={true}>
                  <h3 className={style["note-header"]}>Note</h3>
                  <textarea
                    className={`${style["note"]} ${getClassNames("note")}`}
                    value={list.note}
                    onChange={handleNoteChange}
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

                <Prompt
                  shown={shopPromptShown}
                  setShown={setShopPromptShown}
                  coordinates={coordinates}
                  options={shops.map((item) => item.shopName)}
                  noOptionsText="There are no more shops to add"
                  onBackgroundClick={handlePromptBackgroundClick}
                  onSelect={handleAddShop}
                />
              </Card>
              <Button
                className={style["save-button"]}
                type="button"
                look="primary"
                onClick={handleAddOrUpdateList}
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
