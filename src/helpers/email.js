const { NODEMAILER_EMAIL, LOCAL_URL, RAILWAY_URL, PORT } = require('../config')

module.exports = {
    register: async (email, otp) => {
        return {
            from: NODEMAILER_EMAIL,
            to: email,
            subject: "Account Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Account Verification</h2>
                <p style="color: #555; text-align: center; font-size: 18px;">Your verification code:</p>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; border-radius: 5px;">
                    <span style="color: tomato;"><b>${otp}</b></span>
                </div>
                <p style="color: #555; text-align: center;">This code expires in 10 minute(s).</p>
                <p style="color: #FF0000; text-align: center;"><i>Don't share this verification code to anyone</i></p>
            </div>
        `,
        }
    },

    requestResetPassword: async (email, resetToken) => {
        return {
            from: NODEMAILER_EMAIL,
            to: email,
            subject: "Reset Password",
            html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Reset Password</h2>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; border-radius: 5px;">
                    <span style="color: tomato;">Click <a href="https://ilearn-tech.vercel.app/reset-password/${resetToken}">here</a> to reset your password</span>
                </div>
                <h2 style="color: #333; text-align: center;">Or copy this link</h2>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; border-radius: 5px;">
                    <p>
                        https://ilearn-tech.vercel.app/reset-password/${resetToken}
                    </p>
                </div>
            </div>
        `,
        }
    },

    resendOtp: async (email, otp) => {
        return {
            from: NODEMAILER_EMAIL,
            to: email,
            subject: "Your New Verification Code",
            html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">New Verification Code</h2>
                <p style="color: #555; text-align: center; font-size: 18px;">Your new verification code:</p>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; border-radius: 5px;">
                    <span style="color: tomato;"><b>${otp}</b></span>
                </div>
                <p style="color: #555; text-align: center;">This code expires in 10 minute(s).</p>
                <p style="color: #FF0000; text-align: center;"><i>Do not share this verification code with anyone.</i></p>
            </div>
            `,
        }
    },
}