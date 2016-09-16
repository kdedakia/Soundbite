import RNFS from 'react-native-fs';
import { initializeApp } from 'firebase';
import config from '../../config';
import RNFetchBlob from 'react-native-fetch-blob'

/* FIREBASE */
firebase.initializeApp({
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  storageBucket: config.STORAGE_BUCKET,
});

var db = firebase.database();
const rootRef = db.ref();
export const markersRef = rootRef.child('markers');
var storageRef = firebase.storage().ref();
var soundFile = storageRef.child('bites/FILENAME.mp4');
const pathPrefix = RNFS.DocumentDirectoryPath;

/* FETCH BLOB */
const fs = RNFetchBlob.fs
const Blob = RNFetchBlob.polyfill.Blob
const dirs = RNFetchBlob.fs.dirs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
window.fs = fs
RNFetchBlob.config({ fileCache : true, appendExt : 'mp4' })

export function uploadAudio(filename) {
  let rnfbURI = RNFetchBlob.wrap(pathPrefix + "/" + filename) // <255kb

  // create Blob from file path
  Blob
    .build(rnfbURI, { type : 'audio/mp4;'})
    .then((blob) => {
      // upload image using Firebase SDK
      firebase.storage()
        .ref('bites')
        .child(filename)
        .put(blob, { contentType : 'audio/mp4' })
        .then((snapshot) => {
          blob.close()
          deleteAudio(filename)
        })
        .catch( function(error)  {
          console.error("DB: Firebase Upload", error)
        })
    })
    .catch( function(error) {
      console.error("DB: Blob Building",error);
    })
}

export function deleteAudio(filename) {
  return RNFS.unlink(pathPrefix + "/" + filename + '.mp4')
    .then(() => {
      console.log("DELETED FILE COPY")
    })
    .catch((err) => {
      console.log("Delete Audio Error: " + err.message);
    });
}

export function getFile(fileName) {
  return new Promise((resolve, reject) => {
    resolve(
      storageRef.child('bites/' + fileName).getDownloadURL().then( (url) => {
        RNFS.downloadFile({
          fromUrl: url,
          toFile: pathPrefix + "/current.mp4",
        })
      })
    )
  });
}

export function pushMarker(marker) {
  let newRef = markersRef.push(marker);
  return newRef;
}

export function getMarkers() {
  return new Promise((resolve,reject) => {
    markersRef.once('value')
    .then((snapshot) => {
      resolve(snapshot.val());
    })
    .catch((err) => reject(err))
  });
}

// TODO: Redux this maybe?
export function signIn(token) {
  return new Promise((resolve,reject) => {
    firebase.auth().signInWithCustomToken(token)
    .then((user) => {
      console.log('firebase user',user)
      resolve()
    })
    .catch((err) => {
      console.error("DB: Sign In", err);
      reject(err)
    })
  })
}

export function signOut() {
  firebase.auth().signOut()
  .then(() => {
    console.log("Firebase Signed Out");
  })
  .catch((err) => console.log("Firebase Signout Error: " + err))
}
