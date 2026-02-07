import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Enable CORS for Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { orgName, email, inquiry } = req.body;

    if (!orgName || !email || !inquiry) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 1. Email to Business Owner
    const ownerMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Inquiry from ${orgName}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e0e0e0;">
                    <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center;">
                        <h1 style="color: #DCA349; margin: 0; font-size: 28px; letter-spacing: 1px;">MedHive</h1>
                        <p style="color: #ffffff; margin: 5px 0 0; font-size: 14px; opacity: 0.8;">New Partnership Inquiry</p>
                    </div>
                    <div style="padding: 40px 30px; background-color: #ffffff;">
                        <div style="margin-bottom: 25px;">
                            <p style="margin: 0 0 5px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Organization</p>
                            <p style="margin: 0; font-size: 20px; color: #1a1a1a; font-weight: 600;">${orgName}</p>
                        </div>
                        <div style="margin-bottom: 30px;">
                            <p style="margin: 0 0 5px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Contact Email</p>
                            <p style="margin: 0; font-size: 18px; color: #1a1a1a;">
                                <a href="mailto:${email}" style="color: #DCA349; text-decoration: none; font-weight: 500;">${email}</a>
                            </p>
                        </div>
                        <div style="background-color: #fcfcfc; border-left: 4px solid #DCA349; padding: 20px; border-radius: 35px;">
                            <p style="margin: 0 0 10px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Message</p>
                            <div style="color: #333; line-height: 1.6; font-size: 16px;">
                                ${inquiry.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                    </div>
                    <div style="background-color: #1a1a1a; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} MedHive. Secure Inquiry System.
                    </div>
                </div>
            </div>
        `
    };

    // 2. Email to Client (Confirmation)
    const clientMailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Send to the inquirer
        subject: `We received your inquiry - MedHive`,
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e0e0e0;">
                    <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center;">
                        <h1 style="color: #DCA349; margin: 0; font-size: 28px; letter-spacing: 1px;">MedHive</h1>
                    </div>
                    <div style="padding: 40px 30px; background-color: #ffffff; text-align: center;">
                        <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Inquiry Received</h2>
                        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;">
                            Hello <span style="font-weight: bold; color: #000;">${orgName}</span>,<br><br>
                            Thank you for reaching out to MedHive. We have received your inquiry regarding partnership opportunities. Our business team will review your message and get back to you shortly.
                        </p>
                        <a href="https://medhive.lk" style="display: inline-block; background-color: #DCA349; color: #ffffff; padding: 12px 30px; border-radius: 35px; text-decoration: none; font-weight: bold; font-size: 16px;">Visit Website</a>
                    </div>
                    <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                        <p style="margin: 0; font-size: 14px; color: #888;">You submitted:</p>
                        <p style="margin: 5px 0 0; font-size: 14px; color: #333; font-style: italic;">"${inquiry}"</p>
                    </div>
                    <div style="background-color: #1a1a1a; padding: 20px; text-align: center; color: #666; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} MedHive. All rights reserved.
                    </div>
                </div>
            </div>
        `
    };

    try {
        await Promise.all([
            transporter.sendMail(ownerMailOptions),
            transporter.sendMail(clientMailOptions)
        ]);
        console.log(`Emails sent for ${orgName}`);
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}
