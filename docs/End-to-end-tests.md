# End-to-End Test Cases

## Bürger User Stories

### Test: Bürger können Probleme melden
- **Testfallbeschreibung**: Überprüfen, ob ein Bürger erfolgreich ein Problem melden kann, indem er den Typ des Problems auswählt, eine Beschreibung hinzufügt, ggf. ein Foto hochlädt und den Standort angibt.
- **Schritte**:
  1. Melden Sie sich als Bürger an.
  2. Gehen Sie zum Formular zur Meldung eines Problems.
  3. Wählen Sie einen Problemtyp (Defekt, Verunreinigung, Parkverstoß).
  4. Geben Sie eine detaillierte Beschreibung des Problems ein.
  5. (Optional) Laden Sie ein Foto des Problems hoch.
  6. Geben Sie den Standort des Problems ein.
  7. Klicken Sie auf "Absenden".
- **Erwartetes Ergebnis**: Die Meldung wird erfolgreich eingereicht, und der Bürger erhält eine Bestätigung, dass die Meldung eingegangen ist.

### Test: Bürger können die Historie der eingereichten Meldungen sehen
- **Testfallbeschreibung**: Überprüfen, ob ein Bürger eine Liste seiner gemeldeten Probleme mit ihrem aktuellen Status einsehen kann.
- **Schritte**:
  1. Melden Sie sich als Bürger an.
  2. Gehen Sie zur Historie der eingereichten Meldungen.
- **Erwartetes Ergebnis**: Eine Liste der gemeldeten Probleme wird angezeigt, jedes Problem zeigt den aktuellen Status an (z. B. ausstehend, in Bearbeitung, erledigt).

### Test: Bürger erhalten Benachrichtigungen bei Statusänderung einer Meldung
- **Testfallbeschreibung**: Überprüfen, ob der Bürger eine Benachrichtigung (E-Mail) erhält, wenn sich der Status einer Meldung ändert.
- **Schritte**:
  1. Melden Sie sich als Bürger an.
  2. Erstellen Sie eine neue Meldung.
  3. Warten Sie auf eine Statusänderung (z. B. von ausstehend auf erledigt).
  4. Überprüfen Sie die E-Mail-Adresse des Bürgers.
- **Erwartetes Ergebnis**: Der Bürger erhält eine E-Mail, die über die Statusänderung informiert.

### Test: Bürger können eine Meldung löschen
- **Testfallbeschreibung**: Überprüfen, ob ein Bürger eine falsch eingereichte Meldung aus seiner Liste löschen kann.
- **Schritte**:
  1. Melden Sie sich als Bürger an.
  2. Gehen Sie zur Liste der eingereichten Meldungen.
  3. Wählen Sie eine Meldung aus und löschen Sie diese.
- **Erwartetes Ergebnis**: Die Meldung wird gelöscht, und der Bürger erhält eine Bestätigung der Löschung.

### Test: Bürger erhalten nutzerfreundliche Fehlermeldungen
- **Testfallbeschreibung**: Überprüfen, ob der Bürger verständliche Fehlermeldungen bei Fehlern im System erhält.
- **Schritte**:
  1. Melden Sie sich als Bürger an.
  2. Versuchen Sie, ein Problem ohne die Pflichtfelder auszufüllen (z. B. ohne Beschreibung).
- **Erwartetes Ergebnis**: Der Bürger erhält eine klare und verständliche Fehlermeldung.

---

## Stadtmitarbeiter User Stories

### Test: Stadtmitarbeiter können eine Liste der gemeldeten Probleme einsehen
- **Testfallbeschreibung**: Überprüfen, ob Stadtmitarbeiter alle gemeldeten Probleme sehen können, einschließlich Status und Standort.
- **Schritte**:
  1. Melden Sie sich als Stadtmitarbeiter an.
  2. Gehen Sie zur Liste der gemeldeten Probleme.
- **Erwartetes Ergebnis**: Die Liste zeigt alle offenen Meldungen mit dem jeweiligen Status und Standort.

### Test: Stadtmitarbeiter können eine Meldung als erledigt markieren
- **Testfallbeschreibung**: Überprüfen, ob Stadtmitarbeiter den Status einer Meldung auf "erledigt" setzen können.
- **Schritte**:
  1. Melden Sie sich als Stadtmitarbeiter an.
  2. Wählen Sie eine offene Meldung aus.
  3. Markieren Sie die Meldung als erledigt.
- **Erwartetes Ergebnis**: Der Status wird auf "erledigt" geändert und der Bürger erhält eine Benachrichtigung.

### Test: Stadtmitarbeiter können Meldungen bearbeiten
- **Testfallbeschreibung**: Überprüfen, ob Stadtmitarbeiter eine Meldung bearbeiten können (z. B. Notizen hinzufügen oder Status aktualisieren).
- **Schritte**:
  1. Melden Sie sich als Stadtmitarbeiter an.
  2. Wählen Sie eine Meldung aus und fügen Sie Notizen hinzu.
  3. Ändern Sie den Status der Meldung.
- **Erwartetes Ergebnis**: Die Meldung wird erfolgreich bearbeitet und der neue Status sowie die Notizen sind sichtbar.

### Test: Stadtmitarbeiter können Meldungen nach Standort oder Art filtern
- **Testfallbeschreibung**: Überprüfen, ob Stadtmitarbeiter Meldungen nach Standort oder Art filtern können.
- **Schritte**:
  1. Melden Sie sich als Stadtmitarbeiter an.
  2. Wenden Sie einen Filter (nach Standort oder Art) an.
- **Erwartetes Ergebnis**: Nur die entsprechenden Meldungen werden angezeigt.

### Test: Stadtmitarbeiter können gemeldeten Problemen Prioritätsstufen zuweisen
- **Testfallbeschreibung**: Überprüfen, ob Stadtmitarbeiter einer Meldung eine Prioritätsstufe zuweisen können.
- **Schritte**:
  1. Melden Sie sich als Stadtmitarbeiter an.
  2. Wählen Sie eine Meldung aus.
  3. Weisen Sie eine Prioritätsstufe zu (hoch, mittel, niedrig).
- **Erwartetes Ergebnis**: Die Prioritätsstufe wird korrekt zugewiesen und angezeigt.

---

## Admin User Stories

### Test: Admin kann Konten für Stadtmitarbeiter erstellen
- **Testfallbeschreibung**: Überprüfen, ob ein Admin erfolgreich ein Benutzerkonto für einen Stadtmitarbeiter erstellen kann.
- **Schritte**:
  1. Melden Sie sich als Admin an.
  2. Erstellen Sie ein neues Stadtmitarbeiterkonto mit allen notwendigen Informationen.
- **Erwartetes Ergebnis**: Das neue Konto wird erstellt und der Stadtmitarbeiter erhält Zugangsdaten.

### Test: Admin kann Stadtmitarbeiterkonten löschen
- **Testfallbeschreibung**: Überprüfen, ob ein Admin ein Benutzerkonto von Stadtmitarbeitern löschen kann.
- **Schritte**:
  1. Melden Sie sich als Admin an.
  2. Wählen Sie ein bestehendes Konto und löschen Sie es.
- **Erwartetes Ergebnis**: Das Konto wird gelöscht, und der Benutzer hat keinen Zugang mehr zum System.

---

## System/General User Stories

### Test: Das System erfordert eine Benutzerauthentifizierung
- **Testfallbeschreibung**: Überprüfen, ob das System eine Authentifizierung erfordert, um Meldungen zu verwalten oder einzureichen.
- **Schritte**:
  1. Versuchen Sie, auf das System zuzugreifen, ohne sich anzumelden.
- **Erwartetes Ergebnis**: Das System fordert den Benutzer zur Anmeldung auf.

### Test: Die Webanwendung funktioniert auf Desktop- und mobilen Geräten
- **Testfallbeschreibung**: Überprüfen, ob das System auf Desktop- und mobilen Geräten ordnungsgemäß funktioniert.
- **Schritte**:
  1. Greifen Sie sowohl von einem Desktop- als auch von einem mobilen Gerät auf das System zu.
- **Erwartetes Ergebnis**: Das System ist auf beiden Geräten funktional und benutzerfreundlich.

### Test: Das System sendet E-Mail-Benachrichtigungen an Bürger
- **Testfallbeschreibung**: Überprüfen, ob das System Benachrichtigungs-E-Mails an Bürger sendet, wenn sich der Status einer Meldung ändert.
- **Schritte**:
  1. Erstellen Sie eine neue Meldung als Bürger.
  2. Ändern Sie den Status der Meldung und überwachen Sie die E-Mail-Adresse des Bürgers.
- **Erwartetes Ergebnis**: Der Bürger erhält eine E-Mail-Benachrichtigung über den Status der Meldung.

### Test: Das System archiviert erledigte Meldungen automatisch
- **Testfallbeschreibung**: Überprüfen, ob erledigte Meldungen nach einer festgelegten Zeit (z. B. 30 Tage) automatisch archiviert werden.
- **Schritte**:
  1. Markieren Sie eine Meldung als erledigt.
  2. Warten Sie 30 Tage und prüfen Sie, ob die Meldung archiviert wurde.
- **Erwartetes Ergebnis**: Die erledigte Meldung wird automatisch archiviert und ist im Hauptsystem nicht mehr sichtbar.

### Test: Das System unterstützt mehrere Sprachen
- **Testfallbeschreibung**: Überprüfen, ob das System zwischen verschiedenen Sprachen (z. B. Deutsch und Englisch) umschaltbar ist.
- **Schritte**:
  1. Ändern Sie die Sprache des Systems.
- **Erwartetes Ergebnis**: Das System wird in der ausgewählten Sprache angezeigt.

### Test: Das System erlaubt nur bestimmte Dateitypen zum Upload
- **Testfallbeschreibung**: Überprüfen, ob das System nur bestimmte Dateitypen (z. B. JPG, PNG) für Uploads erlaubt.
- **Schritte**:
  1. Versuchen Sie, eine Datei mit einem nicht unterstützten Dateityp hochzuladen.
- **Erwartetes Ergebnis**: Eine Fehlermeldung wird angezeigt, dass der Dateityp nicht unterstützt wird.
