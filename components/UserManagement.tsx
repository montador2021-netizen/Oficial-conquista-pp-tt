import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../src/services/firebaseConfig';
import { User, UserPermissions } from '../src/services/userService';

// Você precisará definir o tipo UserPermissions corretamente no seu arquivo
interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserPermissions[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'manager' | 'vendor'>('vendor');
  const [branchId, setBranchId] = useState(currentUser.branchId || '');

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    let q = query(collection(db, 'permissions'));
    // Se for manager, filtra pela branchId dele
    if (currentUser.role === 'manager') {
       // Nota: A regra de segurança do Firestore deve garantir que ele só leia o que pode
       // Aqui filtramos no cliente para facilitar a exibição
    }
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ ...doc.data(), email: doc.id } as UserPermissions));
    
    if (currentUser.role === 'manager') {
        setUsers(data.filter(u => u.branchId === currentUser.branchId && u.role === 'vendor'));
    } else {
        setUsers(data);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await setDoc(doc(db, 'permissions', email), {
      role,
      branchId: currentUser.role === 'supervisor' ? branchId : currentUser.branchId
    });
    setEmail('');
    fetchUsers();
  };

  const handleDelete = async (email: string) => {
    await deleteDoc(doc(db, 'permissions', email));
    fetchUsers();
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Gestão de Equipe</h2>
      
      <form onSubmit={handleSave} className="flex gap-2 mb-4">
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
        <select value={role} onChange={e => setRole(e.target.value as any)} className="border p-2 rounded">
          {currentUser.role === 'supervisor' && <option value="manager">Gerente</option>}
          <option value="vendor">Vendedor</option>
        </select>
        {currentUser.role === 'supervisor' && <input placeholder="Branch ID" value={branchId} onChange={e => setBranchId(e.target.value)} className="border p-2 rounded" />}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Adicionar</button>
      </form>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Email</th>
            <th className="text-left">Role</th>
            <th className="text-left">Branch</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.branchId}</td>
              <td>
                <button onClick={() => handleDelete(u.email)} className="text-red-500">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
