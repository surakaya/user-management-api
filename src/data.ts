import { User } from "./types.js";
import { randomUUID } from "crypto";
  
export const InitialUsers: User[] = [
    {
        id: randomUUID(),
        name: "Deniz Bakar",
        email: "deniz@gmail.com",
        age: 30
    },
    {
        id: randomUUID(),
        name: "Tuğçe Yılmaz",
        email: "tugce@gmail.com",
        age: 26
    }
];
export const users: User[] = [...InitialUsers];