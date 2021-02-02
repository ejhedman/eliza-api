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
exports.ClientDefRepository = void 0;
const COLLECTION_NAME = 'clientDefs';
class ClientDefRepository {
    constructor(db) {
        this.db = db;
    }
    getListAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            let entityCollectionRef = this.db.collection(COLLECTION_NAME);
            const entityRefCollection = yield entityCollectionRef.get();
            const entityList = entityRefCollection.docs.map((entityDoc) => {
                const entity = entityDoc.data();
                return entity;
            });
            return entityList;
        });
    }
    getDetailAsync(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
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
    patchAsync(clientId, entityJson) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
            let entityDoc = yield entityRef.get();
            if (entityDoc.exists) {
                yield entityRef.set(entityJson, { merge: true });
                entityDoc = yield entityRef.get();
            }
            const entity = entityDoc.data();
            return entity;
        });
    }
    deleteAsync(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityRef = this.db.collection(COLLECTION_NAME).doc(clientId);
            yield entityRef.delete();
        });
    }
}
exports.ClientDefRepository = ClientDefRepository;
