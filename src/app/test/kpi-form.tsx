"use client"

import { toast } from "sonner"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, X, Save } from "lucide-react"

// KPI Bonus Schema
export const kpiBonusCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  category: z.enum(["FP", "CP"]),
  objective: z.string().min(1, "Objective is required"),
  definition: z.string().min(1, "Definition is required"),
  strategy: z.string().min(1, "Strategy is required"),
  type: z.enum(["PROJECT", "IMPROVEMENT"]),
  target100: z.string().min(1, "Target 100% is required"),
  target90: z.string().min(1, "Target 90% is required"),
  target80: z.string().min(1, "Target 80% is required"),
  target70: z.string().min(1, "Target 70% is required"),
})

export type KpiBonusCreateSchema = z.infer<typeof kpiBonusCreateSchema>

interface KpiBonusFormProps {
  mode?: "create" | "edit"
  initialData?: Partial<KpiBonusCreateSchema>
  onSubmit: (data: KpiBonusCreateSchema) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function KpiForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: KpiBonusFormProps) {
  const [isOpen, setIsOpen] = useState(mode === "edit");

  const form = useForm<KpiBonusCreateSchema>({
    resolver: zodResolver(kpiBonusCreateSchema),
    defaultValues: {
      name: initialData?.name || "",
      weight: initialData?.weight || "",
      category: initialData?.category || undefined,
      objective: initialData?.objective || "",
      definition: initialData?.definition || "",
      strategy: initialData?.strategy || "",
      type: initialData?.type || undefined,
      target100: initialData?.target100 || "",
      target90: initialData?.target90 || "",
      target80: initialData?.target80 || "",
      target70: initialData?.target70 || "",
    },
  })

  const handleSubmit = async (data: KpiBonusCreateSchema) => {
    try {
      await onSubmit(data)
      if (mode === "create") {
        form.reset()
        setIsOpen(false)
      } else {
        toast.success("KPI bonus updated successfully")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleCancel = () => {
    if (mode === "create") {
      form.reset()
      setIsOpen(false)
    } else {
      form.reset(initialData)
      onCancel?.()
    }
  }

  if (mode === "create" && !isOpen) {
    return (
      <div className="mb-6">
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New KPI Bonus
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {mode === "create" ? (
                <>
                  <Plus className="h-5 w-5" />
                  Create KPI Bonus
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5" />
                  Edit KPI Bonus
                </>
              )}
            </CardTitle>
            <CardDescription>
              {mode === "create"
                ? "Add a new KPI bonus with targets and objectives"
                : "Update the KPI bonus information"}
            </CardDescription>
          </div>
          {mode === "create" && (
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter KPI name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FP">FP</SelectItem>
                        <SelectItem value="CP">CP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PROJECT">Project</SelectItem>
                        <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objective</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the objective" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="definition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definition</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Define the KPI" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the strategy" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Target Values */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Target Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="target100"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target 100%</FormLabel>
                      <FormControl>
                        <Textarea placeholder="100% target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target90"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target 90%</FormLabel>
                      <FormControl>
                        <Textarea placeholder="90% target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target80"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target 80%</FormLabel>
                      <FormControl>
                        <Textarea placeholder="80% target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target70"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target 70%</FormLabel>
                      <FormControl>
                        <Textarea placeholder="70% target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {mode === "create" ? "Create KPI Bonus" : "Update KPI Bonus"}
              </Button>

              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
