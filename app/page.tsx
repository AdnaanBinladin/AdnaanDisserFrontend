import { LoginForm } from "@/components/login-form"
import { Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/fruits.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        filter: "brightness(0.9)", // optional: darken slightly for contrast
      }}
    >
      {/* Optional white overlay for readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />


      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FoodShare</h1>
          <p className="text-muted-foreground">
            Reducing waste, feeding communities
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
