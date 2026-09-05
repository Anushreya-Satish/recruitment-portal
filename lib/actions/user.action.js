// import User from "@lib/modals/user.modal";
// import { connect } from "@lib/db";
import User from "../modals/user.modal";
import { connect } from "../db";

export async function createUser(user) {
  try {
    await connect();

    /*
    // ORIGINAL IMPLEMENTATION (Issues identified):
    // 1. Missing Duplicate Safeguard: Using direct User.create(user) throws an unhandled server 
    //    exception if a user with the same email or OAuth ID signs in again.
    // 2. Unhandled Field Updates: Does not support updating existing user details (e.g., registration number) 
    //    upon subsequent logins.

    const newUser = await User.create(user);
    console.log("New user created: ", newUser);
    return JSON.parse(JSON.stringify(newUser));
    */

    // OPTIMIZED IMPLEMENTATION (Upsert strategy):
    if (!user || (!user.email && !user.clerkId && !user.uid)) {
      throw new Error("Missing primary user identifier (email or user ID).");
    }

    // Determine primary key identifier (handles both OAuth and traditional Auth models)
    const filter = user.email ? { email: user.email } : { uid: user.uid };

    // FIX 1: Use findOneAndUpdate with upsert: true
    // Creates a new record if missing, or updates existing record without breaking user session state
    const updatedUser = await User.findOneAndUpdate(
      filter,
      {
        $set: {
          ...user,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("User successfully processed/created:", updatedUser._id);

    // FIX 2: Safely serialize Mongoose document to plain JS object for Next.js Server Components
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw new Error(`Error processing user record: ${error.message}`);
  }
}