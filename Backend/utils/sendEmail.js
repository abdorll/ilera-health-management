import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendDoctorWelcomeEmail = async ({ firstName, lastName, email, password, department }) => {
    const mailOptions = {
        from: '"Ìlera Health & Wellness" <abdorll001@gmail.com>',
        to: email,
        subject: "Welcome to Ìlera Health & Wellness — Your Doctor Account is Ready",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f7f3; padding: 32px;">
                <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 12px rgba(26,141,79,0.08);">
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <h1 style="color: #1a8d4f; font-size: 24px; margin: 0;">Ìlera Health & Wellness</h1>
                        <p style="color: #7a9b8a; font-size: 14px; margin-top: 4px;">University of Lagos, Akoka, Lagos</p>
                    </div>

                    <hr style="border: none; height: 1px; background: #d0e5d9; margin-bottom: 28px;" />

                    <p style="color: #1a2e23; font-size: 16px; line-height: 1.6;">
                        Dear <strong>Dr. ${firstName} ${lastName}</strong>,
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        We are pleased to inform you that an administrator at <strong>Ìlera Health & Wellness</strong> 
                        has added you as a <strong>${department}</strong> specialist on our platform.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        You can now log in to your account to view patients assigned to you and manage your appointments.
                    </p>

                    <div style="background: #e8f5ee; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #d0e5d9;">
                        <h3 style="color: #14713f; margin: 0 0 16px 0; font-size: 15px;">Your Login Credentials</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px; width: 100px;">Email:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px;">Password:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">${password}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px;">Department:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">${department}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #dc2626; font-size: 13px; line-height: 1.6; background: #fef2f2; padding: 12px 16px; border-radius: 8px; border: 1px solid #fecaca;">
                        ⚠️ <strong>Security Notice:</strong> We recommend changing your password after your first login. 
                        Do not share your credentials with anyone.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7; margin-top: 24px;">
                        We look forward to working with you in providing excellent healthcare services to our patients.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; margin-top: 24px;">
                        Warm regards,<br/>
                        <strong style="color: #1a2e23;">The Ìlera Health & Wellness Team</strong>
                    </p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #7a9b8a; font-size: 12px;">
                        © ${new Date().getFullYear()} Ìlera Health & Wellness | University of Lagos, Akoka, Lagos, Nigeria
                    </p>
                    <p style="color: #7a9b8a; font-size: 12px;">
                        📞 +2349076106639 | +2348121985597
                    </p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};


export const sendAdminWelcomeEmail = async ({ firstName, lastName, email, password }) => {
    const mailOptions = {
        from: '"Ìlera Health & Wellness" <abdorll001@gmail.com>',
        to: email,
        subject: "You've Been Invited as an Admin — Ìlera Health & Wellness",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f7f3; padding: 32px;">
                <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 12px rgba(26,141,79,0.08);">
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <h1 style="color: #1a8d4f; font-size: 24px; margin: 0;">Ìlera Health & Wellness</h1>
                        <p style="color: #7a9b8a; font-size: 14px; margin-top: 4px;">University of Lagos, Akoka, Lagos</p>
                    </div>

                    <hr style="border: none; height: 1px; background: #d0e5d9; margin-bottom: 28px;" />

                    <p style="color: #1a2e23; font-size: 16px; line-height: 1.6;">
                        Dear <strong>${firstName} ${lastName}</strong>,
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        You have been invited to join the <strong>Ìlera Health & Wellness</strong> management team as an <strong>Administrator</strong>.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        As an admin, you will be able to manage patient appointments, assign doctors, register new doctors and admins, and oversee the entire system.
                    </p>

                    <div style="background: #e8f5ee; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #d0e5d9;">
                        <h3 style="color: #14713f; margin: 0 0 16px 0; font-size: 15px;">Your Login Credentials</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px; width: 100px;">Email:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px;">Password:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">${password}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #7a9b8a; font-size: 14px;">Role:</td>
                                <td style="padding: 6px 0; color: #1a2e23; font-size: 14px; font-weight: 600;">Administrator</td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #dc2626; font-size: 13px; line-height: 1.6; background: #fef2f2; padding: 12px 16px; border-radius: 8px; border: 1px solid #fecaca;">
                        ⚠️ <strong>Security Notice:</strong> We recommend changing your password after your first login. 
                        Do not share your credentials with anyone.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7; margin-top: 24px;">
                        Please proceed to log in to the admin portal to start managing the system.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; margin-top: 24px;">
                        Warm regards,<br/>
                        <strong style="color: #1a2e23;">The Ìlera Health & Wellness Team</strong>
                    </p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #7a9b8a; font-size: 12px;">
                        © ${new Date().getFullYear()} Ìlera Health & Wellness | University of Lagos, Akoka, Lagos, Nigeria
                    </p>
                    <p style="color: #7a9b8a; font-size: 12px;">
                        📞 +2349076106639 | +2348121985597
                    </p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};


export const sendEmailChangeNotification = async ({ firstName, lastName, oldEmail, newEmail, role }) => {
    const mailOptions = {
        from: '"Ìlera Health & Wellness" <abdorll001@gmail.com>',
        to: `${oldEmail}, ${newEmail}`,
        subject: "Your Email Address Has Been Updated — Ìlera Health & Wellness",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0f7f3; padding: 32px;">
                <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 12px rgba(26,141,79,0.08);">
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <h1 style="color: #1a8d4f; font-size: 24px; margin: 0;">Ìlera Health & Wellness</h1>
                        <p style="color: #7a9b8a; font-size: 14px; margin-top: 4px;">University of Lagos, Akoka, Lagos</p>
                    </div>

                    <hr style="border: none; height: 1px; background: #d0e5d9; margin-bottom: 28px;" />

                    <p style="color: #1a2e23; font-size: 16px; line-height: 1.6;">
                        Dear <strong>${firstName} ${lastName}</strong>,
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        This is to inform you that an administrator at <strong>Ìlera Health & Wellness</strong> has updated the email address associated with your <strong>${role}</strong> account.
                    </p>

                    <div style="background: #e8f5ee; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #d0e5d9;">
                        <h3 style="color: #14713f; margin: 0 0 16px 0; font-size: 15px;">Email Change Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #7a9b8a; font-size: 14px; width: 120px;">Previous Email:</td>
                                <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 600; text-decoration: line-through;">${oldEmail}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #7a9b8a; font-size: 14px;">New Email:</td>
                                <td style="padding: 8px 0; color: #16a34a; font-size: 14px; font-weight: 600;">${newEmail}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #4a6b57; font-size: 15px; line-height: 1.7;">
                        Please use your new email address (<strong>${newEmail}</strong>) to log in going forward.
                    </p>

                    <p style="color: #dc2626; font-size: 13px; line-height: 1.6; background: #fef2f2; padding: 12px 16px; border-radius: 8px; border: 1px solid #fecaca;">
                        ⚠️ <strong>Not you?</strong> If you did not request this change, please contact the principal admin immediately at <strong>admin@ilera.com</strong>.
                    </p>

                    <p style="color: #4a6b57; font-size: 15px; margin-top: 24px;">
                        Warm regards,<br/>
                        <strong style="color: #1a2e23;">The Ìlera Health & Wellness Team</strong>
                    </p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #7a9b8a; font-size: 12px;">
                        © ${new Date().getFullYear()} Ìlera Health & Wellness | University of Lagos, Akoka, Lagos, Nigeria
                    </p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
