import {onCall} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {calculateOrderTotal} from "./utils/calculations";

admin.initializeApp();

export const placeorder = onCall(async (request) => {
  const firestore = admin.firestore();
  const lines = request.data.lines;

  return await firestore.runTransaction(async (transaction) => {
    // 1. Get the current counter value
    const counterRef = firestore.collection("metadata").doc("orderCounter");
    const counterDoc = await transaction.get(counterRef);

    let orderNumber = 1;
    if (counterDoc.exists) {
      orderNumber = (counterDoc.data()?.count || 0) + 1;
    }

    // 2. Increment the counter
    transaction.set(counterRef, {count: orderNumber}, {merge: true});

    // 3. Create the order draft with the orderNumber
    const draft = {
      ...request.data,
      pickupTime: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending",
      total: calculateOrderTotal(lines),
      createdBy: request.auth?.uid,
      orderNumber: orderNumber,
    };

    // 4. Save the order
    const newOrderRef = firestore.collection("order").doc();
    transaction.set(newOrderRef, draft);

    return {
      id: newOrderRef.id,
      order: draft,
    };
  });
});
