import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Our Drug Information Database</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Our mission is to provide accurate, comprehensive, and accessible information about medications to help
            patients, healthcare providers, and researchers make informed decisions about drug therapies.
          </p>
          <p className="text-gray-700 mb-4">
            We believe that transparent and reliable drug information is essential for safe and effective healthcare.
            Our database is designed to be a trusted resource for anyone seeking to understand medications better.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Data</h2>
          <p className="text-gray-700 mb-4">
            Our drug database includes detailed information on thousands of medications, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
            <li>Comprehensive drug descriptions and uses</li>
            <li>Mechanism of action explanations</li>
            <li>Dosage recommendations</li>
            <li>Side effect profiles</li>
            <li>Drug interaction warnings</li>
            <li>Food and lifestyle considerations</li>
          </ul>
          <p className="text-gray-700">
            All information is regularly reviewed and updated to ensure accuracy and relevance.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">For Developers</h2>
          <p className="text-gray-700 mb-4">Our platform is built with a modern tech stack:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-3">Backend</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Python-based API</li>
                <li>RESTful architecture</li>
                <li>Secure authentication</li>
                <li>Comprehensive data validation</li>
                <li>Efficient database queries</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-3">Frontend</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>React.js framework</li>
                <li>Responsive design</li>
                <li>Accessible UI components</li>
                <li>Interactive data visualizations</li>
                <li>Fast search capabilities</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            We offer a developer API for researchers and healthcare applications. Our API provides programmatic access
            to our drug database, enabling integration with electronic health records, research tools, and other
            healthcare applications.
          </p>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="font-mono text-sm">GET /api/drugs?category=antibiotics</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/api-docs">View API Documentation</Link>
          </Button>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            We welcome feedback, corrections, and suggestions to improve our database. Please contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> info@drugdatabase.example.com
            <br />
            <strong>Phone:</strong> (555) 123-4567
          </p>
        </section>

        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/drugs">Explore Our Drug Database</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
