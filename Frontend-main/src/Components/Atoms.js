import { atom } from "recoil";

export const currentUserState = atom({
  key: "currentUserState",
  auth_token: null,
  default: null
});

export const tempClient = atom({
    key: "tempClient",
    default: null
  });
