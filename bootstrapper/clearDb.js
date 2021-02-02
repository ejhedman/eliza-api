'use strict';

const admin = require('firebase-admin');
const serviceAccount = require("./permissions.json");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fantasyapp-f183c.firebaseio.com"
  });
}
const db = admin.firestore();

function __sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const __deleteDocument = async (ref) => {
  const collections = await ref.listCollections()
  collections.forEach(async collection => await __deleteCollection(collection))
  await ref.delete()
}

const __deleteCollection = async (collectionRef) => {
  const docs = await collectionRef.listDocuments()
  docs.forEach( async (doc) => {
    await __deleteDocument(doc)
  })
}

const clearDb = async () => {
  const targets = [
    "clientDefs",
    "programDefs",
    "solutionDefs",
    "outreachDefs",

    "enrollments",
    "outreaches",
    "outreachResults",
  ]


  targets.forEach( async (target) => {
    const entityRef = db.collection(target)
    await __deleteCollection(entityRef)
  })

  await __sleep(5000)
}

module.exports = clearDb