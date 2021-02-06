import { IContact } from "./contact";

export interface IUser {
    id: string,
    email: number;
    password: string,
    contacts: IContact[],
    token: string,
  }
