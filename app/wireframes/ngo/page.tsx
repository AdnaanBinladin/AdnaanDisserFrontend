export default function NGOWireframe() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6 flex justify-between items-center">
          <div className="text-xl font-bold">NGO DASHBOARD</div>
          <div className="border border-gray-400 p-2">LOGOUT</div>
        </div>

        {/* Filter Section */}
        <div className="border border-gray-400 p-4 mb-6">
          <div className="font-bold mb-3">FILTERS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-semibold mb-2">LOCATION</div>
              <div className="border border-gray-400 p-2 bg-gray-50">Select Location</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">EXPIRY</div>
              <div className="border border-gray-400 p-2 bg-gray-50">All Items</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">FOOD TYPE</div>
              <div className="border border-gray-400 p-2 bg-gray-50">All Types</div>
            </div>
          </div>
        </div>

        {/* Available Donations */}
        <div className="border-2 border-gray-400 mb-6">
          <div className="border-b border-gray-400 p-4 font-bold bg-gray-100">AVAILABLE DONATIONS</div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border border-gray-400 p-4">
                <div className="font-bold mb-2">Food Item {item}</div>
                <div className="text-sm mb-1">Quantity: 15 kg</div>
                <div className="text-sm mb-1">Expires: 2024-01-20</div>
                <div className="text-sm mb-1">Location: City Center</div>
                <div className="text-sm mb-3">Donor: Restaurant ABC</div>
                <div className="border-2 border-black p-2 text-center font-bold bg-gray-200">CLAIM</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claimed Donations */}
        <div className="border-2 border-gray-400">
          <div className="border-b border-gray-400 p-4 font-bold bg-gray-100">MY CLAIMED DONATIONS</div>

          <div className="border-b border-gray-400 p-3 grid grid-cols-4 gap-4 font-semibold bg-gray-50">
            <div>FOOD NAME</div>
            <div>QUANTITY</div>
            <div>CLAIMED DATE</div>
            <div>STATUS</div>
          </div>

          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-gray-400 p-3 grid grid-cols-4 gap-4">
              <div>Claimed Item {item}</div>
              <div>8 kg</div>
              <div>2024-01-10</div>
              <div className="border border-gray-400 px-2 py-1 text-center text-xs">COLLECTED</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
