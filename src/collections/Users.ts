import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
	},
	auth: {
		verify:
			process.env.NODE_ENV === 'production'
				? {
						generateEmailSubject: () => {
							return 'Web Admin Email Verification'
						},
						generateEmailHTML: ({ token }) => {
							const publicUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
							const verifyURL = `${publicUrl}/admin/users/verify/${token}`
							return `
                <!DOCTYPE html>
                <html>
                  <body style="font-family: Arial, sans-serif;">
                    <h2>THUNDE | Email Verification</h2>
                    <br/>
                    <p>Hello,</p>
                    <p>You are receiving this because a web admin account was created with this email for a THUNDE hosted site: <a href="${publicUrl}">${publicUrl}</a></p>
                    <p>Click below to verify your email address:</p>
                    <a href="${verifyURL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                    </a>
                  </body>
                </html>
              `
						},
					}
				: undefined,
		forgotPassword:
			process.env.NODE_ENV === 'production'
				? {
						expiration: 3600,
						generateEmailSubject: () => {
							return `Web Admin Password Reset`
						},
						generateEmailHTML: (args) => {
							const { token } = args || {}
							const resetURL = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/reset/${token}`
							return `
                <!DOCTYPE html>
                <html>
                  <body style="font-family: Arial, sans-serif;">
                    <h1>THUNDE | Password Reset</h1>
                    <br/>
                    <p>Hello,</p>
                    <p>You are receiving this because a password reset was requested for your web admin account.</p>
                    <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                    <p>Click below to proceed:</p>
                    <a href="${resetURL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                      Reset Password
                    </a>
                    <p style="font-size: 12px; color: #666;">This link expires in 1 hour.</p>
                  </body>
                </html>
              `
						},
					}
				: undefined,
	},
	fields: [
		// Email added by default
		// Add more fields as needed
	],
}
