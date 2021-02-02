export declare class ClientDefRepository {
    db: FirebaseFirestore.Firestore;
    constructor(db: FirebaseFirestore.Firestore);
    getListAsync(): Promise<FirebaseFirestore.DocumentData[]>;
    getDetailAsync(clientId: string): Promise<FirebaseFirestore.DocumentData | null | undefined>;
    storeAsync(entity: any): Promise<void>;
    patchAsync(clientId: string, entityJson: any): Promise<FirebaseFirestore.DocumentData | undefined>;
    deleteAsync(clientId: string): Promise<void>;
}
