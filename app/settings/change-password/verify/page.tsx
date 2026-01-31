import { redirect } from "next/navigation";

export default function ChangePasswordVerifyRedirectPage() {
  redirect("/donor/dashboard/security/verify");
}


