"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter } from "lucide-react"
import { DrugCard } from "@/components/drug-card"
import { DrugDialog } from "@/components/drug-dialog"
import type { Drug } from "@/lib/types"
import { fetchDrugs, fetchCategories } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { ApiStatus } from "@/components/api-status"

export default function Home() {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Try to fetch from the API first
        try {
          const drugsData = await fetchDrugs({})
          setDrugs(drugsData)

          const categoriesData = await fetchCategories()
          setCategories(categoriesData)
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError)

          // Fallback to mock data if API is not available
          const mockDrugs = [
            {
              id: "amoxicillin-123",
              name: "Amoxicillin",
              category: "Antibiotics",
              description: "A penicillin antibiotic that fights bacteria",
              active_ingredients: ["Amoxicillin Trihydrate"],
              dosage_forms: ["Capsule", "Tablet", "Oral suspension"],
              side_effects: ["Diarrhea", "Stomach upset", "Nausea", "Vomiting", "Rash"],
              contraindications: ["Penicillin allergy", "Mononucleosis"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "ibuprofen-456",
              name: "Ibuprofen",
              category: "Analgesics",
              description: "Reduces inflammation and treats pain or fever",
              active_ingredients: ["Ibuprofen"],
              dosage_forms: ["Tablet", "Capsule", "Oral suspension", "Topical gel"],
              side_effects: ["Upset stomach", "Heartburn", "Dizziness", "Headache"],
              contraindications: ["Aspirin allergy", "Heart failure", "Stomach ulcers"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "lisinopril-789",
              name: "Lisinopril",
              category: "Cardiovascular",
              description: "ACE inhibitor that treats high blood pressure",
              active_ingredients: ["Lisinopril"],
              dosage_forms: ["Tablet"],
              side_effects: ["Dizziness", "Headache", "Dry cough", "Fatigue"],
              contraindications: ["Pregnancy", "History of angioedema", "Kidney disease"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "metformin-101",
              name: "Metformin",
              category: "Antidiabetic",
              description: "Used to treat type 2 diabetes",
              active_ingredients: ["Metformin Hydrochloride"],
              dosage_forms: ["Tablet", "Extended-release tablet"],
              side_effects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
              contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]

          setDrugs(mockDrugs)
          setCategories(["Antibiotics", "Analgesics", "Cardiovascular", "Antidiabetic"])

          toast({
            title: "Using Demo Data",
            description: "Backend API is not available. Using demo data for preview.",
            variant: "default",
          })
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load drug data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchTerm) {
        params.name = searchTerm
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory
      }

      const data = await fetchDrugs(params)
      setDrugs(data)
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search Error",
        description: "Failed to search drugs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = async () => {
    setSearchTerm("")
    setSelectedCategory("all")
    try {
      setLoading(true)
      const data = await fetchDrugs({})
      setDrugs(data)
    } catch (error) {
      console.error("Failed to clear filters:", error)
      toast({
        title: "Error",
        description: "Failed to reset drug list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDrugAdded = async (newDrug: Drug) => {
    setShowAddDialog(false)
    setDrugs([...drugs, newDrug])
    toast({
      title: "Success",
      description: `${newDrug.name} has been added successfully.`,
    })
  }

  const handleDrugDeleted = (drugId: string) => {
    setDrugs(drugs.filter((drug) => drug.id !== drugId))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Drug Database</h1>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Drug
        </Button>
      </div>


      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find drugs by name, category, or ingredients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by drug name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
            {(searchTerm || selectedCategory !== "all") && (
              <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto bg-transparent">
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show skeleton cards based on current drugs count or a reasonable default */}
          {Array.from({ length: Math.max(drugs.length || 6, 6) }, (_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100"></CardHeader>
              <CardContent className="py-4">
                <div className="h-4 bg-gray-100 rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded mb-2 w-5/6"></div>
                <div className="h-3 bg-gray-100 rounded w-4/6"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-8 bg-gray-100 rounded w-20"></div>
                <div className="h-8 bg-gray-100 rounded w-20"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : drugs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} onDeleted={handleDrugDeleted} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">No drugs found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search filters"
                : "Start by adding a new drug to the database"}
            </p>
            {searchTerm || selectedCategory !== "all" ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Drug
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <DrugDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleDrugAdded}
        categories={categories}
      />

      <div className="mt-8">
        <ApiStatus />
      </div>
    </div>
  )
}
