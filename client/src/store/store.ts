import { makeAutoObservable } from "mobx";
import IUser from "../models/IUser";
import AuthService from "../services/AuthService";

export default class Store {
  user = {} as IUser;
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  //mutations
  setUser(user: IUser) {
    this.user = user;
  }

  setAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  //actions
  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.isAuth = true;
      this.user = response.data.user;
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.isAuth = true;
      this.user = response.data.user;
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("token");
      this.isAuth = false;
      this.user = {} as IUser;
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
}
