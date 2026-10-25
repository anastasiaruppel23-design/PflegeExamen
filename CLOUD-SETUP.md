# PflegeFokus: sichere Konten und Cloud-Lernstand

## Status
Die Konto-Oberfläche und Cloud-Synchronisierung sind im Quellcode integriert, aber **noch nicht live**, bis ein eigenes Supabase-Projekt eingerichtet und verbunden ist. Ohne Einrichtung funktioniert die App weiterhin lokal.

## Einrichtung
1. Auf https://supabase.com ein Projekt anlegen. Region passend zu EU/Deutschland wählen; Preise, Limits und Datenschutzbedingungen prüfen.
2. In Supabase SQL Editor den Inhalt von `supabase-schema.sql` ausführen. Sicherstellen, dass Row Level Security (RLS) aktiv ist und die vier Policies existieren.
3. Unter Authentication → Providers E-Mail-Anmeldung aktivieren und E-Mail-Bestätigung eingeschaltet lassen. SMTP-Versand/Rate-Limits und E-Mail-Vorlagen vor öffentlichem Start prüfen.
4. Unter Authentication → URL Configuration die tatsächliche GitHub-Pages-Adresse als Site URL bzw. erlaubte Redirect URL konfigurieren. Eine spätere eigene Domain ebenfalls hinzufügen.
5. Unter Project Settings → API die **Project URL** und den **Publishable/anon Key** kopieren und in `cloud-config.js` einsetzen. Diese beiden Werte dürfen öffentlich sein; **niemals `service_role`/secret Keys in GitHub eintragen**.
6. Auf GitHub Pages deployen; Anmeldung, E-Mail-Bestätigung, Passwort-Reset und RLS mit zwei separaten Testkonten prüfen. Den Passwort-Reset-Flow und die E-Mail-Vorlagen vor Produktionsstart ausdrücklich testen.
7. Datenschutzinformation, Kontakt/Impressum, Aufbewahrung und Löschung der Konten klären, bevor öffentlich Nutzerkonten angeboten werden.

## Sicherheit und Grenzen
- Die Tabelle `learning_progress` speichert einen JSON-Lernstand pro Supabase-Auth-User. RLS beschränkt den Zugriff auf die eigene `user_id`.
- Das Konto ersetzt nicht die lokale Speicherung; auf gemeinsam genutzten Geräten bleiben lokale Daten nach Abmeldung erhalten. Nicht auf fremden Geräten verwenden.
- Anmeldung fragt vor dem Überschreiben lokaler Daten durch Cloud-Daten nach. Beim ersten Konto kann ein vorhandener lokaler Lernstand explizit hochgeladen werden.
- Für sensible Gesundheits- oder Patientendaten ist die App nicht vorgesehen.
- Passwort-Zurücksetzung, Konto-Löschung, Einwilligung/Datenschutzhinweise und Konfliktbehandlung bei parallelen Geräten müssen vor öffentlicher Freigabe weiter geprüft bzw. ergänzt werden.
