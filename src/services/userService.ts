import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { auth } from '../services/firebaseConfig';

export interface UserPermissions {
  role: 'supervisor' | 'manager' | 'vendor';
  branchId?: string;
  email: string;
}

export async function getUserPermissions(email: string): Promise<UserPermissions | null> {
  if (!email) return null;
  const permissionRef = doc(db, 'permissions', email);
  const permissionDoc = await getDoc(permissionRef);
  
  if (permissionDoc.exists()) {
    return permissionDoc.data() as UserPermissions;
  }
  return null;
}
