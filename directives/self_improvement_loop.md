# Directive: Self-Improvement Loop

> Version: 1.0
> Letzte Aktualisierung: 2026-03-10

## Zweck

Dieses System ist darauf ausgelegt, sich mit jedem generierten Skript und jeder Kampagnenauswertung zu verbessern. Diese Directive beschreibt die drei Ebenen der Selbstverbesserung.

## Ebene 1: Automatische Verbesserung (nach jedem Skript)

Nach JEDER Skript-Generierung prüft der Agent:

### 1.1 Debatte-Qualität
- Haben die Denker wirklich VERSCHIEDENE Perspektiven eingebracht?
- Gab es echten Dissens oder haben alle dasselbe gesagt?
- Wenn kein Dissens: → Nächstes Mal einen kontrastreicheren Denker hinzufügen

### 1.2 Scientist-Filter-Compliance
- Hat das Skript den Scientist-Filter bestanden?
- Welche Elemente mussten korrigiert werden?
- Muster erkennen: Wenn ein bestimmter Denker IMMER gefiltert wird → Sein Profil anpassen

### 1.3 Archivierung
- Speichere das Skript in `directives/scripts_archive/[DATUM]_[ARBEITSTITEL].md`
- Vermerke: Panel, Framework, Sprache, besondere Entscheidungen

## Ebene 2: Datengetriebene Verbesserung (nach Performance-Daten)

Wenn der Nutzer Kampagnen-Daten liefert:

### 2.1 Performance-Log aktualisieren
- Trage alle Metriken in `directives/ab_tests/performance_log.md` ein

### 2.2 Muster erkennen
- **Denker-Effectiveness:** Welche Denker-Kombinationen führen zu den besten VTRs/CTRs?
- **Framework-Effectiveness:** Welches Framework performt am besten für welchen Produkttyp?
- **Hook-Pattern-Analyse:** Welche Hook-Typen haben die niedrigsten Skip-Rates?
- **Sprach-Analyse:** Performt DE oder EN besser?

### 2.3 System anpassen
- **Denker-Gewichtung:** Denker, deren Beiträge konsistent zu hoher Performance führen → Häufiger auswählen
- **Framework-Ranking:** Frameworks nach Durchschnitts-Performance ranken → Beste zuerst empfehlen
- **Hook-Bibliothek aufbauen:** Sammle die 10 besten Hooks in einer separaten Datei
- **Anti-Patterns dokumentieren:** Was funktioniert NICHT? → In den Scientist-Filter aufnehmen

### 2.4 Denker-Profile aktualisieren
- Performance-Log in jedem Denker-Profil füllen
- Wenn ein Denker 3+ mal unterdurchschnittlich performt → Profil überarbeiten oder Denker aus dem Standard-Pool entfernen

### 2.5 Framework-Evolution
- Wenn ein Framework 3+ mal unterdurchschnittlich performt → Den Kreis es überarbeiten lassen
- Wenn ein neues Muster erkannt wird → Neues Framework erstellen
- Evolution Log in jeder Framework-Datei aktualisieren

## Ebene 3: Strukturelle Erweiterung (vom Nutzer initiiert)

### 3.1 Neue Denker hinzufügen
**Trigger:** Nutzer sagt "Füge [Name] als Denker hinzu" oder Agent erkennt eine Wissenslücke

**Prozess:**
1. Recherchiere den Denker (Hauptwerke, Kern-Philosophie, Techniken)
2. Erstelle Profil nach Template: `directives/thinkers/_TEMPLATE_neuer_denker.md`
3. Speichere in `directives/thinkers/[name].md`
4. Teste den Denker im nächsten Skript
5. Evaluiere nach 3 Skripten: Bleibt der Denker oder wird er entfernt?

### 3.2 Neue Frameworks hinzufügen
**Trigger:** Nutzer bringt ein neues Framework mit, oder Agent entdeckt eines durch Performance-Analyse

**Prozess:**
1. Analysiere das Framework (Struktur, Stärken, Schwächen)
2. Adaptiere es für Scientists (Scientist-Filter anwenden)
3. Erstelle Framework-Datei nach Template: `directives/frameworks/_TEMPLATE_neues_framework.md`
4. Speichere in `directives/frameworks/[name].md`
5. Teste in den nächsten 3 Skripten
6. Evaluiere: Behält es seine Stelle oder wird es absorbiert/entfernt?

### 3.3 Neue Zielgruppen
**Trigger:** Nutzer will Ads für eine andere Zielgruppe als Toxikologen

**Prozess:**
1. Erstelle einen neuen "Whisperer" für die Zielgruppe (nach dem Vorbild von `_scientist_whisperer.md`)
2. Passe die Sprach-Kalibrierung an
3. Überprüfe, welche Denker und Frameworks für diese Zielgruppe relevant sind
4. Aktualisiere `generate_youtube_script.md` mit der neuen Zielgruppe als Option

## Ebene 4: Hormozi-Scale-Testing (für aggressive A/B-Tests)

Wenn der Nutzer maximale Testabdeckung will:

### 4.1 Das 30-Ad-Protokoll
1. Wähle 6 verschiedene Angles (= Kern-Argumente)
2. Generiere 5 verschiedene Hooks pro Angle = 30 Skripte
3. Lasse die Denker bei jedem Skript eine andere Kombination bilden
4. Jedes Skript bekommt eine eindeutige ID zur Nachverfolgung

### 4.2 Das Iterations-Protokoll
1. Laufe alle 30 Ads mit gleichem Budget
2. Nach 48 Stunden: Top 5 identifizieren (VTR + CTR)
3. Von den Top 5: Jeweils 3 neue Varianten (Hook-Swap, CTA-Swap, Längen-Swap)
4. = 15 neue Skripte, alle basierend auf Gewinnern
5. Wiederholen bis CPV/CPA-Ziel erreicht

## Meta-Regel

**Daten schlagen Meinungen. Immer.**

Wenn Performance-Daten einer Denker-Empfehlung widersprechen → Die Daten gewinnen.
Wenn ein Framework theoretisch perfekt ist aber schlecht performt → Überarbeiten oder entfernen.
Wenn ein "hässliches" Skript besser performt als ein "schönes" → Das hässliche Skript ist besser.

Der Kreis der Exzellenz liefert die kreative Intelligenz. Die Daten liefern die Wahrheit.
