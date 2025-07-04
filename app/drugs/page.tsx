import { DrugCard } from "@/components/drug-card"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DrugsPage() {
  const handleDrugDeleted = (id: string) => {
    // Handle drug deletion - in a real app, this would update the state
    console.log("Drug deleted:", id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Drug Database</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="antibiotics">Antibiotics</SelectItem>
              <SelectItem value="analgesics">Analgesics</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="name">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drugs.map((drug) => (
              <DrugCard key={drug.id} drug={drug} onDeleted={handleDrugDeleted} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {drugs.map((drug) => (
              <div key={drug.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                <img
                  src="/placeholder.svg"
                  alt={drug.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{drug.name}</h3>
                  <p className="text-sm text-gray-500">{drug.category}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{drug.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

const drugs = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    description: "A penicillin antibiotic that fights bacteria",
    active_ingredients: ["Amoxicillin Trihydrate"],
    dosage_forms: ["Capsule", "Tablet", "Oral suspension"],
    side_effects: ["Diarrhea", "Stomach upset", "Nausea"],
    contraindications: ["Penicillin allergy", "Mononucleosis"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesics",
    description: "Reduces inflammation and treats pain or fever",
    active_ingredients: ["Ibuprofen"],
    dosage_forms: ["Tablet", "Capsule", "Oral suspension"],
    side_effects: ["Upset stomach", "Heartburn", "Dizziness"],
    contraindications: ["Aspirin allergy", "Heart failure"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    category: "Cardiovascular",
    description: "ACE inhibitor that treats high blood pressure",
    active_ingredients: ["Lisinopril"],
    dosage_forms: ["Tablet"],
    side_effects: ["Dizziness", "Headache", "Dry cough"],
    contraindications: ["Pregnancy", "History of angioedema"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "metformin",
    name: "Metformin",
    category: "Antidiabetic",
    description: "Used to treat type 2 diabetes",
    active_ingredients: ["Metformin Hydrochloride"],
    dosage_forms: ["Tablet", "Extended-release tablet"],
    side_effects: ["Nausea", "Diarrhea", "Stomach upset"],
    contraindications: ["Kidney disease", "Liver disease"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    category: "Cardiovascular",
    description: "Lowers cholesterol and triglycerides in the blood",
    active_ingredients: ["Atorvastatin Calcium"],
    dosage_forms: ["Tablet"],
    side_effects: ["Muscle pain", "Headache", "Nausea"],
    contraindications: ["Liver disease", "Pregnancy"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "levothyroxine",
    name: "Levothyroxine",
    category: "Hormones",
    description: "Replaces thyroid hormone normally produced by the thyroid gland",
    active_ingredients: ["Levothyroxine Sodium"],
    dosage_forms: ["Tablet"],
    side_effects: ["Headache", "Nervousness", "Irritability"],
    contraindications: ["Thyroid storm", "Uncorrected adrenal insufficiency"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]
