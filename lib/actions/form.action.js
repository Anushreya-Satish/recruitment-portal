import { connect } from "@/lib/db";

export const submitFormAction = async (formData) => {
  try {
    const db = await connect();
    const { Name, Email, RegistrationNumber, Phone, Pref, ...Questions } =
      formData;

    /*
    // ORIGINAL IMPLEMENTATION (Issues identified):
    // 1. Direct addition creates duplicate student documents without checking for previous submissions.
    // 2. Questions are stored under a single static key, which overwrites previous department answers 
    //    if a student applies to a second choice.
    
    await db.collection("formData").add({
      Name,
      Email,
      RegistrationNumber,
      Phone,
      Pref,
      Questions,
      createdAt: new Date(),
    });
    */

    // FIX 1: Input guard clause to prevent corrupt/empty records from entering Firestore
    if (!RegistrationNumber || !Email) {
      return {
        success: false,
        message: "Registration Number and Email are required.",
      };
    }

    // FIX 2: Check if an existing application already exists for this student
    const existingApplicantRef = await db
      .collection("formData")
      .where("RegistrationNumber", "==", RegistrationNumber)
      .limit(1)
      .get();

    if (!existingApplicantRef.empty) {
      // Applicant exists — update record without losing prior responses
      const doc = existingApplicantRef.docs[0];
      const existingData = doc.data();

      // Merge departments array without duplicates
      const updatedDepartments = Array.from(
        new Set([...(existingData.departments || [existingData.Pref]), Pref])
      );

      // Key responses by preference/department name to keep answers separated
      const updatedResponses = {
        ...(existingData.responses || {}),
        [Pref]: Questions,
      };

      await db.collection("formData").doc(doc.id).update({
        Name,
        Email,
        Phone,
        departments: updatedDepartments,
        responses: updatedResponses,
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Application updated with new department response!",
      };
    }

    // FIX 3: Initial application creation with structured department-keyed storage
    await db.collection("formData").add({
      Name,
      Email,
      RegistrationNumber,
      Phone,
      departments: [Pref],
      responses: {
        [Pref]: Questions,
      },
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Form submitted successfully!",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
