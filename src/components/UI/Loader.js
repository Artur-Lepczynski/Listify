import style from "./Loader.module.css";

export default function Loader(props) {
  return (
    <div
      className={`${style.loader} ${
        props.size === "large" ? style["loader-large"] : style["loader-small"]
      }`}
    ></div>
  );
}
