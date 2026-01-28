export function WireframeNGODashboard() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="border border-gray-300 px-4 py-2">[LOGO - NGO Portal]</div>
            <div className="border border-gray-300 px-4 py-2">[USER MENU]</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="border-2 border-gray-400 p-4">
              <div className="border-b border-gray-300 pb-2 mb-4">NGO Navigation</div>
              <div className="space-y-2">
                <div className="border border-gray-300 p-2">[Browse Donations]</div>
                <div className="border border-gray-300 p-2">[My Claims]</div>
                <div className="border border-gray-300 p-2">[Profile]</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Search and Filters */}
            <div className="border-2 border-gray-400 p-4 mb-6">
              <div className="border-b border-gray-300 pb-2 mb-4">Search & Filters</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-300 p-2">[Search Box]</div>
                <div className="border border-gray-300 p-2">[Location Filter]</div>
                <div className="border border-gray-300 p-2">[Expiry Filter]</div>
              </div>
            </div>

            {/* Available Donations */}
            <div className="border-2 border-gray-400">
              <div className="border-b-2 border-gray-400 p-4">
                <h3 className="font-normal">Available Food Donations</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 p-4">
                    <div className="border-b border-gray-300 pb-2 mb-2">[Food Image]</div>
                    <div className="space-y-1">
                      <div>[Food Name]</div>
                      <div>[Quantity]</div>
                      <div>[Expiry Date]</div>
                      <div>[Location]</div>
                      <div className="border border-gray-300 p-1 mt-2">[CLAIM BUTTON]</div>
                    </div>
                  </div>
                  <div className="border border-gray-300 p-4">
                    <div className="border-b border-gray-300 pb-2 mb-2">[Food Image]</div>
                    <div className="space-y-1">
                      <div>[Food Name]</div>
                      <div>[Quantity]</div>
                      <div>[Expiry Date]</div>
                      <div>[Location]</div>
                      <div className="border border-gray-300 p-1 mt-2">[CLAIM BUTTON]</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
