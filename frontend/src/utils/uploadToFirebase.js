// src/utils/uploadToFirebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const uploadImageToFirebase = async (file) => {
  if (!file) throw new Error("No file provided");

  const imageRef = ref(storage, `events/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};
