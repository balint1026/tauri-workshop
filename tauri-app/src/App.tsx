import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
// import { ask } from "@tauri-apps/plugin-dialog";
import { locale, platform } from "@tauri-apps/plugin-os";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [plat, setPlat] = useState<string | null>(null);
  const [loc, setLoc] = useState<string | null>(null);
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
   /*
     ask("yes?", {
      title:"yes",
      okLabel:"Yes!",
      cancelLabel:"No!",
     });
 */
     const setSystem = async () => {
      const hasPermission = await isPermissionGranted();
      if (!hasPermission){
        const permission = await requestPermission();

        if (permission === "granted"){
          console.log("permission granted");
          sendNotification({
            title: "Hello from Rust",
            body: "This is a notif"
          })
        } else{
          console.log("no permission :c");
          
        }
      }
       setPlat(await platform())
       setLoc(await locale());
     }

     setSystem();
     

  },[])

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <p>{plat}</p>
      <p>{loc}</p>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
