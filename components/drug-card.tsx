"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import type { Drug } from "@/lib/types"
import { deleteDrug } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface DrugCardProps {
  drug: Drug
  onDeleted: (id: string) => void
}

export function DrugCard({ drug, onDeleted }: DrugCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      console.log("Attempting to delete drug:", drug.id) // Debug log

      await deleteDrug(drug.id)

      console.log("Drug deleted successfully:", drug.id) // Debug log
      onDeleted(drug.id)

      toast({
        title: "Success",
        description: `${drug.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete drug:", error)

      // More detailed error handling
      let errorMessage = "Failed to delete drug. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("connect to the API")) {
          errorMessage = "Cannot connect to the API server. Please ensure the backend is running."
        } else if (error.message.includes("404")) {
          errorMessage = "Drug not found. It may have already been deleted."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <Link href={`/drugs/${drug.id}`} className="hover:underline">
              {drug.name}
            </Link>
            <Badge variant="outline" className="text-sm px-3 py-1">{drug.category}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 italic">{drug.description}</p>
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-gray-500">Active Ingredients:</p>
              <p className="text-sm">{drug.active_ingredients.join(", ")}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-500">Dosage Forms:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {drug.dosage_forms.map((form, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {form}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto flex justify-end">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log("Delete button clicked for:", drug.name) // Debug log
                setShowDeleteDialog(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Drug"
        description={`Are you sure you want to delete ${drug.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  )
}
