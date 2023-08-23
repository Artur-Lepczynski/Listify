import Button from "../UI/Button";
import Card from "../UI/Card";
import Loader from "../UI/Loader";
import Page from "../UI/Page";
import style from "./Home.module.css"; 

export default function Home(){
  return (
    <Page>
      <h1>Hello from Home.js</h1>
      <Button type="button" look="primary">Button text</Button>
      <br></br>
      <hr></hr>
      <Button type="button" look="secondary">Button text</Button>
      <br></br>
      <hr></hr>
      <Button type="button" look="secondary" disabled >Button text</Button>
      <br></br>
      <hr></hr>
      <Button type="link" look="primary">Button text</Button>
      <br></br>
      <hr></hr>
      <Button type="button" look="primary" loading={true}>Button text</Button>
      <br></br>
      <hr></hr>
      <Button type="link" look="primary" loading={true}>Button text</Button>
      <hr></hr>

    </Page>
  )
}