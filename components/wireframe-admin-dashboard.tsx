export function WireframeAdminDashboard() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="border border-gray-300 px-4 py-2">[ADMIN PORTAL LOGO]</div>
            <div className="border border-gray-300 px-4 py-2">[ADMIN MENU]</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="border-2 border-gray-400 p-4">
              <div className="border-b border-gray-300 pb-2 mb-4">Admin Navigation</div>
              <div className="space-y-2">
                <div className="border border-gray-300 p-2">[Manage Users]</div>
                <div className="border border-gray-300 p-2">[Approve NGOs]</div>
                <div className="border border-gray-300 p-2">[Generate Reports]</div>
                <div className="border border-gray-300 p-2">[System Settings]</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="border-2 border-gray-400 p-4 text-center">
                <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                <div>Total Users</div>
              </div>
              <div className="border-2 border-gray-400 p-4 text-center">
                <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                <div>Active NGOs</div>
              </div>
              <div className="border-2 border-gray-400 p-4 text-center">
                <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                <div>Total Donations</div>
              </div>
              <div className="border-2 border-gray-400 p-4 text-center">
                <div className="border border-gray-300 p-2 mb-2">[NUMBER]</div>
                <div>Pending Approvals</div>
              </div>
            </div>

            {/* User Management Table */}
            <div className="border-2 border-gray-400">
              <div className="border-b-2 border-gray-400 p-4">
                <h3 className="font-normal">User Management</h3>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 border-r border-gray-300">Name</th>
                      <th className="text-left p-2 border-r border-gray-300">Role</th>
                      <th className="text-left p-2 border-r border-gray-300">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300">[User Name 1]</td>
                      <td className="p-2 border-r border-gray-300">[Role]</td>
                      <td className="p-2 border-r border-gray-300">[Status Toggle]</td>
                      <td className="p-2">[Edit] [Delete]</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300">[User Name 2]</td>
                      <td className="p-2 border-r border-gray-300">[Role]</td>
                      <td className="p-2 border-r border-gray-300">[Status Toggle]</td>
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
