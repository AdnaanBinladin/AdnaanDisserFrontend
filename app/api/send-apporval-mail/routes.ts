import { NextRequest, NextResponse } from "next/server"

// This API route sends an approval email to NGOs
// In production, you would use a service like Resend, SendGrid, or Nodemailer

interface ApprovalEmailRequest {
  email: string
  ngoName: string
  approvedAt?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ApprovalEmailRequest = await request.json()
    const { email, ngoName, approvedAt } = body

    if (!email || !ngoName) {
      return NextResponse.json(
        { error: "Email and NGO name are required" },
        { status: 400 }
      )
    }

    // Option 1: Forward to your backend API
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5050/api"
    
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/admin/send-approval-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          ngoName,
          approvedAt: approvedAt || new Date().toISOString(),
        }),
      })

      if (backendResponse.ok) {
        return NextResponse.json({ success: true, message: "Email sent via backend" })
      }
    } catch {
      console.log("Backend email service not available, using fallback")
    }

    // Option 2: Use Resend if configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FoodShare <noreply@foodshare.com>",
          to: [email],
          subject: "Your FoodShare NGO Account Has Been Approved!",
          html: generateApprovalEmailHTML(ngoName),
        }),
      })

      if (resendResponse.ok) {
        return NextResponse.json({ success: true, message: "Email sent via Resend" })
      }
    }

    // If no email service is configured, log and return success
    // In production, you would want to handle this differently
    console.log(`[EMAIL] Would send approval email to: ${email} for NGO: ${ngoName}`)
    
    return NextResponse.json({ 
      success: true, 
      message: "Email notification logged (configure email service for actual delivery)",
      debug: { email, ngoName }
    })

  } catch (error) {
    console.error("Error sending approval email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}

function generateApprovalEmailHTML(ngoName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Approved</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">FoodShare</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Connecting Food Donors with NGOs</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">✓</span>
            </div>
          </div>
          
          <h2 style="color: #166534; text-align: center; margin: 0 0 20px 0;">Congratulations, ${ngoName}!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! Your NGO account on FoodShare has been <strong>approved</strong> by our admin team.
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            You can now log in to your account and start claiming food donations from generous donors in your area.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Login to FoodShare
            </a>
          </div>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">What you can do now:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Browse available food donations in your area</li>
              <li>Claim donations that match your needs</li>
              <li>Coordinate pickup with donors</li>
              <li>Track your impact and history</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} FoodShare. All rights reserved.</p>
          <p style="margin: 10px 0 0 0;">Reducing food waste, one donation at a time.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
