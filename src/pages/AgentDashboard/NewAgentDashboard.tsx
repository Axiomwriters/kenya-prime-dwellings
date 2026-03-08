import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import { AgentSidebar } from '../../components/AgentSidebar';

const NewAgentDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AgentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader searchTerm="" onSearchChange={() => {}} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800">Welcome, Agent!</h1>
            <p className="mt-2 text-gray-600">This is your new dashboard.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewAgentDashboard;
