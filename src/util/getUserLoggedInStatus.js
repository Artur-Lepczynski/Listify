import { getAuth, onAuthStateChanged } from "firebase/auth";

export function getUserLoggedInStatus() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });
}