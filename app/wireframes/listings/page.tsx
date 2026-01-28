export default function ListingsWireframe() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6 text-center">
          <div className="text-2xl font-bold">FOOD LISTINGS</div>
          <div className="text-sm text-gray-600">Browse Available Food Donations</div>
        </div>

        {/* Search and Filters */}
        <div className="border border-gray-400 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="text-sm font-semibold mb-2">SEARCH</div>
              <div className="border border-gray-400 p-3 bg-gray-50">Search food items...</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">LOCATION</div>
              <div className="border border-gray-400 p-3 bg-gray-50">All Locations</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">EXPIRY</div>
              <div className="border border-gray-400 p-3 bg-gray-50">All Items</div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">Showing 24 available food items</div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div key={item} className="border-2 border-gray-400 p-4">
              {/* Food Image Placeholder */}
              <div className="border border-gray-400 h-32 mb-3 flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">FOOD IMAGE</div>
              </div>

              <div className="font-bold text-lg mb-2">Food Item {item}</div>
              <div className="text-sm mb-1">Quantity: 12 kg</div>
              <div className="text-sm mb-1">Expires: 2024-01-25</div>
              <div className="text-sm mb-1">Location: Downtown</div>
              <div className="text-sm mb-3">Donor: Bakery XYZ</div>

              {/* Status Indicator */}
              <div className="flex justify-between items-center">
                <div className="border border-gray-400 px-2 py-1 text-xs">AVAILABLE</div>
                <div className="text-xs text-gray-500">2 days left</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <div className="border border-gray-400 px-3 py-2">PREV</div>
            <div className="border-2 border-black px-3 py-2 bg-gray-200">1</div>
            <div className="border border-gray-400 px-3 py-2">2</div>
            <div className="border border-gray-400 px-3 py-2">3</div>
            <div className="border border-gray-400 px-3 py-2">NEXT</div>
          </div>
        </div>
      </div>
    </div>
  )
}
