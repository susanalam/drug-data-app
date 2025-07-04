import { NextResponse } from "next/server"

// This would typically come from a database
const drugs = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotics",
    description: "A penicillin antibiotic that fights bacteria",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Analgesics",
    description: "Reduces inflammation and treats pain or fever",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    category: "Cardiovascular",
    description: "ACE inhibitor that treats high blood pressure",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "metformin",
    name: "Metformin",
    category: "Antidiabetic",
    description: "Used to treat type 2 diabetes",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    category: "Cardiovascular",
    description: "Lowers cholesterol and triglycerides in the blood",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "levothyroxine",
    name: "Levothyroxine",
    category: "Hormones",
    description: "Replaces thyroid hormone normally produced by the thyroid gland",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const id = searchParams.get("id")

  // Return a specific drug by ID
  if (id) {
    const drug = drugs.find((d) => d.id === id)
    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 })
    }
    return NextResponse.json(drug)
  }

  // Filter drugs by category and/or search term
  let filteredDrugs = [...drugs]

  if (category) {
    filteredDrugs = filteredDrugs.filter((drug) => drug.category.toLowerCase() === category.toLowerCase())
  }

  if (search) {
    filteredDrugs = filteredDrugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(search.toLowerCase()) ||
        drug.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json(filteredDrugs)
}

export async function POST(request: Request) {
  try {
    const drug = await request.json()

    // Validate required fields
    if (!drug.name || !drug.category || !drug.description) {
      return NextResponse.json({ error: "Name, category, and description are required" }, { status: 400 })
    }

    // In a real app, you would save to a database here
    // For this example, we'll just return the drug with a fake ID
    const newDrug = {
      id: drug.name.toLowerCase().replace(/\s+/g, "-"),
      ...drug,
    }

    return NextResponse.json(newDrug, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
