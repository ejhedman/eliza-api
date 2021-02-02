export declare class SolutionDefRepository {
    db: FirebaseFirestore.Firestore;
    constructor(db: FirebaseFirestore.Firestore);
    getListAsync(clientId: string, filter?: any): Promise<FirebaseFirestore.DocumentData[]>;
    getListForClientAsync(clientId: string): Promise<FirebaseFirestore.DocumentData[]>;
    getDetailAsync(clientId: string, id: string): Promise<FirebaseFirestore.DocumentData | null | undefined>;
    storeAsync(entity: any): Promise<void>;
    patchAsync(id: string, entityJson: any): Promise<FirebaseFirestore.DocumentData | undefined>;
    deleteAsync(id: string): Promise<void>;
}
