export interface User {
  id: string;
  firstName: string;
  lastName: string;
  store: string;
  password: string;
  role: 'supervisor' | 'manager' | 'vendedor';
  branchId?: string;
  photoUrl?: string;
  lastLogin?: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  store: string;
  timestamp: string;
  action: 'login' | 'logout' | 'access';
}
