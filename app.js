require('dotenv').config();

const express = require('express');
const path = require('path');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 4000;

// SendGrid API Key setzen
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const msg = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        replyTo: email,
        subject: `Neue Anfrage über die Webseite: ${leistung}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Neue Kontaktanfrage</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>E-Mail:</strong> ${email}</p>
                <p><strong>Gewünschte Leistung:</strong> ${leistung}</p>

                <h3>Nachricht:</h3>
                <p>${nachricht}</p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);

        res.status(200).json({
            success: true,
            message: 'Ihre Anfrage wurde erfolgreich gesendet.'
        });

    } catch (error) {
        console.error('SendGrid Fehler:', error);

        if (error.response) {
            console.error(error.response.body);
        }

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