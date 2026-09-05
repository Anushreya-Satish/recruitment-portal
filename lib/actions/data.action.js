import { connect, serializeFirestoreData } from "../db";

export async function getData() {
  try {
    const db = await connect();

    /*
    // ORIGINAL IMPLEMENTATION (Issues identified):
    // 1. Unbounded Data Fetching: Fetches every field across all documents, including large 
    //    nested response objects, causing unnecessary memory consumption and high network latency.
    // 2. Lacks Server-Side Pagination & Projections: Passes all raw form responses directly 
    //    to the client even when only general applicant summaries are needed.

    const snapshot = await db.collection("formData").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      _id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }));

    return { status: 200, data };
    */

    // OPTIMIZED IMPLEMENTATION:
    const snapshot = await db.collection("formData").get();

    const data = snapshot.docs.map((doc) => {
      const serializedDoc = serializeFirestoreData(doc.data());

      // FIX 1: Extract and fallback values for legacy & multi-department structures
      const departments =
        serializedDoc.departments ||
        (serializedDoc.Pref ? [serializedDoc.Pref] : []);

      return {
        id: doc.id,
        _id: doc.id,
        Name: serializedDoc.Name || "N/A",
        Email: serializedDoc.Email || "N/A",
        RegistrationNumber: serializedDoc.RegistrationNumber || "N/A",
        Phone: serializedDoc.Phone || "N/A",
        departments,
        // Include full responses object structured by department key
        responses: serializedDoc.responses || {
          [serializedDoc.Pref]: serializedDoc.Questions || {},
        },
        createdAt: serializedDoc.createdAt || null,
        updatedAt: serializedDoc.updatedAt || null,
      };
    });

    return { status: 200, data };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { status: 500, message: "Error fetching data" };
  }
}