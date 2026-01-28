export default function LoginWireframe() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="border-2 border-gray-400 p-4 mb-6 text-center">
          <div className="text-xl font-bold">LOGO</div>
          <div className="text-sm text-gray-600">Food Waste Reduction System</div>
        </div>

        {/* Login Form */}
        <div className="border-2 border-gray-400 p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">LOGIN</h1>

          {/* Email Field */}
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">EMAIL</div>
            <div className="border border-gray-400 p-3 bg-gray-50">
              <div className="text-gray-500">email@example.com</div>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">PASSWORD</div>
            <div className="border border-gray-400 p-3 bg-gray-50">
              <div className="text-gray-500">••••••••</div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <div className="text-sm font-semibold mb-2">SELECT ROLE</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-gray-400 p-3 text-center bg-gray-50">DONOR</div>
              <div className="border border-gray-400 p-3 text-center">NGO</div>
              <div className="border border-gray-400 p-3 text-center">ADMIN</div>
            </div>
          </div>

          {/* Login Button */}
          <div className="border-2 border-black p-3 text-center font-bold bg-gray-200 mb-4">LOGIN</div>

          {/* Register Link */}
          <div className="text-center text-sm">
            <span className="underline">Don't have an account? Register</span>
          </div>
        </div>
      </div>
    </div>
  )
}
