"use client";

import { useState } from "react";
import { KpiBonusCreateSchema, KpiForm } from "./kpi-form";
import { toast } from "sonner";

type KpiBonusWithId = KpiBonusCreateSchema & { id: string }

const Page = () => {
  const [kpiData, setKpiData] = useState<KpiBonusWithId[]>([])
  const [editingItem, setEditingItem] = useState<KpiBonusWithId | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (data: KpiBonusCreateSchema) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newItem: KpiBonusWithId = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      }

      setKpiData((prev) => [...prev, newItem])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (data: KpiBonusCreateSchema) => {
    if (!editingItem) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setKpiData((prev) => prev.map((item) => (item.id === editingItem.id ? { ...data, id: editingItem.id } : item)))
      setEditingItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setKpiData((prev) => prev.filter((item) => item.id !== id))
      toast.success("KPI bonus deleted successfully")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (item: KpiBonusWithId) => {
    setEditingItem(item)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">KPI Bonus Management</h1>
          <p className="text-muted-foreground">Create and manage KPI bonuses with targets and objectives</p>
        </div>

        {/* Create Form */}
        {!editingItem && <KpiForm mode="create" onSubmit={handleCreate} isLoading={isLoading} />}

        {/* Edit Form */}
        {editingItem && (
          <KpiForm
            mode="edit"
            initialData={editingItem}
            onSubmit={handleEdit}
            onCancel={handleCancelEdit}
            isLoading={isLoading}
          />
        )}

        {/* KPI List */}  
        <pre className="text-sm text-primary">
          {JSON.stringify(kpiData, null, 2)}  
        </pre>        
      </div>
    </div>
  );  
}

export default Page;