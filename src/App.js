import "./App.css";

import Layout from "./components/Layout/Layout";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout />
      </PersistGate>
    </Provider>
  );
}

export default App;
