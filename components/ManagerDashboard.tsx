import React from 'react';
import { User, Opportunity, Sale } from '../types';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ManagerDashboardProps {
  user: User;
  opportunities: Opportunity[];
  savedSales: Sale[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, opportunities, savedSales }) => {
  // Filter data based on branchId if manager, or all if supervisor
  const isSupervisor = user.role === 'supervisor';
  
  const filteredOpportunities = isSupervisor 
    ? opportunities 
    : opportunities.filter(o => o.branchId === user.branchId);
    
  const filteredSales = isSupervisor 
    ? savedSales 
    : savedSales.filter(s => s.branchId === user.branchId);

  const totalSales = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalLeads = filteredOpportunities.length;
  const conversionRate = totalLeads > 0 ? (filteredSales.length / totalLeads * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do {user.role === 'manager' ? 'Gerente' : 'Supervisor'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">Total de Vendas</h3>
          <p className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">Total de Leads</h3>
          <p className="text-2xl font-bold">{totalLeads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">Taxa de Conversão</h3>
          <p className="text-2xl font-bold">{conversionRate}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Pipeline de Oportunidades</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Implement pipeline columns here */}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Performance por Vendedor</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={[]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
