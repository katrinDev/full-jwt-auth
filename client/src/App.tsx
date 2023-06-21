import React, { FC, useContext, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

const App: FC = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <>
        <h1>Authorization</h1>
        <LoginForm />
      </>
    );
  } else {
    return (
      <div>
        <h1>User ${store.user.email} is authorized</h1>
        <button
          onClick={() => {
            store.logout();
          }}
        >
          Exit
        </button>
      </div>
    );
  }
};

export default observer(App);
//before we wrap a component into observer function, MobX can't track any data changes
