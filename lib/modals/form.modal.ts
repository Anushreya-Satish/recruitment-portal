import { connect } from "../db";

export interface IFormData {
  id?: string;
  Name: string;
  Email: string;
  RegistrationNumber: string;
  Phone: string;
  Pref: string;
  Department?: string;
  departments?: string[];
  Questions?: Record<string, string>;
  responses?: Record<string, any>;
  shortlisted?: boolean;
}

const COLLECTION_NAME = "formData";

const formatDoc = (doc: any) => {
  const data = doc.data ? doc.data() : doc;
  return {
    id: doc.id,
    _id: doc.id,
    ...data,
  };
};

class FormDataModel {
  private data: IFormData;

  constructor(data: IFormData) {
    this.data = {
      ...data,
      shortlisted: false,
    };
  }

  /*
  // ORIGINAL SAVE IMPLEMENTATION (Issues identified):
  // 1. Always performed an .add() operation, causing duplicate records per user.
  // 2. Unaware of existing department applications, causing answers to overwrite.

  async save() {
    const db = await connect();
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      createdAt: new Date(),
    });
    const snapshot = await docRef.get();
    return formatDoc(snapshot);
  }
  */

  // OPTIMIZED SAVE IMPLEMENTATION (Upsert / Atomic Update):
  async save() {
    const db = await connect();
    const regNo = this.data.RegistrationNumber;
    const currentPref = this.data.Pref || this.data.Department || "General";

    if (regNo) {
      // Check for existing student record
      const existingRef = await db
        .collection(COLLECTION_NAME)
        .where("RegistrationNumber", "==", regNo)
        .limit(1)
        .get();

      if (!existingRef.empty) {
        const doc = existingRef.docs[0];
        const existingData = doc.data();

        // Combine department list uniquely
        const updatedDepartments = Array.from(
          new Set([
            ...(existingData.departments || []),
            ...(existingData.Pref ? [existingData.Pref] : []),
            currentPref,
          ])
        );

        // Map responses cleanly under department keys
        const updatedResponses = {
          ...(existingData.responses || {}),
          [currentPref]: this.data.Questions || {},
        };

        await db.collection(COLLECTION_NAME).doc(doc.id).update({
          Name: this.data.Name,
          Email: this.data.Email,
          Phone: this.data.Phone,
          departments: updatedDepartments,
          responses: updatedResponses,
          updatedAt: new Date(),
        });

        const updatedSnapshot = await db.collection(COLLECTION_NAME).doc(doc.id).get();
        return formatDoc(updatedSnapshot);
      }
    }

    // Default new entry creation
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      departments: [currentPref],
      responses: {
        [currentPref]: this.data.Questions || {},
      },
      createdAt: new Date(),
    });

    const snapshot = await docRef.get();
    return formatDoc(snapshot);
  }

  static async create(data: IFormData) {
    return new FormDataModel(data).save();
  }

  static async find(query: Partial<IFormData> = {}) {
    const db = await connect();
    let ref: any = db.collection(COLLECTION_NAME);

    if (query.Email) ref = ref.where("Email", "==", query.Email);
    if (query.Department) ref = ref.where("Department", "==", query.Department);
    if (query.RegistrationNumber) ref = ref.where("RegistrationNumber", "==", query.RegistrationNumber);

    const snapshot = await ref.get();
    return snapshot.docs.map((doc: any) => formatDoc(doc));
  }

  static async findOne(query: Partial<IFormData> = {}) {
    const results = await FormDataModel.find(query);
    return results[0] || null;
  }

  static async countDocuments(query: Partial<IFormData> = {}) {
    const results = await FormDataModel.find(query);
    return results.length;
  }

  static async findByIdAndUpdate(
    id: string,
    update: Partial<IFormData> | { $set?: Partial<IFormData> }
  ) {
    const db = await connect();
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const updateData =
      update && typeof update === "object" && "$set" in update
        ? update.$set
        : update;

    await docRef.update(updateData ?? {});
    const snapshot = await docRef.get();
    return snapshot.exists ? formatDoc(snapshot) : null;
  }

  static async findById(id: string) {
    const db = await connect();
    const snapshot = await db.collection(COLLECTION_NAME).doc(id).get();
    return snapshot.exists ? formatDoc(snapshot) : null;
  }
}

export default FormDataModel;