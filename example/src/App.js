import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import "./App.css";
import Sum from "./components/Sum";
import Add from "./components/Add";
import Reset from "./components/Reset";
import Random from "./components/Random";
import Word from "./components/Word";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">CRA Redux Example</header>
        <main>
          <div>
            <Sum />
          </div>
          <div>
            <Add />
          </div>
          <div>
            <Add amount={5} />
          </div>
          <div>
            <Random />
          </div>
          <div>
            <Reset />
          </div>
          <Word />
        </main>
      </div>
    </Provider>
  );
}

export default App;
