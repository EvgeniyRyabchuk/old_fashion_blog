import { db } from "@/firebase/config";
import firebase from "firebase";

/**
 * Send a contact message to Firebase Firestore
 * @param {Object} contactData - The contact form data containing name, email, subject, and message
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} - Returns the result of the operation
 */
async function sendContactMessage(contactData) {
    try {
        // Add timestamp to the contact data
        const contactWithTimestamp = {
            ...contactData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending', // Default status
        };

        // Add the contact message to Firestore
        const docRef = await db.collection("contact_messages").add(contactWithTimestamp);
        
        console.log("Contact message sent successfully with ID:", docRef.id);
        return { success: true, id: docRef.id, message: "Contact message sent successfully" };
    } catch (error) {
        console.error("Error sending contact message:", error.message);
        throw new Error(`Failed to send contact message: ${error.message}`);
    }
}

/**
 * Update contact message status
 */
export const updateContactMessageStatus = async (messageId, status) => {
    try {
        await db.collection("contact_messages").doc(messageId).update({
            status: status
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating contact message status:", error);
        throw new Error(error.message || "Failed to update message status");
    }
};

/**
 * Delete a contact message by ID
 */
 const deleteContactMessageById = async (messageId) => {
    try {
        await db.collection("contact_messages").doc(messageId).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting contact message:", error);
        throw new Error(error.message || "Failed to delete contact message");
    }
};

/**
 * Get all contact messages (without pagination)
 */
 const getAllContactMessages = async () => {
    try {
        const snap = await db.collection("contact_messages").get();
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting all contact messages:", error);
        throw new Error(error.message || "Failed to get contact messages");
    }
};

export {
    sendContactMessage,
    deleteContactMessageById,
    getAllContactMessages
};