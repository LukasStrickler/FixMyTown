# User Stories
## Bürger User Stories
### Bürger können Probleme melden
**Beschreibung:** Als Bürger möchte ich ein Problem melden können, damit die zuständigen Stellen schnell darauf reagieren und das Problem beheben können. Ich möchte dabei die Art des Problems auswählen können: Defekt, Verunreinigung oder Parkverstoß.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Bürger kann den Problemtyp auswählen (Defekt, Verunreinigng, Parkverstoß)
- Bürger kann eine Beschreibung des Problems eingeben
- (Bürger kann ggf. ein Foto des Problems hochladen)
- Bürger kann den Standort des Problems angeben
- (Bürger erhält eine Bestätigung, dass die Meldung eingegangen ist)

### Bürger können die Historie der eingereichten Meldungen sehen
**Beschreibung:** Als Bürger möchte ich die Historie der eingereichten Meldungen sehen, damit ich den Status und Fortschritt meiner Meldungen nachverfolgen kann.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Bürger kann eine Liste der eingereichten Meldungen sehen
- Jede Meldung zeigt ihren aktuellen Status (z.B. ausstehend, in Bearbeitung, erledigt)

### Bürger können Benachrichtigungen erhalten, wenn sich der Status einer Meldung ändert (z.B. von "ausstehend" zu "erledigt")
**Beschreibung:** Als Bürger möchte ich Benachrichtigungen erhalten, wenn sich der Status einer Meldung ändert, damit ich über den aktuellen Stand informiert bin, ohne ständig in der Historie nachschauen zu müssen.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Bürger erhält eine Benachrichtigung (E-Mail), wenn sich der Status der Meldung ändert

### Bürger können eine Meldung löschen, wenn sie falsch eingereicht wurde
**Beschreibung:** Als Bürger möchte ich eine Meldung löschen können, wenn sie falsch eingerichtet wurde, damit ich nicht versehentlich fehlerhafte Informationen gemeldet lasse.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Bürger kann eine Meldung aus seiner Meldungsliste löschen
- (Bürger erhält eine Bestätigung der Löschung)

### Bürger erhalten nutzerfreundliche Fehlermeldungen
**Beschreibung:** Als Bürger möchte ich nutzerfreundliche Fehlermeldungen erhalten, damit ich den Fehler verstehe und darauf reagieren kann.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Fehlermeldungen sind verständlich und geben das Problem wieder

### Bürger können ein Konto erstellen
**Beschreibung:** Als Bürger möchte ich mir ein Konto erstellen können, damit ich mich anmelden und Meldungen über das System einreichen kann.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Bürger muss eine E-Mail Adresse und ein sicheres Passwort angeben
- Pflichtfelder müssen ausgefüllt sein, bevor die Registrierung abgeschlossen werden kann
- Bürger erhält eine Bestätigung der erfolgreichen Kontoerstellung

### Bürger kann sich einloggen
**Beschreibung:** Als Bürger möchte ich mich mit meinen Zugangsdaten anmelden können, um Meldungen zu verwalten und den Status zu verfolgen.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Bürger muss gültige Anmeldedaten (E-Mail Adresse und Passwort) eingeben

### Bürger kann Passwort wiederherstellen
**Beschreibung:** Als Bürger möchte ich die Möglichkeit haben, mein Passwort zurückzusetzen, wenn ich es vergessen habe, um weiterhin auf mein Konto zugreifen zu können.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Bürger kann über einen "Passwort vergessen"-Link den Passwort-Wiederherstellungsprozess starten
- Bürger erhält eine E-Mail mit einem sicheren Link zu Passwort-Rücksetzung

## Stadtmitarbeiter User Stories
### Stadtmitarbeiter können eine Liste der gemeldeten Probleme einsehen
**Beschreibung:** Als Stadtmitarbeiter möchte ich eine Liste aller gemeldeten Probleme sehen können, damit ich weiß, welche Probleme gelöst werden müssen.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Stadtmitarbeiter kann alle offenen Meldungen in einer Liste sehen
- Die Liste zeigt den Status und den Standort jedes Problems

### Stadtmitarbeiter können eine Meldung als erledigt markieren
**Beschreibung:** Als Stadtmitarbeiter möchte ich eine Meldung als erledigt markieren können, damit die Bürger sehen, dass das Problem behoben wurde.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Stadtmitarbeiter kann den Status einer Meldung auf "erledigt" setzen
- Bürger werden benachrichtigt, wenn eine Meldung als erledigt markiert wird.

### Stadtmitarbeiter können Meldungen bearbeiten (z.B. Notizen hinzufügen, Status aktualisieren)
**Beschreibung:** Als Stadtmitarbeiter möchte ich Meldungen bearbeiten können, zum Beispiel Notizen hinzufügen oder den Status aktualisieren, damit die Arbeitsschritte dokumentiert sind.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Stadtmitarbeiter kann zusätzliche Notizen hinzufügen
- Status kann von "ausstehend" auf "in Bearbeitung" oder "erledigt" geändert werden

### Stadtmitarbeiter können Meldungen nach Standort oder Art filtern
**Beschreibung:** Als Stadtmitarbeiter möchte ich Meldungen nach Standort oder Art filtern können, damit ich effizent auf spezifische Probleme reagieren kann und ich somit nach meinem Aufgabengebiet filtern kann.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:** 
- Filteroptionen nach Problemtyp (z.B. Defekt, Verunreinigung, Parkverstoß) und Standort

### Stadtmitarbeiter können gemeldeten Problemen Prioritätsstufen zuweisen (z.B. hoch, mittel, niedrig)
**Beschreibung:** Als Stadtmitarbeiter möchte ich Prioritäten für gemeldete Probleme festlegen können, zum Beispiel hoch, mittel, und niedrig, damit dringende Probleme schneller bearbeitet werden.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Prioritätenauswahl beim Bearbeiten von Meldungen
- Liste zeigt die Prioritäten der Meldungen an

### Stadtmitarbeiter können eine Liste der gemeldeten Probleme für die Offline-Nutzung oder Berichte exportieren
**Beschreibung:** Als Stadtmitarbeiter möchte ich eine Liste der gemeldeten Probleme exportieren können, damit ich die Daten offline analysieren oder zum Schreiben von Berichten nutzen kann.
<br>**Priorität:** Niedrig
<br>**Akzeptanzkriterien:**
- Exportoption für Listen als CSV- oder Excel-Datei

### Stadtmitarbeiter erhalten benötigte Informationen zur Bearbeitung von Problemen
**Beschreibung:** Als Stadtmitarbeiter möchte ich, dass nur Probleme mit genug Informationen gemeldet werden können, damit man diese beheben kann.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Die Felder Beschreibung und Standort sind Pflichtfelder

### Stadtmitarbeiter erhalten nutzerfreundliche Fehlermeldungen
**Beschreibung:** Als Staddtmitarbeiter möchte ich nutzerfreundliche Fehlermeldungen erhalten, damit ich den Fehler verstehe und darauf reagieren kann.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Fehlermeldungen sind verständlich und geben das Problem wieder

### Stadtmitarbeiter kann sich einloggen
**Beschreibung:** Als Stadtmitarbeiter möchte ich mich mit meinen Zugangsdaten anmelden können, um Meldungen bearbeiten zu können.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Stadtmitarbeiter muss gültige Anmeldedaten (E-Mail Adresse und Passwort) eingeben

## Admin User Stories
### Admins können Konten für Stadtmitarbeiter erstellen, damit sie die Meldungen verwalten können
**Beschreibung:** Als Administrator möchte ich Benutzerkonten für Stadtmitarbeiter erstellen können, damit sie Zugriff auf das System erhalten und ihrer Arbeit nachgehen können.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Admin kann neue Konten anlegen und Benutzerinformationen eingeben
- Stadtmitarbeiter erhalten Zugangsdaten und können das System nutzen

### Admins können Stadtmitarbeiterkonten löschen, um den Zugriff bei Bedarf zu entziehen
**Beschreibung:** Als Administrator möchte ich Benutzerkonten von Stadtmitarbeitern löschen können, damit sie keinen Zugriff mehr auf das System haben, wenn dies nicht mehr ihrer Stellenbeschreibung entspricht oder sie ihre Stelle verlassen.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Admin kann bestehende Benutzerkonten entfernen
- Gelöschte Benutzer haben keinen Zugang mehr zum System

### Admins können die Kontodaten der Stadtmitarbeiter bearbeiten (z.B. Rollen ändern, Informationen aktualisieren)
**Beschreibung:** Als Administrator möchte ich die Kontodaten der Stadtmitarbeiter bearbeiten können, zum Beispiel Rollen ändern oder Informationen aktualisieren, damit die Berechtigungen richtig zugewiesen und verwaltet werden können.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Admin kann Benutzerrollen und Informationen ändern
- Änderungen werden sofort wirksam

## System/General User Stories
### Das System erfordert eine Benutzerauthentifizierung für das Einreichen ode Verwalten von Meldungen
**Beschreibung:** Als System möchte ich eine Benutzerauthentifizierung erfordern, damit nur autorisierte Personen Meldungen einreichen oder verwalten können.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Benutzer müssen sich mit Benutzernamen/E-Mail und Passwort/Magiclink anmelden
- Nicht autorisierte Benutzer haben keinen Zugriff

### Das System funktioniert sowohl auf Desktop- als auch auf mobilen Geräten
**Beschreibung:** Als System möchte ich sowohl auf Desktop- als auch auf mobilen Geräten funktionieren, damit Benutzer flexibel auf die Funktionen zugreifen können.
<br>**Priorität:** Niedrig
<br>**Akzeptanzkriterien:**
- das System ist für Desktop-Browser und mobile Endgeräte optimiert

### Das System kann E-Mail-Benachrichtigungen an Bürger über den Status ihrer Meldungen senden
**Beschreibung:** Als System möchte ich E-Mail-Benachrichtigungen an Bürger über den Status ihrer Meldungen senden, damit sie immer darüber informiert sind.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- Bürger erhalten automatisch E-Mails bei Statusänderungen ihrer Meldungen

### Das System kann erledigte Meldungen nach einer bestimmten Zeit  (z.B. 30 Tage) automatisch archivieren
**Beschreibung:** Als System möchte ich erledigte Meldungen nach einer bestimmten Zeit, zum Beispiel 30 Tage, automatisch archivieren, damit das System übersichtlich bleibt.
<br>**Priorität:** Hoch
<br>**Akzeptanzkriterien:**
- Meldungen werden 30 Tage nach Abschluss automatisch archiviert
- Archivierte Meldungen sind im Hauptsystem nicht mehr sichtbar, aber im Archiv zugänglich

### Das System kann mehrere Sprachen zur Unterstützung der Barrierefreiheit bereitstellen
**Beschreibung:** Als System möchte ich mehrere Sprachen unterstützen, damit das System barrierefrei für eine größere Nutzergruppe zugänglich ist.
<br>**Priorität:** Niedrig
<br>**Akzeptanzkriterien:**
- Benutzer können zwischen Englisch und Deutsch wählen

### Das System erlaubt nur bestimmte Dateitypen zum Upload
**Beschreibung:** Das System möchte, dass nur bestimmte Dateitypen hochgeladen werden können, damit alle Uploads verarbeitet werden können.
<br>**Priorität:** Mittel
<br>**Akzeptanzkriterien:**
- In den Uploads können nur Dateien in einem der Standard Foto Dateitypen hochgeladen werden