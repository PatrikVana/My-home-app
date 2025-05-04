// 📁 server/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const getTransporterOptions = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) return null;

    // ✅ Pro Seznam.cz a další české služby použij vlastní SMTP
    if (['seznam.cz', 'email.cz', 'centrum.cz'].includes(domain)) {
        return {
            host: 'smtp.seznam.cz',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
    }

    // ✅ Gmail, Yahoo, Outlook a další podporované služby přes service
    if (domain.includes('gmail.com')) return { service: 'gmail' };
    if (domain.includes('outlook.com')) return { service: 'outlook' };
    if (domain.includes('yahoo.com')) return { service: 'yahoo' };

    return null; // fallback – můžeš doplnit vlastní SMTP podle potřeby
};

const createTransporter = (email) => {
    const options = getTransporterOptions(email);

    if (!options) {
        throw new Error('Nepodporovaná e-mailová služba nebo chybné přihlašovací údaje.');
    }

    // V případě "service" doplň auth
    if (options.service) {
        options.auth = {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        };
    }

    return nodemailer.createTransport(options);
};

const sendEmail = async (to, subject, html) => {
    const transporter = createTransporter(to);

    const mailOptions = {
        from: `My Home App <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

// 🔔 Typy emailových notifikací
export const sendRegistrationEmail = async (to) => {
    const html = `<p>Děkujeme za registraci. Váš účet nyní čeká na schválení administrátorem.</p>`;
    await sendEmail(to, 'Registrace přijata', html);
};

export const sendApprovalEmail = async (to) => {
    const html = `<p>Váš účet byl schválen a nyní je aktivní. Můžete se přihlásit.</p>`;
    await sendEmail(to, 'Registrace schválena', html);
};

export const sendStatusChangeEmail = async (to, isActive) => {
    const html = isActive
        ? `<p>Váš účet byl znovu aktivován. Nyní se můžete opět přihlásit.</p>`
        : `<p>Váš účet byl pozastaven administrátorem. Pro více informací nás kontaktujte.</p>`;

    const subject = isActive ? 'Účet aktivován' : 'Účet pozastaven';

    await sendEmail(to, subject, html);
};

export const sendRoleChangeEmail = async (to, role) => {
    const html = role === "user"
        ? `<p>Vaše práva byly nastaveny na běžného uživatele.</p>`
        : (role === "admin") ? `<p>Vaše práva byli nastaveny na Administrátora.</p>`
        : `<p>Vaše práva byly nastaveny na hlavního Administrátora.</p>`;

    const subject = "změna Práv";

    await sendEmail(to, subject, html);
};

export const sendDeleteEmail = async (to) => {
    const html = `<p>Váš účet byl odstraněn. Všechny vaše úkoly a poznámky byly smazány.</p>`;
    await sendEmail(to, 'Účet byl odstraněn', html);
};

export const sendRejectEmail = async (to) => {
    const html = `<p>Vaše registrace byla zamítnuta. Pokud si myslíte, že se jedná o omyl, kontaktujte nás.</p>`;
    await sendEmail(to, 'Registrace zamítnuta', html);
};
