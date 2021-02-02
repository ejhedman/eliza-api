"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRepository = void 0;
const COLLECTION_NAME = 'enrollments';
class EnrollmentRepository {
    constructor(db) {
        this.db = db;
    }
    getListAsync(clientId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityCollectionRef = this.db.collection(COLLECTION_NAME);
            if (filter) {
                for (const filterParm in filter) {
                    if (Array.isArray(filter[filterParm])) {
                        const filterValues = filter[filterParm];
                        entityCollectionRef = entityCollectionRef.where(filterParm, 'in', filterValues);
                    }
                    else {
                        const filterValue = filter[filterParm];
                        entityCollectionRef = entityCollectionRef.where(filterParm, '==', filterValue);
                    }
                }
            }
            // always filter on client
            entityCollectionRef = entityCollectionRef.where('clientId', '==', clientId);
            const entityRefCollection = yield entityCollectionRef.get();
            const entityList = entityRefCollection.docs.map((entityDoc) => {
                const entity = entityDoc.data();
                return entity;
            });
            return entityList;
        });
    }
    getListForClientAsync(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityCollectionRef = this.db.collection(COLLECTION_NAME).where('clientId', '==', clientId);
            const entityRefCollection = yield entityCollectionRef.get();
            const entityList = entityRefCollection.docs.map((entityDoc) => {
                const entity = entityDoc.data();
                return entity;
            });
            return entityList;
        });
    }
    getDetailAsync(clientId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
            const entityDoc = yield entityRef.get();
            if (!entityDoc.exists) {
                return null;
            }
            else {
                const entity = entityDoc.data();
                return entity;
            }
        });
    }
    storeAsync(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityJson = JSON.parse(JSON.stringify(entity));
            const id = entity.id;
            const bookId = entity.bookId;
            const orderBookRef = this.db.collection(COLLECTION_NAME).doc(id);
            const orderBookDoc = yield orderBookRef.get();
            if (!orderBookDoc.exists) {
                // if there's no orderbook, create an empty one to hold the orders
                yield orderBookRef.set({ id });
            }
            yield orderBookRef.collection('orders').doc(bookId).set(entityJson);
        });
    }
    patchAsync(id, entityJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
            let entityDoc = yield entityRef.get();
            if (entityDoc.exists) {
                yield entityRef.set(entityJson, { merge: true });
                entityDoc = yield entityRef.get();
            }
            const entity = entityDoc.data();
            return entity;
        });
    }
    deleteAsync(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(id);
            yield entityRef.delete();
        });
    }
}
exports.EnrollmentRepository = EnrollmentRepository;
