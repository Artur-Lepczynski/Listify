import { getAuth, onAuthStateChanged } from "firebase/auth";

export function getUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}