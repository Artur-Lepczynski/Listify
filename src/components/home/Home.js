import Button from "../UI/Button";
import Page from "../UI/Page";
import style from "./Home.module.css"; 

export default function Home(){
  return (
    <Page>
      <h1>Hello from Home.js</h1>
      <Button look="primary">Button text</Button>
      <br></br>
      <hr></hr>
      <Button look="secondary">Button text</Button>
      <br></br>
      <hr></hr>
      <Button look="secondary" disabled >Button text</Button>
    </Page>
  )
}