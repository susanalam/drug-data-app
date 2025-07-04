"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

export default function AdminPage() {
  const [drugs, setDrugs] = useState(initialDrugs)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteDrug = (id: string) => {
    setDrugs(drugs.filter((drug) => drug.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="drugs" className="mb-8">
        <TabsList>
          <TabsTrigger value="drugs">Drugs</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="drugs">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search drugs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Drug
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Drug</DialogTitle>
                  <DialogDescription>Fill in the details to add a new drug to the database.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Drug Name</Label>
                    <Input id="name" placeholder="Enter drug name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="analgesics">Analgesics</SelectItem>
                        <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input id="description" placeholder="Brief description" />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="full-description">Full Description</Label>
                    <Textarea id="full-description" placeholder="Detailed description of the drug" rows={3} />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="uses">Uses (one per line)</Label>
                    <Textarea id="uses" placeholder="List uses, one per line" rows={3} />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="how-it-works">How It Works</Label>
                    <Textarea id="how-it-works" placeholder="Explain how the drug works" rows={2} />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" placeholder="URL to drug image" />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Drug</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrugs.length > 0 ? (
                  filteredDrugs.map((drug) => (
                    <TableRow key={drug.id}>
                      <TableCell className="font-medium">{drug.name}</TableCell>
                      <TableCell>{drug.category}</TableCell>
                      <TableCell className="max-w-md truncate">{drug.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDrug(drug.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No drugs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
            <p className="text-gray-500 mb-6">Create and manage drug categories for better organization.</p>

            {/* Category management UI would go here */}
            <div className="text-center py-8 text-gray-500">Category management interface coming soon</div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-500 mb-6">Manage user accounts and permissions.</p>

            {/* User management UI would go here */}
            <div className="text-center py-8 text-gray-500">User management interface coming soon</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const initialDrugs = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    description: "A penicillin antibiotic that fights bacteria",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesics",
    description: "Reduces inflammation and treats pain or fever",
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    category: "Cardiovascular",
    description: "ACE inhibitor that treats high blood pressure",
  },
  {
    id: "metformin",
    name: "Metformin",
    category: "Antidiabetic",
    description: "Used to treat type 2 diabetes",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    category: "Cardiovascular",
    description: "Lowers cholesterol and triglycerides in the blood",
  },
  {
    id: "levothyroxine",
    name: "Levothyroxine",
    category: "Hormones",
    description: "Replaces thyroid hormone normally produced by the thyroid gland",
  },
]
