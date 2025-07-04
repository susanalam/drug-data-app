"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Drug } from "@/lib/types"
import { createDrug, updateDrug } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface DrugDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (drug: Drug) => void
  categories: string[]
  drug?: Drug
  mode?: "create" | "edit"
}

export function DrugDialog({ open, onOpenChange, onSave, categories, drug, mode = "create" }: DrugDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [description, setDescription] = useState("")
  const [activeIngredient, setActiveIngredient] = useState("")
  const [activeIngredients, setActiveIngredients] = useState<string[]>([])
  const [dosageForm, setDosageForm] = useState("")
  const [dosageForms, setDosageForms] = useState<string[]>([])
  const [sideEffect, setSideEffect] = useState("")
  const [sideEffects, setSideEffects] = useState<string[]>([])
  const [contraindication, setContraindication] = useState("")
  const [contraindications, setContraindications] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Reset form when dialog opens/closes or drug changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && drug) {
        // Populate form with drug data for editing
        setName(drug.name)
        setCategory(drug.category)
        setDescription(drug.description)
        setActiveIngredients([...drug.active_ingredients])
        setDosageForms([...drug.dosage_forms])
        setSideEffects([...drug.side_effects])
        setContraindications([...drug.contraindications])
      } else {
        // Reset form for creating new drug
        setName("")
        setCategory("")
        setDescription("")
        setActiveIngredients([])
        setDosageForms([])
        setSideEffects([])
        setContraindications([])
      }
      setNewCategory("")
      setActiveIngredient("")
      setDosageForm("")
      setSideEffect("")
      setContraindication("")
      setErrors({})
    }
  }, [open, drug, mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!category && !newCategory) {
      newErrors.category = "Category is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (activeIngredients.length === 0) {
      newErrors.activeIngredients = "At least one active ingredient is required"
    }

    if (dosageForms.length === 0) {
      newErrors.dosageForms = "At least one dosage form is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddActiveIngredient = () => {
    if (activeIngredient.trim()) {
      setActiveIngredients([...activeIngredients, activeIngredient.trim()])
      setActiveIngredient("")
    }
  }

  const handleRemoveActiveIngredient = (index: number) => {
    setActiveIngredients(activeIngredients.filter((_, i) => i !== index))
  }

  const handleAddDosageForm = () => {
    if (dosageForm.trim()) {
      setDosageForms([...dosageForms, dosageForm.trim()])
      setDosageForm("")
    }
  }

  const handleRemoveDosageForm = (index: number) => {
    setDosageForms(dosageForms.filter((_, i) => i !== index))
  }

  const handleAddSideEffect = () => {
    if (sideEffect.trim()) {
      setSideEffects([...sideEffects, sideEffect.trim()])
      setSideEffect("")
    }
  }

  const handleRemoveSideEffect = (index: number) => {
    setSideEffects(sideEffects.filter((_, i) => i !== index))
  }

  const handleAddContraindication = () => {
    if (contraindication.trim()) {
      setContraindications([...contraindications, contraindication.trim()])
      setContraindication("")
    }
  }

  const handleRemoveContraindication = (index: number) => {
    setContraindications(contraindications.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const drugData = {
        name,
        category: newCategory || category,
        description,
        active_ingredients: activeIngredients,
        dosage_forms: dosageForms,
        side_effects: sideEffects,
        contraindications,
      }

      let result

      if (mode === "edit" && drug) {
        result = await updateDrug(drug.id, drugData)
      } else {
        result = await createDrug(drugData)
      }

      onSave(result)
    } catch (error: any) {
      console.error("Failed to save drug:", error)

      // Handle different types of errors
      if (error.message.includes("connect to the API")) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the API server. Please ensure the backend is running.",
          variant: "destructive",
        })
      } else if (error.errors) {
        // Handle validation errors from the backend
        setErrors(error.errors)
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save drug. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Drug" : "Add New Drug"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the information for this drug in the database."
              : "Fill in the details to add a new drug to the database."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter drug name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              {newCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button variant="ghost" size="icon" onClick={() => setNewCategory("")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setNewCategory("New Category")}>
                    New
                  </Button>
                </div>
              )}
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter drug description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Active Ingredients <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={activeIngredient}
                onChange={(e) => setActiveIngredient(e.target.value)}
                placeholder="Add active ingredient"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddActiveIngredient()
                  }
                }}
              />
              <Button type="button" onClick={handleAddActiveIngredient}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.activeIngredients && <p className="text-red-500 text-sm">{errors.activeIngredients}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {activeIngredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => handleRemoveActiveIngredient(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Dosage Forms <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value)}
                placeholder="Add dosage form"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddDosageForm()
                  }
                }}
              />
              <Button type="button" onClick={handleAddDosageForm}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.dosageForms && <p className="text-red-500 text-sm">{errors.dosageForms}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {dosageForms.map((form, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {form}
                  <button
                    type="button"
                    onClick={() => handleRemoveDosageForm(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Side Effects</Label>
            <div className="flex gap-2">
              <Input
                value={sideEffect}
                onChange={(e) => setSideEffect(e.target.value)}
                placeholder="Add side effect"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSideEffect()
                  }
                }}
              />
              <Button type="button" onClick={handleAddSideEffect}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {sideEffects.map((effect, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {effect}
                  <button
                    type="button"
                    onClick={() => handleRemoveSideEffect(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contraindications</Label>
            <div className="flex gap-2">
              <Input
                value={contraindication}
                onChange={(e) => setContraindication(e.target.value)}
                placeholder="Add contraindication"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddContraindication()
                  }
                }}
              />
              <Button type="button" onClick={handleAddContraindication}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {contraindications.map((item, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveContraindication(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "edit" ? "Update Drug" : "Add Drug"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
