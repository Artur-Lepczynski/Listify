import style from "./Home.module.css";
import Button from "../UI/Button";
import Page from "../UI/Page";
import logo from "../../images/logo512.png";
import TextCarousel from "./TextCarousel";

export default function Home() {
  return (
    <Page>
      <div className={style["title-fullscreen-wrapper"]}>
        <div className={style["title-inner-wrapper"]}>
          <img src={logo} alt="Listify logo"></img>
          <div className={style["title-text-wrapper"]}>
            <h1>Listify</h1>
            <p>
              Shopping made{" "}
              <TextCarousel
                words={["easy", "quick", "fun", "simple"]}
                time={100}
              />{" "}
            </p>
          </div>
        </div>
        <Button
          to="/auth?action=signup"
          type="link"
          look="secondary"
          className={style["action-button"]}
        >
          Get started <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
      <div className={style["features-fullscreen-wrapper"]}>
        <h2>Features will go here</h2>
      </div>
    </Page>
  );
}
