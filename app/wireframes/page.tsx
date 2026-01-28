import Link from "next/link"

export default function WireframesPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">Food Waste System - Wireframes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/wireframes/login"
            className="border-2 border-gray-400 p-6 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Login Wireframe</h2>
            <p className="text-gray-600">Authentication and role selection</p>
          </Link>

          <Link
            href="/wireframes/donor"
            className="border-2 border-gray-400 p-6 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Donor Dashboard</h2>
            <p className="text-gray-600">Food donation management</p>
          </Link>

          <Link href="/wireframes/ngo" className="border-2 border-gray-400 p-6 hover:border-gray-600 transition-colors">
            <h2 className="text-xl font-semibold mb-2">NGO Dashboard</h2>
            <p className="text-gray-600">Browse and claim donations</p>
          </Link>

          <Link
            href="/wireframes/admin"
            className="border-2 border-gray-400 p-6 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">User management and reports</p>
          </Link>

          <Link
            href="/wireframes/listings"
            className="border-2 border-gray-400 p-6 hover:border-gray-600 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Food Listings</h2>
            <p className="text-gray-600">Public food search interface</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
