import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import "./App.css";
import Add from "./components/Add";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">CRA Redux Example</header>
        <main>
          <Add />
          <Add amount={3} />
        </main>
      </div>
    </Provider>
  );
}

export default App;
