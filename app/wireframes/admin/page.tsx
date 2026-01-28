export default function AdminWireframe() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6 flex justify-between items-center">
          <div className="text-xl font-bold">ADMIN DASHBOARD</div>
          <div className="border border-gray-400 p-2">LOGOUT</div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="border-2 border-gray-400 p-4 w-64">
            <div className="font-bold mb-4">NAVIGATION</div>
            <div className="space-y-2">
              <div className="border border-gray-400 p-2 bg-gray-200">MANAGE USERS</div>
              <div className="border border-gray-400 p-2">APPROVE NGOS</div>
              <div className="border border-gray-400 p-2">GENERATE REPORTS</div>
              <div className="border border-gray-400 p-2">SYSTEM SETTINGS</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="border border-gray-400 p-4 text-center">
                <div className="text-2xl font-bold">150</div>
                <div className="text-sm">TOTAL USERS</div>
              </div>
              <div className="border border-gray-400 p-4 text-center">
                <div className="text-2xl font-bold">45</div>
                <div className="text-sm">ACTIVE DONORS</div>
              </div>
              <div className="border border-gray-400 p-4 text-center">
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm">APPROVED NGOS</div>
              </div>
              <div className="border border-gray-400 p-4 text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm">PENDING APPROVALS</div>
              </div>
            </div>

            {/* User Management Table */}
            <div className="border-2 border-gray-400">
              <div className="border-b border-gray-400 p-4 font-bold bg-gray-100">USER MANAGEMENT</div>

              <div className="border-b border-gray-400 p-3 grid grid-cols-5 gap-4 font-semibold bg-gray-50">
                <div>NAME</div>
                <div>EMAIL</div>
                <div>ROLE</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
              </div>

              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b border-gray-400 p-3 grid grid-cols-5 gap-4">
                  <div>User {item}</div>
                  <div>user{item}@email.com</div>
                  <div>DONOR</div>
                  <div className="border border-gray-400 px-2 py-1 text-center text-xs">ACTIVE</div>
                  <div className="flex gap-2">
                    <div className="border border-gray-400 px-2 py-1 text-xs">EDIT</div>
                    <div className="border border-gray-400 px-2 py-1 text-xs">SUSPEND</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
