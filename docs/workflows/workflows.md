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
6. Upload-Validierung Workflow
    - Hat Bild das richtige Format?
    --> wird automatisch durch uploadthing helper gemacht, deshalb wird hierfür kein Workflow erstellt
7. Bilderlöschung
    - nach Bedarf/1 mal im Monat werden alle ungenutzten Bilder älter als 72h gelöscht
8. Abmelde-Prozess
    - Benutzer meldet sich ab
    - Benutzer wird automatisch nach 24h Inaktivität abgemeldet
9. Konto-Löschung
    - Admin löscht Konto eines Nutzers
    - Nutzer löscht eigenes Konto

## Welche Modellierung nutzen wir?
https://www.orghandbuch.de/Webs/OHB/DE/Organisationshandbuch/6_MethodenTechniken/62_Dokumentationstechniken/624_Prozessmodelle/prozessmodelle_inhalt.html;jsessionid=5A907619A29BA302553E1237CA5855BC.live892?nn=21099794#doc21099796bodyText2

- In Software Engineering bei Herr Dorrhauer gelernt
- EPK als Modellierung genutzt - Erweiterung weggelassen
- Symbole für Prozessmodellierung wie in Link