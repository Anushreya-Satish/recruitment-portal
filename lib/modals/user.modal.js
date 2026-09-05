import { connect } from "../db";

const COLLECTION_NAME = "users";

class UserModel {
  constructor(data) {
    this.data = data;
  }

  /*
  // ORIGINAL SAVE IMPLEMENTATION (Issues identified):
  // 1. Direct addition using .add() created duplicate user documents on repeated logins.
  // 2. Lacks update capability for modified user profile details (e.g., registration number, photo, name).

  async save() {
    const db = await connect();
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      createdAt: new Date(),
    });
    const snapshot = await docRef.get();
    return { id: docRef.id, ...snapshot.data() };
  }
  */

  // OPTIMIZED SAVE IMPLEMENTATION (Upsert / Prevent Duplicates):
  async save() {
    const db = await connect();
    const primaryIdentifier = this.data.email || this.data.uid;

    if (primaryIdentifier) {
      const field = this.data.email ? "email" : "uid";
      const existingRef = await db
        .collection(COLLECTION_NAME)
        .where(field, "==", primaryIdentifier)
        .limit(1)
        .get();

      if (!existingRef.empty) {
        // User exists — update record cleanly without duplicating entries
        const doc = existingRef.docs[0];
        await db.collection(COLLECTION_NAME).doc(doc.id).update({
          ...this.data,
          updatedAt: new Date(),
        });

        const updatedSnapshot = await db.collection(COLLECTION_NAME).doc(doc.id).get();
        return { id: doc.id, ...updatedSnapshot.data() };
      }
    }

    // Create new user entry if non-existent
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...this.data,
      createdAt: new Date(),
    });
    const snapshot = await docRef.get();
    return { id: docRef.id, ...snapshot.data() };
  }

  static async create(user) {
    return new UserModel(user).save();
  }

  static async findOne(query = {}) {
    const db = await connect();
    const [field, value] = Object.entries(query)[0] || [];

    if (!field || value === undefined) return null;

    const snapshot = await db.collection(COLLECTION_NAME).where(field, "==", value).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // FIX: Added findOneAndUpdate support for seamless integration with authentication flows
  static async findOneAndUpdate(query = {}, updateData = {}, options = {}) {
    const existing = await UserModel.findOne(query);

    if (existing) {
      const db = await connect();
      await db.collection(COLLECTION_NAME).doc(existing.id).update({
        ...updateData,
        updatedAt: new Date(),
      });
      const updatedSnapshot = await db.collection(COLLECTION_NAME).doc(existing.id).get();
      return { id: existing.id, ...updatedSnapshot.data() };
    }

    if (options.upsert) {
      return UserModel.create({ ...query, ...updateData });
    }

    return null;
  }

  static async findById(id) {
    const db = await connect();
    const snapshot = await db.collection(COLLECTION_NAME).doc(id).get();
    return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
  }
}

export default UserModel;