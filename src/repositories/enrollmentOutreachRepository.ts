const COLLECTION_NAME = 'enrollmentOutreaches';

export class EnrollmentOutreachRepository {
  db: FirebaseFirestore.Firestore;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
  }

  async getListAsync(clientId: string, filter?: any) {
    let entityCollectionRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.db.collection(
      COLLECTION_NAME,
    );

    if (filter) {

      for (const filterParm in filter) {
        if (Array.isArray(filter[filterParm])) {
            const filterValues = filter[filterParm]
            entityCollectionRef = entityCollectionRef.where(filterParm, 'in', filterValues)
        } else {
            const filterValue = filter[filterParm]
            entityCollectionRef = entityCollectionRef.where(filterParm, '==', filterValue)
        }
      }

    }

    // always filter on client
    entityCollectionRef = entityCollectionRef.where('clientId', '==', clientId)

    const entityRefCollection = await entityCollectionRef.get();
    const entityList = entityRefCollection.docs.map((entityDoc) => {
      const entity = entityDoc.data();
      return entity;
    });

    return entityList;
  }

  async getListForProgramAsync(clientId: string, programId: string) {
    const entityCollectionRef = this.db.collection(COLLECTION_NAME).where('programId', '==', programId);
    const entityRefCollection = await entityCollectionRef.get();
    const entityList = entityRefCollection.docs.map((entityDoc) => {
      const entity = entityDoc.data();
      return entity;
    });
    return entityList;
  }

  async getListForEnrollmentAsync(clientId: string, enrollmentId: string) {
    const entityCollectionRef = this.db.collection(COLLECTION_NAME).where('enrollmentId', '==', enrollmentId);
    const entityRefCollection = await entityCollectionRef.get();
    const entityList = entityRefCollection.docs.map((entityDoc) => {
      const entity = entityDoc.data();
      return entity;
    });
    return entityList;
  }

  async getDetailAsync(clientId: string, id: string) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
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

    const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
    const entityDoc = await entityRef.get();
    if (!entityDoc.exists) {
      await entityRef.set({ id });
    }

    await entityRef.collection('orders').doc(bookId).set(entityJson);
  }

  async patchAsync(id: string, entityJson: any) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
    let entityDoc = await entityRef.get();
    if (entityDoc.exists) {
      await entityRef.set(entityJson, { merge: true });
      entityDoc = await entityRef.get();
    }
    const entity = entityDoc.data();
    return entity;
  }

  async deleteAsync(id: string) {
    const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
    await entityRef.delete();
  }
}
