# Workflows
## Aufzählung der modellierten Flows
1. Registrierung und Login
    - Kontoerstellung
        - erfolgreich
        - nicht erfolgreich
    - Anmeldung mit Magiclink
        - erfolgreich
        - nicht erfolgreich
2. Problem-Meldeprozess (Bürger Workflow)
    - Melden von:
        - Verunreinigung
        - Deffekt
        - Parkverstoß
    - Schritte:
        - Beschreibung des Problems
        - Hochladen eines Fotos
            - erfolgreich
            - nicht erfolgreich
        - Abschicken
        - Bestätigungs-Mail
3. Meldungs-Bearbeitungsprozess (Stadtmitarbeiter Workflow)
    - Meldungen anzeigen
    - Meldungen bearbeiten
    - Status bei Meldung ändern
    - Meldung kommentieren
    - Meldung priorisieren
4. Administrationsprozess (Admin Workflow)
    - Bestehende Konten zu Mitarbeiterkonten befördern
    - Bestehende Mitarbeiterkonten zu Bürgerkonten herabstufen
5. Archivierungsprozess
    - Erledigte Meldungen werden vom System nach 30 Tagen archiviert
    - Erledigte Meldungen werden auf Knopfdruck archiviert
6. Bilderlöschung
    - nach Bedarf/1 mal im Monat werden alle ungenutzten Bilder älter als 72h gelöscht
7. Konto-Löschung
    - Admin löscht Konto eines Nutzers
    - Nutzer löscht eigenes Konto

## Welche Modellierung nutzen wir?
Nach Vorlesung Einführung Wirtschaftsinformatik von Herr Prof. Dr. Melcher