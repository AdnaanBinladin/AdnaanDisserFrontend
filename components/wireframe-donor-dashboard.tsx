export function WireframeDonorDashboard() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="border border-gray-300 px-4 py-2">[LOGO]</div>
            <div className="border border-gray-300 px-4 py-2">[USER MENU]</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="border-2 border-gray-400 p-4">
              <div className="border-b border-gray-300 pb-2 mb-4">Navigation</div>
              <div className="space-y-2">
                <div className="border border-gray-300 p-2">[Dashboard]</div>
                <div className="border border-gray-300 p-2">[Add Donation]</div>
                <div className="border border-gray-300 p-2">[My Donations]</div>
                <div className="border border-gray-300 p-2">[History]</div>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="col-span-9">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border-2 border-gray-400 p-4">
                <div className="text-center">
                  <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                  <div>Total Donations</div>
                </div>
              </div>
              <div className="border-2 border-gray-400 p-4">
                <div className="text-center">
                  <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                  <div>Active Listings</div>
                </div>
              </div>
              <div className="border-2 border-gray-400 p-4">
                <div className="text-center">
                  <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                  <div>Items Claimed</div>
                </div>
              </div>
            </div>

            {/* Food Items Table */}
            <div className="border-2 border-gray-400">
              <div className="border-b-2 border-gray-400 p-4">
                <h3 className="font-normal">My Food Donations</h3>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 border-r border-gray-300">Food Name</th>
                      <th className="text-left p-2 border-r border-gray-300">Quantity</th>
                      <th className="text-left p-2 border-r border-gray-300">Expiry Date</th>
                      <th className="text-left p-2 border-r border-gray-300">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300">[Food Item 1]</td>
                      <td className="p-2 border-r border-gray-300">[Quantity]</td>
                      <td className="p-2 border-r border-gray-300">[Date]</td>
                      <td className="p-2 border-r border-gray-300">[Status]</td>
                      <td className="p-2">[Edit] [Delete]</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300">[Food Item 2]</td>
                      <td className="p-2 border-r border-gray-300">[Quantity]</td>
                      <td className="p-2 border-r border-gray-300">[Date]</td>
                      <td className="p-2 border-r border-gray-300">[Status]</td>
                      <td className="p-2">[Edit] [Delete]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
