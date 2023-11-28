const { NODEMAILER_EMAIL } = require('../config')

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
    requestResetPassword: async (email, otp) => {
        return {
            from: NODEMAILER_EMAIL,
            to: email,
            subject: "Reset Password Verification Code",
            html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Reset Password Verification</h2>
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
}