import { useState, useEffect, useRef } from "react";
 
const PW = "RTS2027";
const T = {
  void: "#0B0B0F", bg: "#0E0F16", blue: "#5B8DEF", blueGlow: "rgba(91,141,239,0.12)",
  blueBorder: "rgba(91,141,239,0.15)", blueActive: "rgba(91,141,239,0.30)",
  gold: "#E8943A", goldGlow: "rgba(232,148,58,0.12)",
  silver: "#C0C8D0", muted: "#5A6068",
  surface: "#111219", borderSubtle: "rgba(192,200,208,0.06)",
  success: "#5BEF8D", successGlow: "rgba(91,239,141,0.12)", danger: "#EF5B5B",
  white: "#EAEEF2", fontBody: "'Source Sans 3',system-ui,sans-serif", fontMono: "'DM Mono',monospace",
  r: "10px", rSm: "6px",
};
 
const GROUPS = [
  { id:1, name:"Freundeskreis Tempelhof", topic:"Alkohol", fmt:"Präsenz", dist:"2.3 km", plz:"12099", day:"Dienstag", time:"18:30", score:94, contact:"Heike M.", members:12,
    sessions:[{sid:"s1a",type:"Kennenlern",date:"2026-05-06",time:"18:30",free:4,platform:"Zoom",code:"823 4921 8834",pwd:"anker26",addr:null},{sid:"s1b",type:"Offenes Treffen",date:"2026-05-13",time:"18:30",free:8,platform:"Präsenz",code:null,pwd:null,addr:"Tempelhofer Damm 142, 12099 Berlin"}]},
  { id:2, name:"Blaues Kreuz Neukölln", topic:"Alkohol", fmt:"Hybrid", dist:"3.8 km", plz:"12043", day:"Donnerstag", time:"19:00", score:87, contact:"Thomas K.", members:8,
    sessions:[{sid:"s2a",type:"Kennenlern",date:"2026-05-08",time:"19:00",free:5,platform:"Google Meet",code:"meet.google.com/abc-defg-hij",pwd:null,addr:null}]},
  { id:3, name:"Kreuzbund Schöneberg", topic:"Alkohol", fmt:"Präsenz", dist:"5.1 km", plz:"10823", day:"Mittwoch", time:"17:30", score:81, contact:"Petra S.", members:15,
    sessions:[{sid:"s3a",type:"Offenes Treffen",date:"2026-05-07",time:"17:30",free:10,platform:"Präsenz",code:null,pwd:null,addr:"Hauptstr. 22, 10823 Berlin"}]},
  { id:4, name:"NA Kreuzberg", topic:"Medikamente", fmt:"Online", dist:"—", plz:"10997", day:"Montag", time:"20:00", score:72, contact:"Anonym", members:6,
    sessions:[{sid:"s4a",type:"Kennenlern",date:"2026-05-05",time:"20:00",free:3,platform:"Jitsi",code:"meet.jit.si/NA-Kreuzberg-Offen",pwd:null,addr:null}]},
];
 
const Pill = ({children, color=T.blue, bg=T.blueGlow}) => (
  <span style={{fontSize:11,fontFamily:T.fontMono,fontWeight:500,padding:"3px 8px",borderRadius:4,background:bg,color}}>{children}</span>
);
 
const Accordion = ({title,children}) => {
  const [open,setOpen] = useState(false);
  return (
    <div style={{borderBottom:`1px solid ${T.borderSubtle}`}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
        <span style={{color:T.white,fontSize:14,fontWeight:500,fontFamily:T.fontBody,lineHeight:1.4,paddingRight:12}}>{title}</span>
        <span style={{color:T.muted,fontSize:16,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</span>
      </button>
      {open && <div style={{padding:"0 0 14px",color:T.silver,fontSize:13,lineHeight:1.7,fontFamily:T.fontBody}}>{children}</div>}
    </div>
  );
};
 
const Sec = ({title,sub,children,id}) => (
  <section id={id} style={{padding:"48px 0",borderBottom:`1px solid ${T.borderSubtle}`}}>
    {title && <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px",letterSpacing:"-0.02em"}}>{title}</h2>}
    {sub && <p style={{color:T.muted,fontSize:12,margin:"0 0 24px",fontFamily:T.fontMono}}>{sub}</p>}
    {!sub && title && <div style={{height:24}} />}
    {children}
  </section>
);
 
const PasswordWall = ({onAuth}) => {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false); const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  const go=()=>{if(pw===PW)onAuth();else{setErr(true);setPw("");}};
  return (
    <div style={{minHeight:"100vh",background:T.void,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.fontBody}}>
      <div style={{textAlign:"center",padding:48,maxWidth:400,width:"100%"}}>
        <div style={{fontSize:22,fontWeight:600,color:T.white,marginBottom:6}}>⚓ AnkerNetz</div>
        <p style={{color:T.muted,fontSize:13,fontFamily:T.fontMono,margin:"0 0 32px"}}>SHG-Vernetzungsplattform · Interner Zugang</p>
        <div style={{display:"flex",gap:8}}>
          <input ref={ref} type="password" value={pw} placeholder="Passwort" onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&go()}
            style={{flex:1,padding:"12px 16px",background:T.surface,border:`1px solid ${err?T.danger:T.blueBorder}`,borderRadius:T.rSm,color:T.white,fontSize:15,fontFamily:T.fontMono,outline:"none"}} />
          <button onClick={go} style={{padding:"12px 20px",background:T.blue,border:"none",borderRadius:T.rSm,color:T.void,fontWeight:600,fontSize:14,cursor:"pointer"}}>→</button>
        </div>
        {err && <p style={{color:T.danger,fontSize:12,marginTop:12,fontFamily:T.fontMono}}>Falsches Passwort</p>}
      </div>
    </div>
  );
};
 
const FAQ_REHA = [
  {c:"1. Aufwand und Kapazität",qs:[
    {q:"Was bedeutet das konkret für unseren Arbeitsalltag? Wir sind jetzt schon ausgelastet.",a:"Die Plattform ersetzt einen bestehenden Vorgang, sie kommt nicht obendrauf. Die vier Pflicht-Vorstellungen bei Selbsthilfegruppen finden ohnehin statt – nur eben bei lokalen Gruppen. Der Vorschlag ändert den Kanal (Video statt Präsenz vor Ort) und das Ziel (Wohnort-Gruppe statt Klinik-Gruppe). Der Sozialdienst koordiniert den Vorgang wie bisher, nur über die Plattform statt über Telefon. [cite: 100, 101, 102, 103, 104]"},
    {q:"Sollen unsere Therapeuten jetzt auch noch eine App konfigurieren?",a:"Nein, das ist keine Voraussetzung. Das Begleitmodul läuft in der Basisversion ohne individuelle Konfiguration – mit Standardinhalten, die auf Basis anonymisierter Nutzungsdaten laufend verbessert werden. Eine individuelle Konfiguration durch den Bezugstherapeuten ist eine Option (Szenario 1), kein Pflichtbestandteil. Wenn sie genutzt wird, dauert sie einmalig 15–20 Minuten vor Entlassung: Notfallstrategie hinterlegen, substanzspezifische Tagesimpulse auswählen, fertig. [cite: 105, 106, 107, 108]"},
    {q:"Wer macht das dann – Sozialdienst, Bezugstherapeut, ärztlicher Dienst?",a:"Die Vernetzung (Komponente A) liegt beim Sozialdienst – analog zur bestehenden Nachsorgevorbereitung. Das Begleitmodul (Komponente B) kann vom Bezugstherapeuten im Entlassungsgespräch kurz vorgestellt werden: „Hier ist die App, sie erinnert Sie täglich an das, was wir hier erarbeitet haben.“ Kein neuer Prozess, sondern ein Werkzeug, das bestehende Empfehlungen digital transportiert. [cite: 109, 110, 111, 112]"},
  ]},
  {c:"2. Beitrag der Therapeuten",qs:[
    {q:"Wie können wir als Therapeuten konkret zur Gestaltung der Module beitragen?",a:"Auf drei Ebenen, alle freiwillig. Erstens: Feedback zu Standardinhalten. Die Tagesimpulse, Reflexionsfragen und Perspektivenwechsel des Begleitmoduls werden initial entwickelt und dann iterativ verbessert. Therapeuten können über einen offenen Feedback-Kanal Vorschläge einreichen – z.B. bewährte Reflexionsfragen aus der Gruppenarbeit, substanzspezifische Trigger-Hinweise, Formulierungen für Notfallstrategien. Zweitens: Szenario 1 (individuelle Konfiguration). Ein Therapeut kann für einzelne Patienten spezifische Inhalte hinterlegen – die Notfallstrategie, die gemeinsam erarbeitet wurde, oder eine individuelle Reflexionsfrage, die im Therapieprozess zentral war. Drittens: Konzeptentwicklung auf Basis anonymisierter Daten. Nach der Pilotphase liegen aggregierte Nutzungsdaten vor. Therapeuten können auf dieser Basis allgemeine Konzeptvorschläge formulieren, die in künftige Updates einfließen. [cite: 114, 115, 116, 117, 118, 119]"},
    {q:"Wird unsere therapeutische Arbeit durch die App bewertet oder kontrolliert?",a:"Nein. Die Plattform dokumentiert die Nutzung durch den Patienten, nicht die Arbeit des Therapeuten. Es gibt kein Ranking, kein Scoring, keine Rückmeldung an die Klinikleitung über einzelne Therapeuten. Die aggregierten Daten zeigen Muster über alle Nutzer hinweg – nicht pro Therapeut oder pro Einrichtung. [cite: 120, 121, 122, 123]"},
    {q:"Können wir eigene Inhalte (Arbeitsblätter, Übungen) in die App einpflegen?",a:"Ja, in Szenario 1. Das Begleitmodul ist modular aufgebaut. Ein Therapeut könnte z.B. eine PDF-Datei mit einer Achtsamkeitsübung oder einem Verhaltensprotokoll hinterlegen, die der Patient nach Entlassung täglich aufruft. Technisch: Upload-Funktion im Therapeuten-Dashboard. Rechtlich: Die Einwilligung des Patienten deckt die Bereitstellung ab. Die Inhalte gehören dem Patienten, nicht der Plattform. [cite: 124, 125, 126, 127]"},
  ]},
  {c:"3. Datenhaltung und Betrieb",qs:[
    {q:"Wo liegen die Daten? Können wir das auf unserem eigenen Server betreiben?",a:"Drei Optionen. Erstens: Zentrales Hosting auf einem EU-Server (Standard für die Pilotphase – geringster Aufwand für die Einrichtung). Zweitens: On-Premise-Installation auf dem Klinikserver – technisch möglich, da Open Source. Die Klinik-IT müsste den Server betreiben und warten. Drittens: Hybrid – die Vernetzungsplattform (A) läuft zentral, das Begleitmodul (B) speichert Gesundheitsdaten (Suchtdruck-Werte, Journal) ausschließlich lokal auf dem Endgerät des Patienten (Zero-Knowledge). Dann verlassen keine Gesundheitsdaten das Gerät. [cite: 129, 130, 131, 132, 133]"},
    {q:"Wie verhält sich das zu unserem bestehenden WLAN- und Gerätekonzept? Patienten dürfen bei uns nur eingeschränkt Smartphones nutzen.",a:"Die Plattform ist browserbasiert und funktioniert auf jedem Gerät mit Internetzugang. Innerhalb der Klinik könnte die Nutzung auf festgelegte Zeiten oder auf ein Klinik-Terminal beschränkt werden – analog zu den bestehenden Internetzugangsregeln. Die Video-Kennenlern-Sessions (A2) könnten auch über einen gemeinsamen Raum mit Bildschirm stattfinden, betreut durch den Sozialdienst. Nach Entlassung nutzt der Patient die App auf seinem eigenen Gerät ohne Einschränkung. [cite: 134, 135, 136, 137, 138]"},
    {q:"Wer ist datenschutzrechtlich verantwortlich?",a:"In der Pilotphase: der Plattformbetreiber (Verantwortlicher im Sinne der DSGVO). Die Klinik ist nicht Verantwortliche, sondern stellt den Kontakt her – vergleichbar mit der Empfehlung einer Beratungsstelle. Die Einwilligung erteilt der Patient gegenüber dem Plattformbetreiber, nicht gegenüber der Klinik. Bei On-Premise-Betrieb (Option 2) verschiebt sich die Verantwortlichkeit zur Einrichtung – das erfordert eine eigene DSFA. [cite: 139, 140, 141, 142, 143]"},
  ]},
  {c:"4. Integration in bestehende Systeme (PATFAK)",qs:[
    {q:"Kann die Plattform an unser PATFAK angebunden werden?",a:"Ja, über mehrere bestehende Schnittstellen. PATFAK unterstützt den HL7-Standard für den Datenaustausch mit anderen Informationssystemen. Konkret denkbare Integrationspunkte: Erstens: Die Teilnahmebestätigung (A3) könnte als strukturiertes Datum in die PATFAK-Akte übernommen werden – über die HL7-Schnittstelle oder als manuellen Eintrag. Zweitens: Die dokumentierte SHG-Anbindung könnte direkt in den DRV-Entlassungsbericht (G2055) einfließen, den PATFAK generiert. Drittens: Die PATFAK-Katamnese-Funktion könnte um ein Feld „SHG-Anbindung bei Entlassung: ja/nein“ ergänzt werden, um die Korrelation mit die 12-Monats-Abstinenzrate auszuwerten. [cite: 145, 146, 147, 148, 149]"},
    {q:"PATFAK hat eine eigene App und ein POI-Modul. Ist das nicht redundant?",a:"Nein, die Systeme adressieren unterschiedliche Phasen. Die PATFAK-App und das POI-Modul (Patienten Online Information) sind für die Kommunikation während der Behandlung konzipiert: Therapieplan einsehen, Nachrichten austauschen, Ausgangsbuch führen. Die vorgeschlagene Plattform beginnt dort, wo PATFAK aufhört: nach der Entlassung. PATFAK dokumentiert den Reha-Aufenthalt; die Plattform sichert den Übergang in die ambulante Phase. Eine sinnvolle Ergänzung wäre, den Link zur Plattform über das PATFAK-POI an den Patienten zu übergeben – als letzte Nachricht vor Entlassung. [cite: 150, 151, 152, 153]"},
    {q:"Muss Redline Data (der PATFAK-Hersteller) einbezogen werden?",a:"Für die Pilotphase nicht zwingend. Die Teilnahmebestätigung kann auch als PDF-Export aus der Plattform in die PATFAK-Akte eingefügt werden – ohne Schnittstellenentwicklung. Für eine tiefe Integration (automatische Übernahme in den Entlassungsbericht, Katamnese-Feld) wäre eine Abstimmung mit Redline Data sinnvoll. Da PATFAK Referenzsystem des FVS und des buss ist, wäre ein Gespräch mit Redline Data auch strategisch wertvoll: wenn die Integration in PATFAK gelingt, ist sie sofort in über 250 Einrichtungen verfügbar. [cite: 154, 155, 156, 157]"},
    {q:"Welche anderen Dokumentationssysteme könnten angebunden werden?",a:"Neben PATFAK sind im Suchtbereich auch Vivendi Consil (Connext), R23 (DEVAGENCY) und Tau-Office (rocom) zertifiziert. Die Plattform ist Open Source und nutzt Standard-Schnittstellen (REST-API, HL7 FHIR). Eine Anbindung an jedes System, das offene Schnittstellen bietet, ist technisch möglich. Für die Pilotphase genügt ein einfacher PDF-Export. [cite: 158, 159, 160, 161]"},
  ]},
  {c:"5. Modulgestaltung in der Praxis",qs:[
    {q:"Wie würde eine typische Woche für den Patienten nach Entlassung aussehen?",a:"Montag bis Freitag: Morgen-Check-in (30 Sekunden: Stimmung, Suchtdruck, Schlaf). Tagesimpuls (eine Reflexionsfrage oder ein kurzer Gedanke). Körper Heute (ein Fakt zur körperlichen Regeneration). Dienstag oder Donnerstag: Gruppenabend bei der Wohnort-SHG (die man aus der Reha per Video bereits kennt). Samstag oder Sonntag: Wochenrückblick automatisch generiert (Suchtdruck-Verlauf, Teilnahme, Stimmungstrend). Optional: Abend-Reflexion im Journal. Das Ganze dauert täglich 1–3 Minuten. Der Gruppenbesuch ist der zentrale Anker. [cite: 163, 164, 165, 166, 167]"},
    {q:"Wir haben verschiedene Indikationen (Alkohol, Drogen, Medikamente, Verhaltenssüchte). Funktioniert das für alle?",a:"Die Vernetzungsplattform (A) funktioniert indikationsübergreifend – das Gruppen-Matching filtert nach Typ (Alkohol, Drogen, Medikamente, Verhalten). Das Begleitmodul (B) kann substanzspezifisch konfiguriert werden: andere Tagesimpulse für Alkoholabhängige als für Stimulanzien-Konsumenten, andere typische Trigger, andere Rückfallmuster. In der Pilotphase würde mit der häufigsten Indikation (Alkohol) begonnen und sukzessive erweitert. [cite: 168, 169, 170, 171]"},
    {q:"Was passiert, wenn ein Patient die App nicht nutzt?",a:"Nichts. Die App ist ein Angebot, keine Pflicht. Es gibt keine Sanktion, keine Rückmeldung an die Klinik, keinen negativen Eintrag. Die Nutzungsdaten zeigen im Aggregat, wie viele Patienten die App nutzen – nicht welche einzelnen Patienten sie nicht nutzen. Die Teilnahme an der Wohnort-SHG wird unabhängig von der App-Nutzung dokumentiert. [cite: 172, 173, 174, 175]"},
  ]},
  {c:"6. Wirkung auf unsere Katamnese",qs:[
    {q:"Verbessert das wirklich unsere Katamnese-Ergebnisse?",a:"Das ist die Hypothese, die die Pilotphase testen soll. Die Logik: Wenn mehr Patienten nach Entlassung in einer stabilen SHG angebunden sind, steigt die Wahrscheinlichkeit dauerhafter Abstinenz – und damit die 12-Monats-Abstinenzrate in der Katamnese. Zusätzlich könnte die Rücklaufquote der Katamnese steigen, weil Patienten, die in Gruppen eingebunden sind, besser erreichbar sind. Die Sunset-Klausel stellt sicher: Wenn der Effekt nicht messbar ist, wird die Maßnahme beendet. [cite: 177, 178, 179, 180]"},
    {q:"Können wir die Daten der Plattform für unsere eigene Katamnese nutzen?",a:"Ja, mit Einwilligung der Patienten. Die Plattform dokumentiert die SHG-Anbindung bei Entlassung (ja/nein) und die Teilnahme an Gruppentreffen in den ersten Monaten. Diese Daten könnten – anonymisiert und aggregiert – in die klinikeigene Katamnese-Auswertung einfließen. Konkret: ein zusätzliches Feld in der PATFAK-Katamnese „SHG-Anbindung“ würde erstmals erlauben, die Korrelation zwischen früher SHG-Anbindung und Abstinenzrate systematisch auszuwerten. [cite: 181, 182, 183, 184]"},
  ]},
  {c:"7. Pilotteilnahme",qs:[
    {q:"Was müsste unsere Einrichtung konkret tun, um als Piloteinrichtung teilzunehmen?",a:"Vier Dinge. Erstens: Bereitschaft, die vier Pflicht-Vorstellungen für einen Teil der Rehabilitanden über die Plattform (Video) statt über lokale Gruppen durchzuführen. Zweitens: Bereitschaft zur Katamnese-Kooperation – d.h. das zusätzliche Feld „SHG-Anbindung“ in der 12-Monats-Nachbefragung erheben. Drittens: Ein Ansprechpartner (Sozialdienst) für die Koordination während der Pilotphase. Viertens: Abstimmung mit dem Datenschutzbeauftragten der Einrichtung. Kein zusätzliches Personal, keine zusätzliche Hardware, keine Lizenzkosten. [cite: 186, 187, 188, 189, 190]"},
    {q:"Was ist für uns drin?",a:"Drei Dinge. Erstens: Potenziell bessere Katamnese-Ergebnisse bei gleichem therapeutischen Aufwand. Zweitens: Ein dokumentierbarer Beitrag zur Qualitätssicherung – die Einrichtung wäre Pilotpartner eines Vorschlags, der an die DRV gerichtet ist. Drittens: Früher Zugang zu einem Werkzeug, das bei Erfolg bundesweit ausgerollt wird. [cite: 191, 192, 193, 194]"},
  ]}
];
 
const FAQ_DRV = [
  {c:"1. Zur Person und Legitimation",qs:[
    {q:"Sie sind aktuell Patient – warum sollten wir Ihren Vorschlag ernst nehmen?",a:"Das Positionspapier verbindet zwei Perspektiven: die direkte Erfahrung der beschriebenen Versorgungslücke als Rehabilitand und die fachliche Kompetenz als Entwickler digitaler Plattformen. Die Problemanalyse stützt sich nicht auf persönliches Empfinden, sondern auf öffentlich zugängliche Daten (DRV-Routinedaten, S3-Leitlinie, Fünf-Verbände-Statistik). Die beigefügte Fachliche Stellungnahme einer Therapeutin oder eines Arztes bestätigt die Problemanalyse aus klinischer Sicht. [cite: 202, 203, 204, 205]"},
    {q:"Ist das ein Produktpitch oder eine Stellungnahme?",a:"Eine Stellungnahme. Das Papier beschreibt eine strukturelle Lücke und schlägt vor, wie bestehende Regelwerke (RTS, Gemeinsamer Leitfaden) angepasst werden könnten. Die Plattform ist als Open-Source-Projekt konzipiert – nicht als kommerzielles Produkt. Die Sunset-Klausel stellt sicher, dass die Maßnahme nur bei nachgewiesener Wirksamkeit fortbesteht. [cite: 206, 207, 208, 209]"},
    {q:"Warum schreiben Sie als Einzelperson und nicht über einen Fachverband?",a:"Die Beobachtung der Lücke entstand während meiner eigenen Rehabilitation. Die Stellungnahme ist als Impuls gedacht, der durch die Fachverbände aufgegriffen und weiterentwickelt werden kann. Gespräche mit den Dachverbänden der Sucht-Selbsthilfe sind im Umsetzungsplan als nächster Schritt vorgesehen. [cite: 210, 211, 212]"},
  ]},
  {c:"2. Zur Problemanalyse",qs:[
    {q:"Ist das Problem wirklich so groß? Die Kliniken erfüllen doch die Nachsorgevorbereitung.",a:"Formal ja. Der Gemeinsame Leitfaden verlangt „Kontakt zu Selbsthilfegruppen“, und die Kliniken stellen lokale Gruppen vor. Aber die Vorstellung findet am Klinikstandort statt, nicht am Wohnort. Für Rehabilitanden, die nach Entlassung an einen anderen Ort zurückkehren, ist diese Vorstellung wirkungslos. Die Pflicht wird formell erfüllt, verfehlt aber ihren Zweck. [cite: 214, 215, 216, 217, 218]"},
    {q:"Gibt es kontrollierte Studien, die den Effekt der Wohnort-Anbindung belegen?",a:"Kontrollierte Studien spezifisch zur Wohnort- vs. Klinikort-Anbindung liegen meines Wissens nicht vor. Genau deshalb schlägt das Papier eine Erprobung mit Sunset-Klausel vor: 24 Monate, 10 Piloteinrichtungen, klare Messgrößen. Wenn der Effekt nicht messbar ist, wird die Maßnahme beendet. Das Papier fordert nicht, etwas Unbewiesenes flächendeckend einzuführen – es fordert, die Hypothese zu testen. [cite: 219, 220, 221, 222, 223]"},
    {q:"Die 87%-Zahl der Fünf-Verbände-Statistik ist doch nicht belastbar.",a:"Korrekt – das Papier weist explizit darauf hin. Es handelt sich um eine Selbstberichts-Statistik aktiver Gruppenteilnehmer mit Selektionseffekt. Die Zahl ist als Obergrenze gekennzeichnet, nicht als kontrolliertes Ergebnis. Das Kernargument des Papiers hängt nicht an dieser Einzelzahl, sondern an der S3-Leitlinien-Empfehlung (Selbsthilfegruppen in allen Phasen und Settings) und der strukturellen Beobachtung, dass die bestehende Pflicht ihren Zweck verfehlt. [cite: 224, 225, 226, 227]"},
    {q:"Die Rückfallquoten variieren stark je nach Quelle. Welche Zahl gilt?",a:"Die Katamnese-Daten des Fachverbandes Sucht zeigen für den konservativsten Standard (DGSS 4) eine Abstinenzrate von ca. 40 % ein Jahr nach stationärer Behandlung. Nach reinem Entzug ohne Nachbehandlung liegt die Rückfallquote bei ca. 80 % (Holzbach, 2010). Die Bandbreite von 40–60 % nach intensiver Therapie wird durch Übersichtsarbeiten gestützt. Das Papier nennt diese Bandbreiten transparent und verzichtet bewusst auf eine einzelne „richtige“ Zahl. [cite: 228, 229, 230, 231, 232]"},
  ]},
  {c:"3. Zur Umsetzbarkeit",qs:[
    {q:"Die Selbsthilfegruppen sind ehrenamtlich. Warum sollten sie mitmachen?",a:"Die Plattform bietet Selbsthilfegruppen bundesweite Sichtbarkeit statt nur lokaler Reichweite. Gruppen erhalten Zugang zu motivierten Rehabilitanden aus allen Kliniken Deutschlands – nicht nur aus der nächsten Einrichtung. Die Teilnahme ist freiwillig. Die Dachverbände (Kreuzbund, Blaues Kreuz, Freundeskreise, Guttempler, BKE) wären die Multiplikatoren. Die Entscheidung, ob und wie eine Gruppe teilnimmt, bleibt bei der Gruppe selbst. [cite: 234, 235, 236, 237, 238]"},
    {q:"Sind ältere Gruppenmitglieder überhaupt in der Lage, Videotelefonie zu nutzen?",a:"Das Papier schlägt Video als Option vor, nicht als Pflicht. Gruppen, die kein Video anbieten möchten, können sich trotzdem auf der Plattform eintragen und telefonisch oder per Nachricht kontaktiert werden. Die Erfahrung zeigt, dass seit der Pandemie auch ältere Zielgruppen Videotelefonie nutzen. Die NAKOS-Datenbank für digitale Selbsthilfegruppen wächst seit 2020 kontinuierlich. [cite: 239, 240, 241, 242, 243]"},
    {q:"Wer entwickelt die Plattform? Wer betreibt sie?",a:"Die Erstentwicklung erfolgt als Open-Source-Projekt, finanziert über öffentliche Innovationsförderung (Prototype Fund, NLnet). Der Betrieb kann langfristig über einen Rahmenvertrag mit der DRV oder den Krankenkassen gesichert werden – analog zu bestehenden Dokumentationssystemen in der Suchthilfe. Die Trägerschaft könnte bei einem der Dachverbände, einer Landesstelle für Suchtfragen oder einer unabhängigen gemeinnützigen Organisation liegen. [cite: 244, 245, 246, 247]"},
    {q:"Wie realistisch ist der Zeitplan? Q1 2027 ist ambitioniert.",a:"Der Zeitplan ist an das Inkrafttreten der RTS 2025 gekoppelt (voraussichtlich 01.01.2027). Ein funktionsfähiger Prototyp (Gruppen-Matching, Video-Integration, Teilnahmebestätigung) ist technisch in 6–9 Monaten realisierbar. Die Pilotphase startet parallel zu den neuen RTS – nicht davor. Sollte sich der RTS-Zeitplan verschieben, verschiebt sich der Pilotstart entsprechend. [cite: 248, 249, 250, 251, 252]"},
  ]},
  {c:"4. Zu Regulierung und Recht",qs:[
    {q:"Kann Video-Vorstellung die Präsenz-Vorstellung rechtlich ersetzen?",a:"Der Gemeinsame Leitfaden verlangt „Kontakt zu Selbsthilfegruppen“. Er schreibt nicht vor, dass dieser Kontakt physisch vor Ort stattfinden muss. Eine Klarstellung im Leitfaden oder in den RTS, dass Videotelefonie als zulässiges Format gilt, würde genügen. Seit der Pandemie sind telemedizinische Formate in vielen Bereichen der Rehabilitation anerkannt. [cite: 254, 255, 256, 257]"},
    {q:"Gesundheitsdaten auf einer App-Plattform – ist das DSGVO-konform möglich?",a:"Ja, unter strengen Voraussetzungen. Das Papier beschreibt in Abschnitt 8 die Maßnahmen: Verarbeitung ausschließlich auf Grundlage expliziter Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), Ende-zu-Ende-Verschlüsselung, AES-256 im Ruhezustand, Zero-Knowledge-Architektur, Hosting in der EU, Datenschutz-Folgenabschätzung vor Pilotstart. Vergleichbare Gesundheits-Apps (z.B. DiGA) operieren unter denselben Anforderungen. [cite: 258, 259, 260]"},
    {q:"Braucht die App eine DiGA-Zulassung?",a:"Nicht zwingend. Die Plattform ist primär ein Vermittlungs- und Strukturierungswerkzeug, keine digitale Gesundheitsanwendung im Sinne des DVG. Ob eine DiGA-Zulassung sinnvoll oder erforderlich ist, hängt davon ab, ob die App als Medizinprodukt eingestuft wird. Das therapeutische Begleitmodul könnte diese Schwelle erreichen – das wäre im Rahmen der Datenschutz-Folgenabschätzung zu klären. Die Vernetzungskomponente (A) allein dürfte unterhalb der DiGA-Schwelle liegen. [cite: 261, 262, 263, 264, 265]"},
  ]},
  {c:"5. Zu Finanzierung und Kosten",qs:[
    {q:"Was kostet die Plattform?",a:"Erstentwicklung: Die Entwicklungskosten eines Open-Source-Prototyps liegen im Rahmen gängiger Förderprogramme (Prototype Fund: bis 158.000 EUR, NLnet: bis 50.000 EUR). Laufende Betriebskosten (Hosting, Wartung, Support): niedriger fünfstelliger Bereich jährlich. Dem stehen potenzielle Einsparungen durch vermiedene Wiederholungs-Rehabilitationen gegenüber. [cite: 267, 268, 269]"},
    {q:"Warum kein Vergütungsmodell pro Vermittlung?",a:"Bei der Recherche hat sich gezeigt, dass entgegen einer verbreiteten Annahme kein Vermittlungshonorar von der Klinik an eine Beratungsstelle fließt. Die Nachsorgevergütung geht an die durchführende Nachsorgeeinrichtung für deren Arbeit, nicht an die vermittelnde Klinik. Ein Vergütungsmodell auf einer nicht existierenden Grundlage aufzubauen wäre nicht seriös. Stattdessen setzt das Papier auf den Qualitätsanreiz: bessere Katamnese-Ergebnisse für die Klinik. [cite: 270, 271, 272, 273, 274]"},
    {q:"Die Kostenschätzung 8.000–15.000 EUR pro stationärer Reha – woher kommt die?",a:"Konservative Schätzung auf Basis üblicher DRV-Tagessätze (ca. 100–180 EUR/Tag) bei 8–22 Wochen Behandlungsdauer. Es handelt sich um eine Größenordnung, nicht um eine exakte Einzelfallabrechnung. Die tatsächlichen Kosten variieren je nach Einrichtung und Behandlungsdauer. Im Papier ist das entsprechend gekennzeichnet. [cite: 275, 276, 277, 278]"},
  ]},
  {c:"6. Zur Wirksamkeit und Evaluation",qs:[
    {q:"Wie messen Sie den Erfolg?",a:"Zwei Messgrößen: (1) 12-Monats-Abstinenzrate der Piloteinrichtungen im Vergleich zur Baseline (Katamnese, DGSS-Standard 4). (2) Dokumentierte SHG-Anbindungsquote bei Entlassung. Erfolgskriterium: signifikante Verbesserung der Abstinenzrate ODER Erhöhung der Anbindungsquote um mindestens 20 Prozentpunkte. [cite: 280, 281, 282]"},
    {q:"Was passiert, wenn die Sunset-Klausel greift?",a:"Die Maßnahme wird nach 24 Monaten beendet, ohne weitere Rechtfertigung. Das ist der Sinn der Klausel: Sie nimmt das Risiko. Wenn die Plattform keinen messbaren Effekt zeigt, wird sie eingestellt. Wenn sie wirkt, wird sie zur Regelleistung. Es gibt kein drittes Szenario. [cite: 283, 284, 285, 286]"},
    {q:"10 Piloteinrichtungen – reicht das für belastbare Daten?",a:"Bei durchschnittlich 100–200 Sucht-Rehabilitanden pro Einrichtung und Jahr ergibt das 1.000–2.000 Fälle über 24 Monate. Das ist keine RCT-Power, aber ausreichend für eine Erprobung mit Kontrollgruppen-Vergleich. Die Streuung über mindestens fünf Bundesländer sichert regionale Repräsentativität. [cite: 287, 288, 289]"},
  ]},
  {c:"7. Zum therapeutischen Begleitmodul",qs:[
    {q:"Ist das Begleitmodul nicht Therapie durch eine App? Wo ist die Abgrenzung?",a:"Das Begleitmodul ist kein Therapieersatz. Es strukturiert den Tag (Check-in, Reflexion), visualisiert körperliche Regeneration und hält eine Notfallkontakt-Funktion bereit. Es ersetzt weder Gruppengespräche noch Therapeutenkontakte, sondern überbrückt die Zeit zwischen diesen. Vergleichbar mit einem Tagebuch oder einer Achtsamkeits-App – kein diagnostisches oder therapeutisches Werkzeug. [cite: 291, 292, 293, 294]"},
    {q:"Therapeuten sollen die App konfigurieren – wer bezahlt diese Arbeit?",a:"Das Papier adressiert dieses Bedenken explizit. Die individuelle Konfiguration (Szenario 1) ist optional und erfordert einmalig 15–20 Minuten. Die drei anderen Szenarien (DRV-Zusatzmodul, GKV-Prävention, Selbstzahler) erfordern keinen Klinikaufwand. Die datenbasierte Weiterentwicklung der Standardmodule erfolgt über anonymisierte Nutzungsdaten, nicht über individuelle Therapeutenarbeit. [cite: 295, 296, 297, 298]"},
    {q:"Das 66-Tage-Argument – gilt das auch für Suchtverhalten?",a:"Die Lally-Studie (2009) bezieht sich auf allgemeine Gewohnheitsbildung, nicht spezifisch auf Sucht. Suchtverhalten ist komplexer, weil ein Suchtgedächtnis besteht, das auch nach Jahren Abstinenz reaktiviert werden kann. Die 66 Tage sind daher als Untergrenze zu verstehen – bei Suchtverhalten ist der Zeitraum vermutlich länger. Das stärkt das Argument: Wenn schon einfache Gewohnheiten 66+ Tage brauchen, brauchen Verhaltensänderungen bei Sucht umso mehr kontinuierliche Unterstützung nach Entlassung. [cite: 299, 300, 301, 302, 303]"},
  ]},
  {c:"8. Zur Praxisbeobachtung",qs:[
    {q:"Ihre Beobachtung ist ein Einzelfall. Wie verallgemeinerbar ist das?",a:"Die Beobachtung ist als solche gekennzeichnet – nicht als Studie. Sie illustriert die strukturelle Dynamik, die sich aus der Lücke zwischen Reha-Standort und Wohnort ergibt. Ob diese Dynamik in anderen Einrichtungen ähnlich auftritt, wäre eine der Fragestellungen der Pilotphase. Die Beobachtung zeigt vor allem zwei empirisch überprüfbare Punkte: dass der Wunsch nach Gruppenanbindung besteht und dass digitale Technologien bereits genutzt werden. [cite: 305, 306, 307, 308, 309]"},
    {q:"Die Therapeuten warnen davor – widersprechen Sie den Therapeuten?",a:"Nein. Die Therapeuten haben recht, dass informelle Gruppen mit Leitern kurzer Abstinenz ein Risiko darstellen. Das Papier argumentiert nicht gegen diese Einschätzung, sondern für eine strukturelle Lösung: Wenn das Bedürfnis nach Anbindung so stark ist, dass es entgegen der Empfehlung in instabile Strukturen fließt, sollte ein stabiles Alternativangebot geschaffen werden – nämlich die Verbindung zu etablierten Gruppen. [cite: 310, 311, 312]"},
  ]},
  {c:"9. Zur Abgrenzung von bestehenden Angeboten",qs:[
    {q:"Es gibt doch schon die NAKOS-Datenbank für digitale Selbsthilfe. Was ist der Unterschied?",a:"Die NAKOS-Datenbank ist ein Verzeichnis. Sie listet Gruppen auf, die sich digital treffen. Die vorgeschlagene Plattform geht darüber hinaus: sie integriert die Suche in den Reha-Prozess (PLZ-Matching während der Rehabilitation), ermöglicht Video-Kennenlern-Sessions aus der Klinik heraus, dokumentiert die Teilnahme für den Entlassungsbericht und ergänzt die Vernetzung um ein therapeutisches Begleitmodul. Die NAKOS-Datenbank könnte als Datenquelle eingebunden werden. [cite: 314, 315, 316, 317]"},
    {q:"Es gibt Apps wie „befreit leben lernen“ vom Blauen Kreuz. Was ist anders?",a:"„Befreit leben lernen“ ist eine Selbsthilfe-Content-Plattform: Texte, Hörbücher, Verständnisfragen. Die vorgeschlagene Plattform ist eine Vernetzungs- und Struktur-Plattform: sie verbindet Menschen mit konkreten Gruppen an ihrem Wohnort, ermöglicht Video-Teilnahme vor Entlassung und bietet ein tägliches Begleitmodul. Die Ansätze ergänzen sich, konkurrieren nicht. [cite: 318, 319, 320]"},
    {q:"Warum nicht einfach die bestehende Nachsorge (IRENA, Curriculum Hannover) ausbauen?",a:"Die bestehenden Nachsorgeprogramme sind professionelle, vergütete Leistungen in Beratungsstellen. Sie adressieren eine andere Ebene als die Selbsthilfegruppen-Anbindung. Die S3-Leitlinie empfiehlt beides – professionelle Nachsorge und Selbsthilfe – in allen Phasen. Das eine ersetzt nicht das andere. Die Plattform adressiert spezifisch die Selbsthilfe-Lücke, nicht die Beratungsstellen-Nachsorge. [cite: 321, 322, 323, 324]"},
  ]}
];
 
const PAPER_SECTIONS = [
  {h:"1. Zusammenfassung",ps:["Die Selbsthilfegruppe ist einer der wirksamsten Einzelfaktoren für langfristige Abstinenz. Ohne Nachbehandlung: ca. 80% Rückfall; mit Therapie: ca. 40%. Unter aktiven SHG-Teilnehmern: 87% ohne Rückfall.","Vorschlag: Bestehende Pflicht durch digitale Plattform auf den Wohnort umlenken + therapeutisches Begleitmodul. Sunset-Klausel: kein Effekt nach 24 Monaten → automatische Beendigung.","Anlass: Fachvortrag zur Nachsorge während eigener stationärer Rehabilitation. Die Gruppen, die uns vorgestellt werden, liegen am Klinikstandort – nicht dort, wo wir leben."]},
  {h:"2.1 Die Zahlen",table:[["Rückfallquote ohne Nachbehandlung¹","ca. 80 %"],["Rückfallquote mit Nachbehandlung¹","ca. 40 %"],["Ohne Rückfall unter aktiven SHG-Teilnehmern²","87 %"],["Abgeschl. Sucht-Reha-Leistungen (DRV 2023)³","37.821"],["Kosten stationäre Entwöhnung","ca. 8.000–15.000 EUR"],["Vermittlung an Selbsthilfegruppen","keine Vergütung"]]},
  {h:"2.2 Der Strukturbruch",ps:["Reha liegt ortsfern. Vier SHG-Vorstellungen am Klinikstandort → Pflicht. Nach Entlassung: Rückkehr an Wohnort, kein Kontakt dort."],box:"Kernproblem: Die Pflicht wird formell erfüllt, aber verfehlt ihren Zweck. Die Lücke zwischen Reha-Standort und Wohnort bleibt ungeschlossen."},
  {h:"2.3 Der Fehlanreiz",ps:["Vermittlung in Beratungsstelle: ~70 EUR. Vermittlung an SHG: 0 EUR. Das System belohnt die weniger wirksame Maßnahme."]},
  {h:"2.4 Der fehlende Anker",ps:["Nach Entlassung fehlt vielen: Struktur, Tagesrhythmus, stabiler Bezugsrahmen. Dieses Vakuum ist ein eigenständiger Rückfalltreiber."]},
  {h:"3.1 Komponente A – Vernetzungsplattform",ps:["Modul A1: PLZ-basiertes Gruppen-Matching. Modul A2: Video-Vorstellung aus der Reha (4 Pflichttermine digital, bei Wohnort-Gruppen). Modul A3: Verbindliche Anmeldung vor Entlassung."],box:"Wirkungskette: Reha-Woche 8–10 → Video-Kennenlern → Verbindliche Anmeldung → Am Wohnort direkt zur Gruppe → Kritische Wochen abgesichert."},
  {h:"3.2 Komponente B – Anker-Modul",ps:["B1: Kompass (Morgen-Check-in, Tagesimpuls). B2: Körper Heute (Regenerationszähler). B3: Spiegel (Wochenrückblick, Abstinenz-Zähler ohne Reset). B4: Wege (Perspektivenwechsel, Wegpunkte). B5: Notfall (Suchtdruck ≥7 → Sofortoptionen)."]},
  {h:"3.3 Komponente C – Therapeuten-Arm",ps:["Das 66-Tage-Problem (Lally et al.): Verhaltensänderungen beginnen in der Reha, automatisieren sich erst nach 66–90+ Tagen. Therapeuten-Dashboard: anonymisierte Statistiken, individuelle Modulkonfiguration, automatisierte Fortführung."],box:"Die Plattform schließt räumliche UND zeitliche Lücke. Therapeuten erhalten erstmals ein Werkzeug über die Entlassung hinaus."},
  {h:"4. Bildschirm-Übersicht",ps:["5 Hauptbereiche: DEIN TAG (Check-in, Körper, Termin) · VERBINDUNG (Gruppe, Suche, Sessions) · STRUKTUR (Wochenplan, Wegpunkte) · VERLAUF (Trends, Journal) · JETZT (Notfallkontakt, Atemübung)."]},
  {h:"5. Katamnese-Wirkung",ps:["Für Kliniken: bessere Katamnese bei gleichem Aufwand. Für DRV: Kostensenkung durch vermiedene Wiederholungs-Reha. Für System: Ehrenamtliche SHGs = kostengünstigster Hebel."]},
  {h:"6. Sunset-Klausel",ps:["24 Monate, min. 10 Piloteinrichtungen. KPI 1: 12-Monats-Abstinenzrate (DGSS-4). KPI 2: SHG-Anbindungsquote (≥20pp). Nicht erreicht → automatische Beendigung."]},
  {h:"7. Finanzierung",ps:["Open Source, Erstentwicklung über NLnet/Prototype Fund. Betrieb: niedriger 5-stelliger Bereich. Amortisierung durch wenige vermiedene Wiederholungs-Reha."]},
  {h:"8. Datenschutz",ps:["Art. 9 DSGVO. E2EE, AES-256, Zero-Knowledge. EU-Server. DSFA vor Pilotstart. Automatische Löschung nach 12 Monaten."]},
  {h:"9. Regulatorische Verankerung",ps:["Keine Gesetzesänderung nötig. RTS-Ergänzung, Leitfaden-Präzisierung, Rahmenkonzept-Erweiterung."],box:"Zeitfenster: RTS-Überarbeitung läuft. Inkrafttreten vorauss. 01.01.2027. Stellungnahme jetzt = hohe Wirkung."},
  {h:"10. Umsetzungsplan",ps:["Q2/26: DRV-Stellungnahme + Dachverbände. Q3/26: Piloteinrichtungen. Q3-Q4/26: Prototyp. Q1/27: Pilotstart. Q1/28: Zwischenevaluation. Q1/29: Abschlussevaluation."]},
  {h:"11. Schluss",ps:["Die SHG scheitert nicht an mangelnder Wirksamkeit, sondern an einer strukturellen Lücke. Diese zu schließen erfordert nur eine digitale Brücke, eine kleine Textänderung und Bereitschaft. Die Zahlen sprechen für sich. Die Sunset-Klausel nimmt das Risiko."]},
];
 
const TabUebersicht = () => {
  const [docTab,setDocTab]=useState("paper");
  const SC = ({val,label}) => (<div style={{background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.r,padding:"16px 14px"}}><div style={{color:T.blue,fontSize:22,fontWeight:700,fontFamily:T.fontMono}}>{val}</div><div style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,marginTop:4,lineHeight:1.4}}>{label}</div></div>);
  const CC = ({letter,color,name,desc,feat}) => (<div style={{background:T.surface,borderRadius:T.r,padding:"20px 18px",borderLeft:`3px solid ${color}`,border:`1px solid ${T.borderSubtle}`,borderLeftWidth:3,borderLeftColor:color}}><span style={{color,fontSize:10,fontFamily:T.fontMono,fontWeight:500}}>KOMPONENTE {letter}</span><h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"4px 0 8px"}}>{name}</h3><p style={{color:T.silver,fontSize:13,lineHeight:1.6,margin:"0 0 10px"}}>{desc}</p><div style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{feat}</div></div>);
  const DT = ({id,label,active}) => (<button onClick={()=>setDocTab(id)} style={{padding:"7px 14px",borderRadius:T.rSm,border:`1px solid ${active?T.blueActive:T.borderSubtle}`,background:active?T.blueGlow:"transparent",color:active?T.blue:T.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>{label}</button>);
 
  return (<div>
    <div style={{padding:"56px 0 40px",textAlign:"center"}}>
      <Pill>Positionspapier bei DRV Bund eingereicht · April 2026</Pill>
      <h1 style={{color:T.white,fontSize:"clamp(26px,5vw,36px)",fontWeight:700,margin:"20px 0 14px",letterSpacing:"-0.03em",lineHeight:1.15}}>Nachsorge beginnt <span style={{color:T.blue}}>vor der Entlassung</span></h1>
      <p style={{color:T.silver,fontSize:16,lineHeight:1.6,maxWidth:540,margin:"0 auto"}}>AnkerNetz verbindet Rehabilitanden noch während der Reha mit Selbsthilfegruppen an ihrem Wohnort — digital, datenschutzkonform und in bestehende Strukturen eingebettet.</p>
      <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:28}}>
        {[["Status","Konzeptphase"],["Lizenz","AGPL-3.0"],["Stack","React + Supabase + PostGIS"]].map(([k,v],i)=>(<div key={i} style={{fontSize:11,fontFamily:T.fontMono,color:T.muted}}>{k}: <span style={{color:T.blue}}>{v}</span></div>))}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
      <SC val="80%" label="Rückfallquote ohne Nachbehandlung" />
      <SC val="40%" label="Rückfallquote mit Nachbehandlung" />
      <SC val="87%" label="Ohne Rückfall unter aktiven SHG-Teilnehmern" />
      <SC val="37.821" label="Sucht-Reha-Leistungen/Jahr (DRV 2023)" />
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:10}}>
      <SC val="~100k" label="Selbsthilfegruppen in DE" />
      <SC val="300+" label="Kontaktstellen bundesweit" />
      <SC val="8" label="kritische Wochen nach Entlassung" />
    </div>
    <Sec title="Das Problem" sub="Strukturelle Lücke zwischen Reha und Alltag">
      {[{t:"Pflichtvorstellung ≠ Wohnort",d:"KTL F12.2 verlangt SHG-Vorstellung am Klinikstandort. Rehabilitanden kehren an einen anderen Ort zurück."},{t:"Kein digitaler Kanal",d:"NAKOS listet ~300 Kontaktstellen. Maschinenlesbares SHG-Register existiert nicht."},{t:"Kritische Phase ungesichert",d:"66–90+ Tage für Gewohnheitsbildung. Genau dann fehlt Begleitung."},{t:"Fehlanreiz",d:"Vermittlung Beratungsstelle: ~70€. Vermittlung SHG: 0€."}
      ].map((x,i)=>(<div key={i} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}><h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 6px"}}>{x.t}</h3><p style={{color:T.silver,fontSize:13,lineHeight:1.5,margin:0}}>{x.d}</p></div>))}
    </Sec>
    <Sec title="Die Lösung" sub="Drei Komponenten — ein System">
      <div style={{display:"grid",gap:12}}>
        <CC letter="A" color={T.blue} name="SHG-Matching" desc="Wohnortbasierte Vermittlung per PLZ, Thema, Format. Video-Kennenlern noch während der Reha." feat="Score = 0.6×Thema + 0.3×Nähe + 0.1×Format · PostGIS" />
        <CC letter="B" color={T.gold} name="Anker-Modul" desc="Therapeutische Tagesstruktur für 8 Wochen: Check-ins, Bausteine, Fortschritt." feat="Kompass · Körper Heute · Spiegel · Notfall" />
        <CC letter="C" color={T.success} name="Therapeuten-Schnittstelle" desc="Anonymisierte Kohortenstatistiken, PATFAK-kompatibel (HL7/PDF)." feat="k-Anonymität (min. 5) · Opt-in · DSGVO Art. 9" />
      </div>
    </Sec>
    <Sec title="Architektur & Zeitstrahl" sub="System-Ebenen und Ablauf">
      <div style={{display:"grid", gap:20}}>
        <div style={{background:T.surface, border:`1px solid ${T.borderSubtle}`, borderRadius:T.r, padding:"16px", textAlign:"center"}}>
          <h3 style={{color:T.white, fontSize:15, fontWeight:600, marginBottom:12}}>Akteur-Ebenen und Anbindungen</h3>
          <img src="/akteur-ebenen.png" alt="Akteur-Ebenen" style={{width:"100%", borderRadius:T.rSm}} />
        </div>
        <div style={{background:T.surface, border:`1px solid ${T.borderSubtle}`, borderRadius:T.r, padding:"16px", textAlign:"center"}}>
          <h3 style={{color:T.white, fontSize:15, fontWeight:600, marginBottom:12}}>Phasen-Zeitstrahl: Systeme und Anbindungen</h3>
          <img src="/phasen-zeitstrahl.png" alt="Zeitstrahl" style={{width:"100%", borderRadius:T.rSm}} />
        </div>
      </div>
    </Sec>
    <Sec title="Zeitplan" sub="Q2 2026 — Q1 2029">
      {[{p:"April 2026",l:"Positionspapier an DRV Bund",b:"done"},{p:"April 2026",l:"Technische Architektur",b:"done"},{p:"Mai 2026",l:"NAKOS-Kooperationsanfrage",b:"active"},{p:"Mai 2026",l:"DRV-Nachfass",b:"active"},{p:"Jun–Sep 2026",l:"Prototyp (MVP)",b:"planned"},{p:"Okt–Nov 2026",l:"Prototype Fund Klasse 03",b:"planned"},{p:"Q1 2027–Q1 2029",l:"Pilot und Rollout",b:"planned"}
      ].map((r,i)=>(<div key={i} style={{display:"flex",gap:16,padding:"14px 0",borderBottom:`1px solid ${T.borderSubtle}`}}>
        <span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,minWidth:100,flexShrink:0,paddingTop:2}}>{r.p}</span>
        <div><span style={{fontSize:14,fontWeight:600,color:T.silver}}>{r.l} </span><Pill color={r.b==="done"?T.blue:r.b==="active"?T.gold:T.muted} bg={r.b==="done"?T.blueGlow:r.b==="active"?T.goldGlow:`${T.muted}20`}>{r.b==="done"?"erledigt":r.b==="active"?"aktiv":"geplant"}</Pill></div>
      </div>))}
    </Sec>
    <Sec title="Team" sub="Strauß & Reinemann">
      <div style={{display:"grid",gap:12}}>
        {[{n:"Gero Strauß",r:"Technical Lead",d:"React, Supabase, Vite, Vercel. IBMgt (HS Konstanz), Oxford Blockchain. Wikimedia DE."},{n:"Carsten Reinemann",r:"Research & Outreach",d:"Projektmanagement bei ARAG und Sheer. Wikimedia DE."}].map((p,i)=>(
          <div key={i} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px"}}><h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 4px"}}>{p.n}</h3><p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 6px"}}>{p.r}</p><p style={{color:T.silver,fontSize:13,lineHeight:1.5,margin:0}}>{p.d}</p></div>
        ))}
      </div>
    </Sec>
    <Sec id="docs" title="Dokumente" sub="Positionspapier · FAQ Reha-Einrichtungen · FAQ DRV & Förderer">
      <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
        <DT id="paper" label="Positionspapier" active={docTab==="paper"} />
        <DT id="faq-reha" label={"Fragen: Reha ("+FAQ_REHA.reduce((a,c)=>a+c.qs.length,0)+")"} active={docTab==="faq-reha"} />
        <DT id="faq-drv" label={"Fragen: DRV ("+FAQ_DRV.reduce((a,c)=>a+c.qs.length,0)+")"} active={docTab==="faq-drv"} />
      </div>
 
      {docTab==="paper" && <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"20px 16px",maxHeight:"70vh",overflowY:"auto"}}>
        <p style={{color:T.blue,fontSize:10,fontFamily:T.fontMono,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 4px"}}>POSITIONSPAPIER</p>
        <h3 style={{color:T.white,fontSize:16,fontWeight:600,margin:"0 0 4px"}}>Wohnortbezogene Selbsthilfegruppen-Anbindung</h3>
        <p style={{color:T.muted,fontSize:12,margin:"0 0 16px",fontStyle:"italic"}}>Digitale Vernetzung als Bestandteil der Nachsorgevorbereitung in der medizinischen Rehabilitation Abhängigkeitskranker</p>
        {PAPER_SECTIONS.map((sec,si) => (
          <div key={si}>
            <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>{sec.h}</h4>
            {sec.table && <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",margin:"12px 0"}}><tbody>{sec.table.map((row,ri) => (
              <tr key={ri} style={{borderBottom:`1px solid ${T.borderSubtle}`}}>
                <td style={{padding:"6px 8px",color:T.muted}}>{row[0]}</td>
                <td style={{padding:"6px 8px",color:T.silver,fontWeight:600}}>{row[1]}</td>
              </tr>
            ))}</tbody></table>}
            {sec.ps && sec.ps.map((p,pi) => <p key={pi} style={{color:T.muted,fontSize:13,lineHeight:1.7,margin:"0 0 8px"}}>{p}</p>)}
            {sec.box && <div style={{background:"rgba(91,141,239,0.08)",borderLeft:`3px solid ${T.blue}`,padding:"10px 14px",borderRadius:"0 6px 6px 0",margin:"12px 0"}}><p style={{color:T.silver,fontSize:13,margin:0,lineHeight:1.6}}>{sec.box}</p></div>}
          </div>
        ))}
      </div>}
 
      {docTab==="faq-reha" && <div>
        <p style={{color:T.muted,fontSize:12,marginBottom:12,fontFamily:T.fontMono}}>{FAQ_REHA.reduce((a,c)=>a+c.qs.length,0)} Fragen in {FAQ_REHA.length} Kategorien</p>
        {FAQ_REHA.map((cat,ci)=>(<div key={ci}><h4 style={{color:T.blue,fontSize:11,fontWeight:600,fontFamily:T.fontMono,margin:"14px 0 4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{cat.c}</h4>{cat.qs.map((q,qi)=>(<Accordion key={qi} title={q.q}><p style={{margin:0}}>{q.a}</p></Accordion>))}</div>))}
      </div>}
 
      {docTab==="faq-drv" && <div>
        <p style={{color:T.muted,fontSize:12,marginBottom:12,fontFamily:T.fontMono}}>{FAQ_DRV.reduce((a,c)=>a+c.qs.length,0)} Fragen in {FAQ_DRV.length} Kategorien</p>
        {FAQ_DRV.map((cat,ci)=>(<div key={ci}><h4 style={{color:T.blue,fontSize:11,fontWeight:600,fontFamily:T.fontMono,margin:"14px 0 4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{cat.c}</h4>{cat.qs.map((q,qi)=>(<Accordion key={qi} title={q.q}><p style={{margin:0}}>{q.a}</p></Accordion>))}</div>))}
      </div>}
    </Sec>
    <div style={{padding:"48px 0"}}>
      <div style={{background:T.surface,border:`1px solid ${T.blue}`,borderRadius:T.r,padding:32,textAlign:"center"}}>
        <h3 style={{color:T.white,fontSize:20,fontWeight:600,margin:"0 0 10px"}}>Gemeinsam bauen</h3>
        <p style={{color:T.muted,fontSize:14,margin:"0 auto 24px",maxWidth:460,lineHeight:1.6}}>AnkerNetz ist Open Source und sucht Partner: Reha-Kliniken, Kontaktstellen, Therapeuten, Entwickler.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="mailto:kontakt@ankernetz.org" style={{padding:"10px 24px",background:T.blue,color:"#fff",borderRadius:T.rSm,fontWeight:600,fontSize:13,textDecoration:"none"}}>Kontakt aufnehmen</a>
          <a href="https://deinestimme.org" style={{padding:"10px 24px",border:`1px solid ${T.muted}`,color:T.silver,borderRadius:T.rSm,fontWeight:500,fontSize:13,textDecoration:"none"}}>DeineStimme.org</a>
        </div>
      </div>
    </div>
  </div>);
};
 
const TabDemo = () => {
  const [view,setView]=useState("doors");
  const [form,setForm]=useState({plz:"",topic:"Alkohol",fmt:"Egal",radius:"10"});
  const [selGroup,setSelGroup]=useState(null);
  const [bookings,setBookings]=useState([]);
  const addBooking = (g,s) => { if(!bookings.find(b=>b.sid===s.sid)) setBookings([...bookings,{...s,groupName:g.name,groupId:g.id}]); };
  const removeBooking = (sid) => setBookings(bookings.filter(b=>b.sid!==sid));
  const isBooked = (sid) => bookings.some(b=>b.sid===sid);
  const Back = ({to,label="Zurück"}) => (<button onClick={()=>setView(to)} style={{background:"none",border:"none",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:T.fontMono,marginBottom:20,padding:0}}>← {label}</button>);
  const pIcon = (p) => p==="Zoom"?"📹":p==="Jitsi"?"🟢":p==="Google Meet"?"🔵":p==="Hybrid"?"🔀":"📍";
 
  if(view==="doors") return (
    <div style={{padding:"56px 0",textAlign:"center"}}>
      <h2 style={{color:T.white,fontSize:22,fontWeight:600,margin:"0 0 6px"}}>Was möchtest du erkunden?</h2>
      <p style={{color:T.muted,fontSize:13,fontFamily:T.fontMono,margin:"0 0 36px"}}>Demo-Modus — keine echten Daten</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,maxWidth:520,margin:"0 auto"}}>
        <button onClick={()=>setView("search")} style={{background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.r,padding:"28px 18px",cursor:"pointer",textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:T.blueGlow,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:20}}>🔍</div>
          <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Ich suche eine Gruppe</h3>
          <p style={{color:T.muted,fontSize:12,margin:0}}>SHG finden, Kennenlern-Session buchen</p>
        </button>
        <button onClick={()=>setView("anker")} style={{background:T.surface,border:`1px solid rgba(232,148,58,0.2)`,borderRadius:T.r,padding:"28px 18px",cursor:"pointer",textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:T.goldGlow,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:20}}>⚓</div>
          <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Mein Reha-Plan</h3>
          <p style={{color:T.muted,fontSize:12,margin:0}}>Tagesstruktur für die ersten 8 Wochen</p>
        </button>
      </div>
      {bookings.length>0 && <button onClick={()=>setView("dashboard")} style={{marginTop:24,padding:"10px 20px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.blue,fontSize:13,fontWeight:500,cursor:"pointer"}}>📋 Meine Termine ({bookings.length})</button>}
    </div>
  );
 
  if(view==="search") {
    const Chip = ({label,field}) => (<button onClick={()=>setForm({...form,[field]:label})} style={{padding:"7px 13px",borderRadius:T.rSm,fontSize:12,cursor:"pointer",fontFamily:T.fontBody,background:form[field]===label?T.blueGlow:T.surface,border:`1px solid ${form[field]===label?T.blueActive:T.borderSubtle}`,color:form[field]===label?T.blue:T.silver}}>{label}</button>);
    return (
      <div style={{padding:"36px 0",maxWidth:420}}>
        <Back to="doors" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>Gruppe finden</h2>
        <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 28px"}}>Wir suchen passende SHGs in deiner Nähe</p>
        <div style={{display:"grid",gap:18}}>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Postleitzahl</label>
            <input value={form.plz} onChange={e=>setForm({...form,plz:e.target.value})} placeholder="z.B. 12099" style={{width:"100%",padding:"11px 13px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.white,fontSize:14,fontFamily:T.fontMono,outline:"none",boxSizing:"border-box"}} /></div>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Thema</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Alkohol","Medikamente","Drogen","Glücksspiel","Essstörung"].map(t=><Chip key={t} label={t} field="topic" />)}</div></div>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Format</label><div style={{display:"flex",gap:5}}>{["Egal","Präsenz","Online","Hybrid"].map(f=><Chip key={f} label={f} field="fmt" />)}</div></div>
          <button onClick={()=>setView("results")} style={{padding:"13px",background:T.blue,color:T.void,border:"none",borderRadius:T.rSm,fontWeight:600,fontSize:14,cursor:"pointer",marginTop:4}}>Gruppen suchen →</button>
        </div>
      </div>
    );
  }
 
  if(view==="results") {
    const filtered = GROUPS.filter(g=>(form.fmt==="Egal"||g.fmt===form.fmt)&&g.topic===form.topic);
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="search" label="Suche anpassen" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>{filtered.length} Gruppen gefunden</h2>
        <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 20px"}}>PLZ {form.plz||"12099"} · {form.topic} · {form.fmt}</p>
        {filtered.map(g=>(<button key={g.id} onClick={()=>{setSelGroup(g);setView("detail");}} style={{display:"block",width:"100%",background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px 14px",cursor:"pointer",textAlign:"left",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:T.white,fontSize:14,fontWeight:600}}>{g.name}</span><Pill color={g.score>85?T.success:T.blue} bg={g.score>85?T.successGlow:T.blueGlow}>{g.score}%</Pill></div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.fmt}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.dist}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.day} {g.time}</span></div>
        </button>))}
      </div>
    );
  }
 
  if(view==="detail" && selGroup) {
    const g = selGroup;
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="results" label="Zurück zur Liste" />
        <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"22px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div><h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>{g.name}</h2><p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:0}}>{g.plz} · {g.dist}</p></div><Pill color={T.success} bg={T.successGlow}>Match {g.score}%</Pill></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>{[["Thema",g.topic],["Format",g.fmt],["Termin",g.day+", "+g.time],["Mitglieder",g.members+" aktiv"],["Kontakt",g.contact]].map(([l,v],i)=>(<div key={i}><span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>{l}</span><div style={{color:T.silver,fontSize:13,marginTop:2}}>{v}</div></div>))}</div>
        </div>
        <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 12px"}}>Sessions</h3>
        {g.sessions.map(s=>{
          const booked = isBooked(s.sid);
          return (<div key={s.sid} style={{background:T.surface,border:`1px solid ${booked?T.success+"30":T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><Pill color={s.type==="Kennenlern"?T.gold:T.blue} bg={s.type==="Kennenlern"?T.goldGlow:T.blueGlow}>{s.type}</Pill><div style={{color:T.white,fontSize:14,fontWeight:500,marginTop:8}}>{new Date(s.date).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})} · {s.time}</div></div>
              <span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{s.free} frei</span>
            </div>
            <div style={{background:T.bg,borderRadius:T.rSm,padding:"10px 12px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span>{pIcon(s.platform)}</span><span style={{color:T.silver,fontSize:13,fontWeight:500}}>{s.platform}</span></div>
              {s.code && <div style={{color:T.blue,fontSize:12,fontFamily:T.fontMono,marginTop:4}}>{s.code}</div>}
              {s.addr && <div style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,marginTop:4}}>{s.addr}</div>}
            </div>
            {booked ? <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.success,fontSize:13}}>✓ Angemeldet</span><button onClick={()=>removeBooking(s.sid)} style={{background:"none",border:`1px solid ${T.danger}30`,borderRadius:T.rSm,color:T.danger,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>Absagen</button></div>
            : <button onClick={()=>addBooking(g,s)} style={{width:"100%",padding:"10px",background:T.blue,color:T.void,border:"none",borderRadius:T.rSm,fontWeight:600,fontSize:13,cursor:"pointer"}}>Verbindlich anmelden</button>}
          </div>);
        })}
      </div>
    );
  }
 
  if(view==="anker") {
    const blocks=[{i:"🏃",n:"Bewegung",t:"07:30",d:1},{i:"🧘",n:"Reflexion",t:"08:30",d:1},{i:"📞",n:"Soziales",t:"11:00",d:0},{i:"🎨",n:"Kreativ",t:"14:00",d:0},{i:"🍽️",n:"Ernährung",t:"18:00",d:0},{i:"📝",n:"Check-in",t:"21:00",d:0}];
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="doors" />
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:T.goldGlow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚓</div>
          <div><h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:0}}>Anker-Modul</h2><p style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,margin:0}}>Tag 12 / 56 · Demo</p></div>
        </div>
        <h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 10px"}}>Tagesstruktur</h3>
        {blocks.map((b,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.surface,borderRadius:T.rSm,border:`1px solid ${T.borderSubtle}`,marginBottom:5,opacity:b.d?0.5:1}}><span style={{fontSize:16}}>{b.i}</span><span style={{flex:1,color:T.white,fontSize:13,fontWeight:500,textDecoration:b.d?"line-through":"none"}}>{b.n}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{b.t}</span>{b.d?<span style={{color:T.success}}>✓</span>:null}</div>))}
        <div style={{marginTop:20,background:T.surface,borderRadius:T.r,padding:14,border:`1px solid ${T.borderSubtle}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>FORTSCHRITT</span><span style={{color:T.gold,fontSize:11,fontFamily:T.fontMono}}>21%</span></div>
          <div style={{height:5,background:T.muted+"30",borderRadius:3,marginTop:6}}><div style={{width:"21%",height:"100%",background:T.gold,borderRadius:3}} /></div>
          <p style={{color:T.muted,fontSize:11,marginTop:6,fontFamily:T.fontMono}}>12 von 56 Tagen</p>
        </div>
      </div>
    );
  }
 
  if(view==="dashboard") {
    const sorted = [...bookings].sort((a,b)=>a.date.localeCompare(b.date));
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="doors" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 20px"}}>Meine Termine ({bookings.length})</h2>
        {sorted.map(b=>(<div key={b.sid} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}>
          <span style={{color:T.white,fontSize:14,fontWeight:600}}>{b.groupName}</span>
          <div style={{color:T.silver,fontSize:13,marginTop:4}}>{new Date(b.date).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})} · {b.time}</div>
          <button onClick={()=>removeBooking(b.sid)} style={{marginTop:8,background:"none",border:`1px solid ${T.danger}30`,borderRadius:T.rSm,color:T.danger,fontSize:11,padding:"5px 10px",cursor:"pointer"}}>Absagen</button>
        </div>))}
      </div>
    );
  }
 
  return null;
};
 
export default function AnkerNetzApp() {
  const [authed,setAuthed]=useState(false);
  const [tab,setTab]=useState("uebersicht");
  return authed ? (
    <div style={{minHeight:"100vh",background:T.void,fontFamily:T.fontBody,color:T.silver}}>
      <nav style={{position:"sticky",top:0,zIndex:100,background:T.void+"ee",backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.borderSubtle}`,padding:"0 24px"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",height:52}}>
          <span style={{color:T.white,fontSize:14,fontWeight:600,marginRight:"auto"}}>⚓ AnkerNetz</span>
          {["uebersicht","demo"].map(id=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"7px 14px",borderRadius:T.rSm,border:"none",cursor:"pointer",background:tab===id?T.blueGlow:"transparent",color:tab===id?T.blue:T.muted,fontSize:12,fontWeight:500,fontFamily:T.fontBody}}>{id==="uebersicht"?"Übersicht":"Demo"}</button>))}
        </div>
      </nav>
      <main style={{maxWidth:720,margin:"0 auto",padding:"0 24px"}}>{tab==="uebersicht"?<TabUebersicht />:<TabDemo />}</main>
      <footer style={{borderTop:`1px solid ${T.borderSubtle}`,padding:20,textAlign:"center",marginTop:32}}>
        <p style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,margin:0}}>AnkerNetz · AGPL-3.0 · Strauß & Reinemann GbR (i.Gr.) · Teil des DeineStimme.org-Ökosystems</p>
      </footer>
    </div>
  ) : <PasswordWall onAuth={()=>setAuthed(true)} />;
}
