const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// public-Ordner freigeben
app.use(express.static(path.join(__dirname, 'public')));

// Startseite anzeigen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Optional: schöne Links ohne .html
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'information.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'impressum.html'));
});

app.get('/datenschutz', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'datenschutz.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});