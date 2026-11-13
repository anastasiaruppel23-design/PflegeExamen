# PflegeFokus: sichere Konten und Cloud-Lernstand

## Status
PflegeFokus verwendet das in `cloud-config.js` verbundene Supabase-Projekt. Die Startseite ist öffentlich. Lernstoff, Lernkarten, Quiz, Fälle und Prüfungstraining öffnen sich mit einem angemeldeten Konto.

## Einrichtung
1. Auf https://supabase.com ein Projekt anlegen. Region passend zu EU/Deutschland wählen; Preise, Limits und Datenschutzbedingungen prüfen.
2. In Supabase SQL Editor zuerst `supabase-schema.sql` ausführen. Danach `supabase-metrics.sql` ausführen, damit der öffentliche Besucher- und Registrierungszähler funktioniert. Sicherstellen, dass Row Level Security (RLS) aktiv ist und die Policies existieren.
3. Unter Authentication → Providers E-Mail-Anmeldung aktivieren und E-Mail-Bestätigung eingeschaltet lassen. Unter Authentication → Emails einen eigenen SMTP-Versand einrichten und die Versandlimits und Vorlagen prüfen. Der Supabase-Standardversand erreicht nur Team-Adressen. Die Registrierung und der Passwort-Reset für andere Adressen brauchen einen konfigurierten Versand.
4. Unter Authentication → URL Configuration `https://anastasiaruppel23-design.github.io/PflegeExamen/` als Site URL und erlaubte Redirect URL konfigurieren. Die Kontoformulare verwenden die Startseite mit abschließendem Schrägstrich.
5. Unter Project Settings → API die **Project URL** und den **Publishable/anon Key** kopieren und in `cloud-config.js` einsetzen. Diese beiden Werte dürfen öffentlich sein; **niemals `service_role`/secret Keys in GitHub eintragen**.
6. Auf GitHub Pages deployen; Anmeldung, E-Mail-Bestätigung, Passwort-Reset und RLS mit zwei separaten Testkonten prüfen. Den Passwort-Reset-Flow und die E-Mail-Vorlagen vor Produktionsstart ausdrücklich testen.
7. Datenschutzinformation, Kontakt/Impressum, Aufbewahrung und Löschung der Konten klären, bevor öffentlich Nutzerkonten angeboten werden.

## Sicherheit und Grenzen
- Die Tabelle `learning_progress` speichert einen JSON-Lernstand pro Supabase-Auth-User. RLS beschränkt den Zugriff auf die eigene `user_id`.
- Die Anmeldung steuert die Anzeige der Lernbereiche. Die GitHub-Pages-Dateien und das öffentliche Repository sind direkt abrufbar.
- Für die Anmeldung und für das Erneuern einer abgelaufenen Sitzung braucht die App Internet. Mit einer vorhandenen Sitzung und geladenem Offline-Cache können Lernende offline weiterarbeiten.
- `app_metrics` enthält ausschließlich Gesamtzahlen. Besuche zählen pro Browser-Sitzung (bis zum Schließen des Tabs); das ist keine verlässliche Zahl einzelner Personen. Registrierungen zählen neu angelegte Supabase-Konten. Die Zähler enthalten keine Namen oder E-Mail-Adressen.
- Das Konto ersetzt nicht die lokale Speicherung; auf gemeinsam genutzten Geräten bleiben lokale Daten nach Abmeldung erhalten. Nicht auf fremden Geräten verwenden.
- Anmeldung fragt vor dem Überschreiben lokaler Daten durch Cloud-Daten nach. Beim ersten Konto kann ein vorhandener lokaler Lernstand explizit hochgeladen werden.
- Für sensible Gesundheits- oder Patientendaten ist die App nicht vorgesehen.
- Passwort-Zurücksetzung, Konto-Löschung, Einwilligung/Datenschutzhinweise und Konfliktbehandlung bei parallelen Geräten müssen vor öffentlicher Freigabe weiter geprüft bzw. ergänzt werden.
