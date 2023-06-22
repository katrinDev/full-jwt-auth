import React, { FC, useContext, useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import IUser from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

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
      <>
        <h1>User ${store.user.email} is authorized</h1>
        <h1>
          {store.user.isActivated
            ? "Account is activated"
            : "Activation is needed!!!"}
        </h1>

        <button
          onClick={() => {
            store.logout();
          }}
        >
          Exit
        </button>
        <div>
          <button onClick={getUsers}>Get all users</button>
        </div>
        {users.map((user) => (
          <div key={user.email}>{user.email}</div>
        ))}
      </>
    );
  }
};

export default observer(App);
// MobX can't track any data changes in a component without an "observer" wrapper
