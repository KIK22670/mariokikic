const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Formulardaten lesen
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// public-Ordner freigeben
app.use(express.static(path.join(__dirname, 'public')));

// Startseite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Kontaktformular absenden
app.post('/kontakt', async (req, res) => {
    const { name, email, leistung, nachricht } = req.body;

    if (!name || !email || !leistung || !nachricht) {
        return res.status(400).json({
            success: false,
            message: 'Bitte alle Felder ausfüllen.'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `Neue Anfrage über die Webseite: ${leistung}`,
            html: `
                <h2>Neue Kontaktanfrage</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>E-Mail:</strong> ${email}</p>
                <p><strong>Gewünschte Leistung:</strong> ${leistung}</p>

                <h3>Nachricht:</h3>
                <p>${nachricht}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Ihre Anfrage wurde erfolgreich gesendet.'
        });

    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);

        res.status(500).json({
            success: false,
            message: 'Fehler beim Senden der Anfrage.'
        });
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});