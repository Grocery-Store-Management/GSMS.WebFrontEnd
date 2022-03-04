import { firebase } from "./firebase";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";


export const firestore = firebase.firestore();

export const useFirestore = () => {

  const getCollection = (collectionId: string)  => {
    // const { uid, photoURL } = auth.currentUser;
    var getOptions = {
      source: "cache",
    };
    const document = firestore
      .collection(collectionId)
      .doc("uid")
      .get()
      .then((doc) => {
        console.log(doc);
      });
  };
};
