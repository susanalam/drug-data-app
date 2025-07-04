"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { DrugDialog } from "@/components/drug-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import type { Drug } from "@/lib/types"
import { fetchDrug, fetchCategories, deleteDrug } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function DrugDetailPage({ params }: { params: { id: string } }) {
  const [drug, setDrug] = useState<Drug | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        try {
          const drugData = await fetchDrug(params.id)
          setDrug(drugData)

          const categoriesData = await fetchCategories()
          setCategories(categoriesData)
        } catch (apiError) {
          console.warn("API not available:", apiError)

          // Show a more user-friendly error for API connection issues
          if (apiError instanceof Error && apiError.message.includes("connect to the API")) {
            toast({
              title: "API Connection Error",
              description:
                "Unable to connect to the backend API. Please ensure the server is running on http://localhost:8000",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load drug details. Please try again.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error("Failed to load drug:", error)
        toast({
          title: "Error",
          description: "Failed to load drug details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, toast])

  const handleDrugUpdated = (updatedDrug: Drug) => {
    setDrug(updatedDrug)
    setShowEditDialog(false)
    toast({
      title: "Success",
      description: "Drug information has been updated successfully.",
    })
  }

  const handleDeleteConfirm = async () => {
    if (!drug) return

    try {
      await deleteDrug(drug.id)
      toast({
        title: "Success",
        description: `${drug.name} has been deleted successfully.`,
      })
      router.push("/")
    } catch (error) {
      console.error("Failed to delete drug:", error)
      toast({
        title: "Error",
        description: "Failed to delete drug. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-32 mb-6"></div>
          <div className="h-10 bg-gray-100 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="h-64 bg-gray-100 rounded mb-4"></div>
              <div className="h-8 bg-gray-100 rounded mb-2"></div>
              <div className="h-8 bg-gray-100 rounded"></div>
            </div>
            <div className="md:col-span-2">
              <div className="h-12 bg-gray-100 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-100 rounded"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!drug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Drug Not Found</h3>
            <p className="text-gray-500 mb-6">The drug you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Return to Drug List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Drug List
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{drug.name}</h1>
          <Badge variant="outline" className="mt-2">
            {drug.category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p>{drug.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p>{new Date(drug.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p>{new Date(drug.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="ingredients">
            <TabsList className="mb-4">
              <TabsTrigger value="ingredients">Ingredients & Forms</TabsTrigger>
              <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
              <TabsTrigger value="contraindications">Contraindications</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients">
              <Card>
                <CardHeader>
                  <CardTitle>Active Ingredients</CardTitle>
                  <CardDescription>The primary active components of this drug</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {drug.active_ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Dosage Forms</CardTitle>
                  <CardDescription>Available forms of this medication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {drug.dosage_forms.map((form, index) => (
                      <Badge key={index} variant="secondary">
                        {form}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="side-effects">
              <Card>
                <CardHeader>
                  <CardTitle>Side Effects</CardTitle>
                  <CardDescription>Potential side effects associated with this medication</CardDescription>
                </CardHeader>
                <CardContent>
                  {drug.side_effects.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {drug.side_effects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No side effects listed</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contraindications">
              <Card>
                <CardHeader>
                  <CardTitle>Contraindications</CardTitle>
                  <CardDescription>Conditions where this drug should not be used</CardDescription>
                </CardHeader>
                <CardContent>
                  {drug.contraindications.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {drug.contraindications.map((contraindication, index) => (
                        <li key={index}>{contraindication}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No contraindications listed</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {drug && (
        <DrugDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleDrugUpdated}
          categories={categories}
          drug={drug}
          mode="edit"
        />
      )}

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Drug"
        description={`Are you sure you want to delete ${drug.name}? This action cannot be undone.`}
      />
    </div>
  )
}
