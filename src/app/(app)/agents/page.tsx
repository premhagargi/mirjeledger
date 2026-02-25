'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { getColumns } from './columns';
import { AgentForm } from '@/components/agents/agent-form';
import { agentApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

export default function AgentsPage() {
  const [data, setData] = useState<Agent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const fetchAgents = async () => {
    const agents = await agentApi.getAll();
    setData(agents as Agent[]);
  };

  useEffect(() => {
    fetchAgents();
  }, [isFormOpen]);

  const handleAdd = () => {
    setSelectedAgent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentApi.delete(id);
        toast({ title: 'Success', description: 'Agent deleted successfully.' });
        fetchAgents();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete agent.',
        });
      }
    }
  };
  
  const columns = useMemo(() => getColumns(handleEdit, handleDelete), []);

  return (
    <>
      <PageHeader title="Agents / Suppliers">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="name"
        filterPlaceholder="Filter by name..."
      />
      <AgentForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        agent={selectedAgent}
      />
    </>
  );
}
