import style from "./LoaderFullPage.module.css";

export default function LoaderFullPage() {
  return (
    <div className={style.wrapper}>
      <span className={style.loader}></span>
    </div>
  );
}
