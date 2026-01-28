export default function DonorWireframe() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6 flex justify-between items-center">
          <div className="text-xl font-bold">DONOR DASHBOARD</div>
          <div className="border border-gray-400 p-2">LOGOUT</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-400 p-4 text-center">
            <div className="text-2xl font-bold">25</div>
            <div className="text-sm">TOTAL DONATIONS</div>
          </div>
          <div className="border border-gray-400 p-4 text-center">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm">ACTIVE</div>
          </div>
          <div className="border border-gray-400 p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm">CLAIMED</div>
          </div>
          <div className="border border-gray-400 p-4 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm">EXPIRED</div>
          </div>
        </div>

        {/* Add Donation Button */}
        <div className="mb-6">
          <div className="border-2 border-black p-3 text-center font-bold bg-gray-200 max-w-xs">+ ADD NEW DONATION</div>
        </div>

        {/* Food Items Table */}
        <div className="border-2 border-gray-400">
          <div className="border-b border-gray-400 p-4 font-bold bg-gray-100">MY FOOD DONATIONS</div>

          {/* Table Header */}
          <div className="border-b border-gray-400 p-3 grid grid-cols-5 gap-4 font-semibold bg-gray-50">
            <div>FOOD NAME</div>
            <div>QUANTITY</div>
            <div>EXPIRY DATE</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border-b border-gray-400 p-3 grid grid-cols-5 gap-4">
              <div>Food Item {item}</div>
              <div>10 kg</div>
              <div>2024-01-15</div>
              <div className="border border-gray-400 px-2 py-1 text-center text-xs">ACTIVE</div>
              <div className="flex gap-2">
                <div className="border border-gray-400 px-2 py-1 text-xs">EDIT</div>
                <div className="border border-gray-400 px-2 py-1 text-xs">DELETE</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
