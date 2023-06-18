import $api from "../http";
import { AxiosResponse } from "axios";
import AuthResponse from "../models/response/AuthResponse";

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/login", { email, password }); //second parameter - request body
  }

  static async registration(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/login", { email, password }); //second parameter - request body
  }

  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
}
