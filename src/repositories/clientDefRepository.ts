const COLLECTION_NAME = 'clientDefs';

export class ClientDefRepository {
  db: FirebaseFirestore.Firestore;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
  }

  async getListAsync() {
    let entityCollectionRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.db.collection(
      COLLECTION_NAME,
    );

    const entityRefCollection = await entityCollectionRef.get();
    const entityList = entityRefCollection.docs.map((entityDoc) => {
      const entity = entityDoc.data();
      return entity;
    });

    return entityList;
  }

  async getDetailAsync(clientId: string) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
    const entityDoc = await entityRef.get();
    if (!entityDoc.exists) {
      return null;
    } else {
      const entity = entityDoc.data();
      return entity;
    }
  }

  async storeAsync(entity: any) {
    const entityJson = JSON.parse(JSON.stringify(entity));
    const id = entity.id;
    const bookId = entity.bookId;

    const orderBookRef = this.db.collection(COLLECTION_NAME).doc(id);
    const orderBookDoc = await orderBookRef.get();
    if (!orderBookDoc.exists) {
      // if there's no orderbook, create an empty one to hold the orders
      await orderBookRef.set({ id });
    }

    await orderBookRef.collection('orders').doc(bookId).set(entityJson);
  }

  async patchAsync(clientId: string, entityJson: any) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
    let entityDoc = await entityRef.get();
    if (entityDoc.exists) {
      await entityRef.set(entityJson, { merge: true });
      entityDoc = await entityRef.get();
    }
    const entity = entityDoc.data();
    return entity;
  }

  async deleteAsync(clientId: string) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
    await entityRef.delete();
  }
}
