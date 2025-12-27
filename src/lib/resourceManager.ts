
import {
    collection,
    runTransaction,
    doc,
    serverTimestamp,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "sonner";

// Types
export type ResourceType = 'sports' | 'room';
export type ActionType = 'create' | 'update' | 'borrow' | 'return' | 'delete' | 'restock';

export interface ActivityLog {
    id?: string;
    resourceId: string;
    resourceName: string;
    action: ActionType;
    performedBy: string; // User ID
    performedByName: string;
    timestamp: any;
    details?: string;
}

// Logging Function
export const logActivity = async (
    resourceId: string,
    resourceName: string,
    action: ActionType,
    userId: string,
    userName: string,
    details?: string
) => {
    try {
        await addDoc(collection(db, 'resource_logs'), {
            resourceId,
            resourceName,
            action,
            performedBy: userId,
            performedByName: userName,
            timestamp: serverTimestamp(),
            details: details || ''
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

// Sports Equipment: Borrow Item (Atomic Transaction)
export const borrowEquipment = async (
    equipmentId: string,
    userId: string,
    userName: string
) => {
    if (!db) throw new Error("Database not initialized");

    const equipmentRef = doc(db, 'sports_equipment', equipmentId);

    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(equipmentRef);
            if (!sfDoc.exists()) {
                throw new Error("Equipment does not exist!");
            }

            const data = sfDoc.data();
            const currentQty = data.quantity || 0;
            const newQty = currentQty - 1;

            if (currentQty <= 0) {
                throw new Error("Out of stock!");
            }

            // Update Quantity
            transaction.update(equipmentRef, {
                quantity: newQty,
                status: newQty === 0 ? 'out_of_stock' : 'in_stock',
                updatedAt: serverTimestamp()
            });
        });

        // Log outside transaction to avoid complexity, or could be inside if critical
        // We log after success
        // Getting name for log might require passing it or reading it. 
        // For efficiency, we assume success implies we can log.
        // To be safe, we can read name from UI or fetch.
        // Let's pass it or fetch independently if needed, but passing is better.
        // We'll update the signature to take request details or assume caller handles logging wrapper?
        // Better to handle it here if possible, but we don't have the doc data outside the transaction easily without re-reading.
        // We'll log in the calling component for now or improve this function to return success data.
        return true;
    } catch (e: any) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};

// Rooms: Update Status
export const updateRoomStatus = async (
    roomId: string,
    roomName: string,
    isAvailable: boolean,
    userId: string,
    userName: string
) => {
    try {
        await updateDoc(doc(db, 'rooms', roomId), {
            available: isAvailable,
            updatedAt: serverTimestamp()
        });
        await logActivity(roomId, roomName, 'update', userId, userName, `Set status to ${isAvailable ? 'Available' : 'Occupied'}`);
        return true;
    } catch (error) {
        console.error("Error updating room:", error);
        throw error;
    }
};
