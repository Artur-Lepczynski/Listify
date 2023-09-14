import style from "./Home.module.css";
import Button from "../UI/Button";
import Page from "../UI/Page";
import logo from "../../images/logo512.png";
import TextCarousel from "./TextCarousel";
import Feature from "./Feature";
import Icon from "../UI/Icon";

export default function Home() {
  return (
    <Page className={style.page}>
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
        <Feature
          icon="📃"
          title="Streamlined Shopping Lists"
          text="Listify makes creating and managing shopping lists a breeze. With our intuitive interface, you can effortlessly add products and shops to your lists. Marking items as done and even completing entire lists is as easy as a tap or a click. Say goodbye to the hassle of traditional list-making and experience the convenience of Listify."
        />
        <Feature
          icon="🔄"
          title="Real-Time Synchronization"
          text="Stay in sync across all your devices without lifting a finger. Listify's real-time synchronization ensures that your lists, favorite shops, and settings are always up-to-date, no matter where you access the app. Say goodbye to manual updates and page reloads — Listify keeps you connected effortlessly."
        />
        <Feature
          icon="📱"
          title="Accessible on Any Device"
          text="Whether you're on your desktop, tablet, or mobile phone, Listify is there for you. Thanks to the Progressive Web App technology, you can download the app on your phone just like a native mobile app. It's just as intuitive on your mobile as it is on the web. Shopping on the go has never been this user-friendly."
        />
        <Feature
          icon="📊"
          title="Track Your Progress"
          text="Want to know how productive your shopping trips are? Listify lets you dive deep into your shopping activity. Track the number of lists you've added and completed, monitor the products you've added or marked as done, all broken down by different time frames. Gain insights into your shopping habits like never before with Listify's comprehensive activity tracking."
        />
        <div className={style.spacer}></div>
        <footer className={style.footer}>
          <p>Free and open source on</p>
          <Icon type="outside-link" icon="fa-brands fa-github" to="https://github.com/Artur-Lepczynski/Listify"/>
        </footer>
      </div>
    </Page>
  );
}