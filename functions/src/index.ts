import {onCall} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {calculateOrderTotal} from "./utils/calculations";

admin.initializeApp();

export const placeorder = onCall(async (request) => {
  const firestore = admin.firestore();
  const lines = request.data.lines;
  const draft = {
    ...request.data,
    pickupTime: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "pending",
    total: calculateOrderTotal(lines),
    createdBy: request.auth?.uid,
  };
  const order = await firestore.collection("order").add(draft);
  return {
    id: order.id,
    order: draft,
  };
});
