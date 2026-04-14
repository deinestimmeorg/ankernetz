import { useState, useEffect, useRef } from "react";

const PW = "RTS2027";
const T = {
  void: "#0B0B0F", bg: "#0E0F16", blue: "#5B8DEF", blueGlow: "rgba(91,141,239,0.12)",
  blueBorder: "rgba(91,141,239,0.15)", blueActive: "rgba(91,141,239,0.30)",
  gold: "#E8943A", goldGlow: "rgba(232,148,58,0.12)",
  silver: "#C0C8D0", muted: "#5A6068", mutedLight: "#7A828A",
  surface: "#111219", surfaceUp: "#161721", borderSubtle: "rgba(192,200,208,0.06)",
  success: "#5BEF8D", successGlow: "rgba(91,239,141,0.12)", danger: "#EF5B5B",
  white: "#EAEEF2", fontBody: "'Source Sans 3',system-ui,sans-serif", fontMono: "'DM Mono',monospace",
  r: "10px", rSm: "6px",
};

const injectFonts = () => {
  if (document.getElementById("an-fonts")) return;
  const l = document.createElement("link"); l.id = "an-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(l);
};

// ─── MOCK DATA ────────────────────────────────────────────
const GROUPS = [
  { id:1, name:"Freundeskreis Tempelhof", topic:"Alkohol", fmt:"Präsenz", dist:"2.3 km", plz:"12099", day:"Dienstag", time:"18:30", score:94, contact:"Heike M.", members:12,
    sessions:[
      {sid:"s1a",type:"Kennenlern",date:"2026-05-06",time:"18:30",free:4,platform:"Zoom",code:"823 4921 8834",pwd:"anker26",addr:null},
      {sid:"s1b",type:"Offenes Treffen",date:"2026-05-13",time:"18:30",free:8,platform:"Präsenz",code:null,pwd:null,addr:"Tempelhofer Damm 142, 12099 Berlin"},
      {sid:"s1c",type:"Kennenlern",date:"2026-05-20",time:"18:30",free:3,platform:"Jitsi",code:"meet.jit.si/AnkerNetz-FK-Tempelhof",pwd:null,addr:null},
    ]},
  { id:2, name:"Blaues Kreuz Neukölln", topic:"Alkohol", fmt:"Hybrid", dist:"3.8 km", plz:"12043", day:"Donnerstag", time:"19:00", score:87, contact:"Thomas K.", members:8,
    sessions:[
      {sid:"s2a",type:"Kennenlern",date:"2026-05-08",time:"19:00",free:5,platform:"Google Meet",code:"meet.google.com/abc-defg-hij",pwd:null,addr:null},
      {sid:"s2b",type:"Offenes Treffen",date:"2026-05-15",time:"19:00",free:6,platform:"Hybrid",code:"823 5512 7743",pwd:"bknk26",addr:"Sonnenallee 78, 12043 Berlin"},
    ]},
  { id:3, name:"Kreuzbund Schöneberg", topic:"Alkohol", fmt:"Präsenz", dist:"5.1 km", plz:"10823", day:"Mittwoch", time:"17:30", score:81, contact:"Petra S.", members:15,
    sessions:[
      {sid:"s3a",type:"Offenes Treffen",date:"2026-05-07",time:"17:30",free:10,platform:"Präsenz",code:null,pwd:null,addr:"Hauptstr. 22, 10823 Berlin"},
      {sid:"s3b",type:"Kennenlern",date:"2026-05-14",time:"17:30",free:4,platform:"Zoom",code:"847 2938 1120",pwd:"kb2026",addr:null},
    ]},
  { id:4, name:"NA Kreuzberg", topic:"Medikamente", fmt:"Online", dist:"—", plz:"10997", day:"Montag", time:"20:00", score:72, contact:"Anonym", members:6,
    sessions:[
      {sid:"s4a",type:"Kennenlern",date:"2026-05-05",time:"20:00",free:3,platform:"Jitsi",code:"meet.jit.si/NA-Kreuzberg-Offen",pwd:null,addr:null},
    ]},
  { id:5, name:"Guttempler Friedrichshain", topic:"Alkohol", fmt:"Präsenz", dist:"6.4 km", plz:"10245", day:"Freitag", time:"18:00", score:68, contact:"Werner R.", members:10,
    sessions:[
      {sid:"s5a",type:"Offenes Treffen",date:"2026-05-09",time:"18:00",free:7,platform:"Präsenz",code:null,pwd:null,addr:"Boxhagener Str. 44, 10245 Berlin"},
      {sid:"s5b",type:"Kennenlern",date:"2026-05-16",time:"18:00",free:5,platform:"Zoom",code:"891 3847 2210",pwd:"gutt26",addr:null},
    ]},
];

// ─── SHARED COMPONENTS ───────────────────────────────────
const Pill = ({children, color=T.blue, bg=T.blueGlow}) => (
  <span style={{fontSize:11,fontFamily:T.fontMono,fontWeight:500,padding:"3px 8px",borderRadius:4,background:bg,color}}>{children}</span>
);

const Accordion = ({title,children,defaultOpen=false}) => {
  const [open,setOpen] = useState(defaultOpen);
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

const Section = ({title,sub,children,id}) => (
  <section id={id} style={{padding:"48px 0",borderBottom:`1px solid ${T.borderSubtle}`}}>
    {title && <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px",letterSpacing:"-0.02em"}}>{title}</h2>}
    {sub && <p style={{color:T.muted,fontSize:12,margin:"0 0 24px",fontFamily:T.fontMono}}>{sub}</p>}
    {!sub && title && <div style={{height:24}} />}
    {children}
  </section>
);

// ─── PASSWORD WALL ───────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════
// ─── DIAGRAM TABS ────────────────────────────────────────
const DiagramTabs = () => {
  const [diaTab,setDiaTab]=useState("ebenen");
  return (<div>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
      {[["ebenen","Akteur-Ebenen"],["module","Module & Zeitstrahl"],["anbindung","Systeme & Anbindung"]].map(([id,label])=>(
        <button key={id} onClick={()=>setDiaTab(id)} style={{padding:"7px 14px",borderRadius:T.rSm,border:`1px solid ${diaTab===id?T.blueActive:T.borderSubtle}`,background:diaTab===id?T.blueGlow:"transparent",color:diaTab===id?T.blue:T.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>{label}</button>
      ))}
    </div>
    <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:16,overflowX:"auto"}}>
      {diaTab==="ebenen" && <><img src="/ebenen_anbindung.png" alt="Akteur-Ebenen" style={{width:"100%",maxWidth:680,display:"block",margin:"0 auto",borderRadius:4}} /><p style={{color:T.muted,fontSize:10,fontFamily:T.fontMono,textAlign:"center",marginTop:10}}>5 Ebenen: Bund → Verbände → Klinik → Plattform → Patient/SHG</p></>}
      {diaTab==="module" && <><object type="image/svg+xml" data="/architektur.svg" style={{width:"100%",maxWidth:680,display:"block",margin:"0 auto"}}>Architekturdiagramm</object><p style={{color:T.muted,fontSize:10,fontFamily:T.fontMono,textAlign:"center",marginTop:10}}>3 Komponenten · 4 Finanzierungsszenarien · Q2 2026 – Q1 2029</p></>}
      {diaTab==="anbindung" && <><img src="/akteur_ebenen.png" alt="Systeme und Anbindungen" style={{width:"100%",maxWidth:680,display:"block",margin:"0 auto",borderRadius:4}} /><p style={{color:T.muted,fontSize:10,fontFamily:T.fontMono,textAlign:"center",marginTop:10}}>PATFAK (HL7/PDF) · DRV-QS (KTL) · Katamnese (FVS/buss)</p></>}
    </div>
  </div>);
};

// TAB 1: ÜBERSICHT (condensed from original landing page)
// ═══════════════════════════════════════════════════════════
const TabUebersicht = () => {
  const [docTab,setDocTab]=useState("paper");
  const StatCard = ({val,label}) => (<div style={{background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.r,padding:"16px 14px"}}><div style={{color:T.blue,fontSize:22,fontWeight:700,fontFamily:T.fontMono}}>{val}</div><div style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,marginTop:4,lineHeight:1.4}}>{label}</div></div>);
  const CompCard = ({letter,color,name,desc,features}) => (<div style={{background:T.surface,borderRadius:T.r,padding:"20px 18px",borderLeft:`3px solid ${color}`,border:`1px solid ${T.borderSubtle}`,borderLeftWidth:3,borderLeftColor:color}}><span style={{color,fontSize:10,fontFamily:T.fontMono,fontWeight:500}}>KOMPONENTE {letter}</span><h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"4px 0 8px"}}>{name}</h3><p style={{color:T.silver,fontSize:13,lineHeight:1.6,margin:"0 0 10px"}}>{desc}</p><div style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{features}</div></div>);
  const DocTab = ({id,label,active}) => (<button onClick={()=>setDocTab(id)} style={{padding:"7px 14px",borderRadius:T.rSm,border:`1px solid ${active?T.blueActive:T.borderSubtle}`,background:active?T.blueGlow:"transparent",color:active?T.blue:T.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>{label}</button>);

  return (<div>
    {/* Hero */}
    <div style={{padding:"56px 0 40px",textAlign:"center"}}>
      <Pill>Positionspapier bei DRV Bund eingereicht · April 2026</Pill>
      <h1 style={{color:T.white,fontSize:"clamp(26px,5vw,36px)",fontWeight:700,margin:"20px 0 14px",letterSpacing:"-0.03em",lineHeight:1.15}}>Nachsorge beginnt <span style={{color:T.blue}}>vor der Entlassung</span></h1>
      <p style={{color:T.silver,fontSize:16,lineHeight:1.6,maxWidth:540,margin:"0 auto"}}>AnkerNetz verbindet Rehabilitanden noch während der Reha mit Selbsthilfegruppen an ihrem Wohnort — digital, datenschutzkonform und in bestehende Strukturen eingebettet.</p>
      <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:28}}>
        {[["Status","Konzeptphase"],["Lizenz","AGPL-3.0"],["Stack","React + Supabase + PostGIS"]].map(([k,v],i)=>(<div key={i} style={{fontSize:11,fontFamily:T.fontMono,color:T.muted}}>{k}: <span style={{color:T.blue}}>{v}</span></div>))}
      </div>
    </div>
    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
      <StatCard val="80%" label="Rückfallquote ohne Nachbehandlung (Holzbach 2010)" />
      <StatCard val="40%" label="Rückfallquote mit Nachbehandlung" />
      <StatCard val="87%" label="Ohne Rückfall unter aktiven SHG-Teilnehmern" />
      <StatCard val="37.821" label="Sucht-Reha-Leistungen/Jahr (DRV 2023)" />
    </div>
    {/* Problem */}
    <Section title="Das Problem" sub="Strukturelle Lücke zwischen Reha und Alltag">
      {[{t:"Pflichtvorstellung ≠ Wohnort",d:"KTL F12.2 verlangt SHG-Vorstellung am Klinikstandort. Rehabilitanden kehren an einen anderen Ort zurück."},
        {t:"Kein digitaler Kanal",d:"NAKOS listet ~300 Kontaktstellen. Maschinenlesbares SHG-Register existiert nicht."},
        {t:"Kritische Phase ungesichert",d:"66–90+ Tage für Gewohnheitsbildung (Lally et al.). Genau dann fehlt Begleitung."},
        {t:"Fehlanreiz",d:"Vermittlung in Beratungsstelle: ~70€ Vergütung. Vermittlung an SHG: 0€."}
      ].map((x,i)=>(<div key={i} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}><h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 6px"}}>{x.t}</h3><p style={{color:T.silver,fontSize:13,lineHeight:1.5,margin:0}}>{x.d}</p></div>))}
    </Section>
    {/* Lösung */}
    <Section title="Die Lösung" sub="Drei Komponenten — ein System">
      <div style={{display:"grid",gap:12}}>
        <CompCard letter="A" color={T.blue} name="SHG-Matching" desc="Wohnortbasierte Vermittlung per PLZ, Thema, Format. Video-Kennenlern-Sessions noch während der Reha." features="Score = 0.6×Thema + 0.3×Nähe + 0.1×Format · PostGIS" />
        <CompCard letter="B" color={T.gold} name="Anker-Modul" desc="Therapeutische Tagesstruktur für 8 Wochen: Check-ins, Bausteine (Bewegung, Sozial, Reflexion), Fortschritt." features="Kompass · Körper Heute · Spiegel · Notfall" />
        <CompCard letter="C" color={T.success} name="Therapeuten-Schnittstelle" desc="Anonymisierte Kohortenstatistiken, PATFAK-kompatibel (HL7/PDF). Datenbasierter Verlängerungsarm." features="k-Anonymität (min. 5) · Opt-in · DSGVO Art. 9" />
      </div>
    </Section>
    {/* Architektur */}
    <Section title="Technische Architektur" sub="Open Source · Privacy by Design">
      <div style={{display:"flex",alignItems:"center",gap:6,overflowX:"auto",paddingBottom:8}}>
        {[{l:"Datenquellen",s:"NAKOS · Kontaktstellen · Selbstregistrierung",c:null},{l:"Supabase",s:"PostgreSQL + PostGIS + RLS",c:T.blue},{l:"React + Vite",s:"Matching · Anker · Dashboard",c:null},{l:"Vercel",s:"ankernetz.org",c:T.gold}].map((b,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
          {i>0 && <span style={{color:T.muted,fontSize:16,flexShrink:0}}>→</span>}
          <div style={{background:T.surface,border:`1px solid ${b.c||T.borderSubtle}`,borderRadius:T.rSm,padding:"12px 14px",minWidth:120,flexShrink:0}}>
            <div style={{color:T.blue,fontSize:11,fontFamily:T.fontMono}}>{b.l}</div>
            <div style={{color:T.muted,fontSize:9,fontFamily:T.fontMono,marginTop:3}}>{b.s}</div>
          </div>
        </div>))}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:16}}>
        {["React 18","Vite 5","TypeScript","Supabase","PostGIS","Row Level Security","HL7 FHIR","AGPL-3.0"].map((t,i)=>(<span key={i} style={{padding:"5px 10px",background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.rSm,color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{t}</span>))}
      </div>
    </Section>
    {/* Datenquellen */}
    <Section title="Datenquellen" sub="Woher kommen die SHG-Daten?">
      <p style={{color:T.silver,fontSize:13,lineHeight:1.6,margin:"0 0 16px",maxWidth:600}}>NAKOS ist das zentrale Meta-Verzeichnis — listet Kontaktstellen, nicht einzelne Gruppen. AnkerNetz baut einen eigenen Registry-Layer mit Ingest-System für verschiedene Quellen.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        {[{n:"NAKOS",d:"~300 Kontaktstellen. Rote Adressen (regional), Grüne Adressen (bundesweit), Blaue Adressen (selten)."},{n:"Landeskontaktstellen",d:"Führen lokale Listen aktiver Gruppen. Primäre Datenquelle für wohnortbasiertes Matching."},{n:"Dachverbände",d:"Kreuzbund, Blaues Kreuz, Freundeskreise, Guttempler, BKE, AA, NA — registrieren ihre Gruppen direkt."}].map((s,i)=>(<div key={i} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderLeft:`3px solid ${T.muted}`,borderRadius:T.rSm,padding:"14px 16px"}}><h4 style={{color:T.silver,fontSize:12,fontFamily:T.fontMono,margin:"0 0 5px"}}>{s.n}</h4><p style={{color:T.muted,fontSize:12,margin:0,lineHeight:1.5}}>{s.d}</p></div>))}
      </div>
    </Section>
    {/* PATFAK */}
    <Section title="PATFAK-Anbindung" sub="Integration in bestehende Klinik-Systeme">
      <p style={{color:T.silver,fontSize:13,lineHeight:1.6,margin:"0 0 16px",maxWidth:600}}>PATFAK ist das Referenzsystem von buss und FVS, im Einsatz in über 250 Einrichtungen (Hersteller: Redline Data GmbH). Die Integration erfolgt stufenweise.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        {[{n:"Phase 1: Pilot",d:"PDF-Export der Teilnahmebestätigung in die PATFAK-Akte. Kein Schnittstellenaufwand.",c:T.blue},{n:"Phase 2: Integration",d:"HL7-Anbindung, SHG-Feld in Katamnese, automatische Übernahme in G2055-Entlassungsbericht.",c:T.gold},{n:"Alternativen",d:"Vivendi Consil (Connext), R23 (DEVAGENCY), Tau-Office (rocom) — alle KDS-3.0-zertifiziert.",c:T.silver}].map((s,i)=>(<div key={i} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderLeft:`3px solid ${s.c}`,borderRadius:T.rSm,padding:"14px 16px"}}><h4 style={{color:T.silver,fontSize:12,fontFamily:T.fontMono,margin:"0 0 5px"}}>{s.n}</h4><p style={{color:T.muted,fontSize:12,margin:0,lineHeight:1.5}}>{s.d}</p></div>))}
      </div>
    </Section>
    {/* Schaubilder */}
    <Section title="Systemlandschaft" sub="Akteur-Ebenen · Module · Anbindungen">
      <DiagramTabs />
    </Section>
    {/* Timeline */}
    <Section title="Zeitplan" sub="Q2 2026 — Q1 2029">
      {[{p:"April 2026",l:"Positionspapier an DRV Bund",d:"11 Abschnitte, 11 Quellen, PATFAK-Integration, Sunset-Klausel",b:"done"},
        {p:"April 2026",l:"Technische Architektur",d:"PostGIS-Schema, Matching-Algorithmus, React-Komponentenstruktur, RLS",b:"done"},
        {p:"Mai 2026",l:"NAKOS-Kooperationsanfrage",d:"Datenzugang, Kontaktstellen-Vermittlung, fachliche Einschätzung",b:"active"},
        {p:"Mai 2026",l:"DRV-Nachfass",d:"Follow-up zum Positionspapier, Ansprechpartner identifizieren",b:"active"},
        {p:"Jun–Sep 2026",l:"Prototyp (MVP)",d:"Onboarding, Matching, Seed-Daten, erste Pilot-Kontaktstellen",b:"planned"},
        {p:"Okt–Nov 2026",l:"Prototype Fund Klasse 03",d:"Bewerbung AnkerNetz/SHG, bis 47.500 EUR, Bewerber: Carsten",b:"planned"},
        {p:"Q1 2027–Q1 2029",l:"Pilot und Rollout",d:"10 Einrichtungen, 5 Bundesländer, RTS 2025 (ab 01.01.2027)",b:"planned"}
      ].map((r,i)=>(<div key={i} style={{display:"flex",gap:16,padding:"14px 0",borderBottom:`1px solid ${T.borderSubtle}`}}>
        <span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,minWidth:100,flexShrink:0,paddingTop:2}}>{r.p}</span>
        <div><div style={{fontSize:14,fontWeight:600,color:T.silver,marginBottom:3}}>{r.l} <Pill color={r.b==="done"?T.blue:r.b==="active"?T.gold:T.muted} bg={r.b==="done"?T.blueGlow:r.b==="active"?T.goldGlow:`${T.muted}20`}>{r.b==="done"?"erledigt":r.b==="active"?"aktiv":"geplant"}</Pill></div><div style={{fontSize:12,color:T.muted}}>{r.d}</div></div>
      </div>))}
    </Section>
    {/* Team */}
    <Section title="Team" sub="Strauß & Reinemann">
      <div style={{display:"grid",gap:12}}>
        <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px"}}>
          <h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 4px"}}>Gero Strauß</h3>
          <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 6px"}}>Technical Lead</p>
          <p style={{color:T.silver,fontSize:13,lineHeight:1.5,margin:0}}>React, Supabase, Vite, Vercel. International Business Management (HS Konstanz), Oxford Blockchain Programme. Wikimedia Deutschland e.V.</p>
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px"}}>
          <h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 4px"}}>Carsten Reinemann</h3>
          <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 6px"}}>Research & Outreach</p>
          <p style={{color:T.silver,fontSize:13,lineHeight:1.5,margin:0}}>Projektmanagement und Schnittstellenarbeit bei ARAG und Sheer. Wikimedia Deutschland e.V.</p>
        </div>
      </div>
      <p style={{color:T.muted,fontSize:12,marginTop:12}}>GbR in Gründung. Formale Gründung bei Förderzusage. Teil des <a href="https://deinestimme.org" style={{color:T.blue,textDecoration:"none"}}>DeineStimme.org</a>-Ökosystems.</p>
    </Section>
    {/* Dokumente */}
    <Section id="docs" title="Dokumente" sub="Positionspapier · FAQ Reha-Einrichtungen · FAQ DRV & Förderer">
      <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
        <DocTab id="paper" label="Positionspapier" active={docTab==="paper"} />
        <DocTab id="faq-reha" label="Fragen: Reha" active={docTab==="faq-reha"} />
        <DocTab id="faq-drv" label="Fragen: DRV & Förderer" active={docTab==="faq-drv"} />
      </div>
      {docTab==="paper" && <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"20px 16px",maxHeight:"70vh",overflowY:"auto"}}>
        <p style={{color:T.blue,fontSize:10,fontFamily:T.fontMono,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 4px"}}>POSITIONSPAPIER</p>
        <h3 style={{color:T.white,fontSize:16,fontWeight:600,margin:"0 0 4px"}}>Wohnortbezogene Selbsthilfegruppen-Anbindung</h3>
        <p style={{color:T.muted,fontSize:12,margin:"0 0 16px",fontStyle:"italic"}}>Digitale Vernetzung als Bestandteil der Nachsorgevorbereitung in der medizinischen Rehabilitation Abhängigkeitskranker</p>
        <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",marginBottom:20}}>
          <tbody>{[["Adressat","Deutsche Rentenversicherung Bund"],["Abteilung","Rehabilitation / Reha-Qualitätssicherung"],["Bezug","RTS Alkoholabhängigkeit (2016); geplante RTS 2025 (ab 01.01.2027)"],["Datum","April 2026"],["Verfasser","Gero Strauß, Rehabilitand und unabhängiger Entwickler"]].map(([k,v],i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${T.borderSubtle}`}}>
              <td style={{padding:"6px 8px",color:T.silver,fontWeight:600,width:"35%"}}>{k}</td>
              <td style={{padding:"6px 8px",color:T.muted}}>{v}</td></tr>))}</tbody>
        </table>

        <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>1. Zusammenfassung</h4>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,margin:"0 0 8px"}}>Die Selbsthilfegruppe ist einer der wirksamsten Einzelfaktoren für langfristige Abstinenz. Ohne therapeutische Nachbehandlung liegt die Rückfallquote bei <strong style={{color:T.silver}}>ca. 80%</strong>; mit Therapie bei <strong style={{color:T.silver}}>ca. 40%</strong>. Unter aktiven SHG-Teilnehmern blieben laut Erhebung der fünf Sucht-Selbsthilfeverbände <strong style={{color:T.silver}}>87% ohne Rückfall</strong>.</p>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,margin:"0 0 8px"}}>Dieses Papier schlägt vor, die bestehende Pflicht durch eine <strong style={{color:T.silver}}>digitale Plattform auf den Wohnort umzulenken</strong> und durch ein <strong style={{color:T.silver}}>therapeutisches Begleitmodul</strong> zu ergänzen. Sunset-Klausel: kein messbarer Effekt nach 24 Monaten → automatische Beendigung.</p>

        <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>2. Der Strukturbruch</h4>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,margin:"0 0 8px"}}>Die Rehabilitationseinrichtung liegt ortsfern vom Wohnort. Während der Reha: vier Vorstellungstermine bei lokalen SHGs am <strong style={{color:T.silver}}>Klinikstandort</strong>. Nach Entlassung: Rückkehr an den Wohnort. Kein bestehender Kontakt zu einer Gruppe dort.</p>
        <div style={{background:`${T.blue}08`,borderLeft:`3px solid ${T.blue}`,padding:"10px 14px",borderRadius:"0 6px 6px 0",margin:"12px 0"}}>
          <p style={{color:T.silver,fontSize:13,margin:0,lineHeight:1.6}}>Kernproblem: Die Pflicht wird formell erfüllt, aber verfehlt ihren Zweck. Die strukturelle Lücke zwischen Reha-Standort und Wohnort bleibt ungeschlossen — genau in der Phase, in der das Rückfallrisiko am höchsten ist.</p>
        </div>

        <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>3. Plattformkonzept — Wirkungskette</h4>
        <div style={{background:`${T.blue}08`,borderLeft:`3px solid ${T.blue}`,padding:"10px 14px",borderRadius:"0 6px 6px 0",margin:"12px 0"}}>
          {["Reha-Woche 8–10: Rehabilitand sieht Gruppen am Wohnort auf der Plattform.",
            "→ Nimmt per Video an 4 Kennenlern-Sessions teil. Lernt Gesichter und Namen kennen.",
            "→ Entscheidet sich vor Entlassung für eine Gruppe. Meldet sich verbindlich an.",
            "→ Am Wohnort: Geht direkt zur Gruppe. Kein Erstanruf nötig. Kontakt besteht bereits.",
            "→ Ergebnis: Die kritischsten Wochen nach Entlassung sind durch bestehende Anbindung abgesichert."
          ].map((line,i)=>(<p key={i} style={{color:i===4?T.blue:T.silver,fontSize:12,margin:"4px 0",fontWeight:i===4?600:400}}>{line}</p>))}
        </div>

        <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>6. Sunset-Klausel</h4>
        <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",marginBottom:12}}>
          <tbody>{[["Erprobungsphase","24 Monate, mind. 10 Piloteinrichtungen"],["Messgröße 1","12-Monats-Abstinenzrate (Katamnese, DGSS-4)"],["Messgröße 2","Dokumentierte SHG-Anbindungsquote bei Entlassung"],["Erfolgskriterium","Signifikante Verbesserung ODER Anbindungsquote +≥20pp"],["Bei Nicht-Erreichen","Automatische Beendigung"],["Bei Erreichen","Aufnahme in RTS als Regelleistung"]].map(([k,v],i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${T.borderSubtle}`}}>
              <td style={{padding:"6px 8px",color:T.silver,fontWeight:600,width:"40%"}}>{k}</td>
              <td style={{padding:"6px 8px",color:T.muted}}>{v}</td></tr>))}</tbody>
        </table>

        <h4 style={{color:T.white,fontSize:14,fontWeight:600,margin:"20px 0 8px"}}>Quellenverzeichnis</h4>
        {["¹ Holzbach, R. (2010): Rückfallquote ~80% ohne, ~40% mit Nachbehandlung.",
          "² Statistik 2017 der fünf Sucht-Selbsthilfeverbände (DHS/KONTUREN, 18.12.2018).",
          "³ Simon, Steinbrecher, Falk: DRV-Routinedaten 2023 (DHS Jahrbuch Sucht 2025, Kap. 3.2).",
          "⁴ S3-Leitlinie alkoholbezogene Störungen (AWMF 076-001, Version 3.1, Stand 2025).",
          "⁵ Gemeinsamer Leitfaden DRV/GKV zur Konzeptprüfung (2011).",
          "⁶ Rahmenkonzept Nachsorge DRV/GKV (in Kraft seit 01.03.2013).",
          "⁷ RTS Alkoholabhängigkeit (DRV Bund, Stand 01.03.2016). Überarbeitung im Gange.",
          "\u2078 DHS-Handreichung \u201EChancen nahtlos nutzen \u2013 konkret!\u201C.",
          "⁹ Lally et al. (2009): 66 Tage bis Automatisierung, Spannweite 18–254 Tage.",
          "¹⁰ REITOX-Bericht 2024: Kokainkonsum ↑, Drogentote 2023: 2.227 (Höchstwert)."
        ].map((s,i)=>(<p key={i} style={{color:T.muted,fontSize:11,lineHeight:1.5,margin:"2px 0",fontFamily:T.fontMono}}>{s}</p>))}
      </div>}
      {docTab==="faq-reha" && <div>
        <p style={{color:T.muted,fontSize:12,marginBottom:12,fontFamily:T.fontMono}}>19 Fragen in 7 Kategorien</p>
        {[{c:"Aufwand & Integration",qs:[{q:"Mehraufwand pro Rehabilitand?",a:"Video-Vorstellungen ersetzen Präsenz. Netto-Mehraufwand: 15–20 Min. einmalig für Zugangseinrichtung."},{q:"Technische Infrastruktur?",a:"WLAN, ein Endgerät mit Kamera, Browser. Keine Software-Installation."}]},
          {c:"Therapeutenbeitrag",qs:[{q:"Rolle der Therapeuten?",a:"Optional: Anker-Modul individuell konfigurieren. Standardinhalte funktionieren ohne Anpassung."},{q:"Wird therapeutische Beziehung ersetzt?",a:"Nein. Werkzeug, kein Ersatz. Strukturiert den Übergang nach Entlassung."}]},
          {c:"Datenschutz",qs:[{q:"Wie werden Patientendaten geschützt?",a:"DSGVO Art. 9, explizite Einwilligung, Pseudonymisierung, Row-Level Security, EU-Hosting."},{q:"Wer hat Zugriff?",a:"Rehabilitanden: eigene Matches. Therapeuten: nur aggregierte Kohortenstatistiken."}]},
          {c:"PATFAK",qs:[{q:"PATFAK-Anbindung?",a:"Phase 1: PDF-Export. Phase 2: HL7-Schnittstelle für G2055-Entlassungsbericht."}]},
          {c:"Pilotteilnahme",qs:[{q:"Voraussetzungen?",a:"WLAN, Ansprechpartner, Bereitschaft für 20–30 Rehabilitanden über 3 Monate."},{q:"Kosten?",a:"Keine. Open Source (AGPL-3.0), auch langfristig lizenzfrei."}]},
        ].map((cat,ci)=>(<div key={ci}><h4 style={{color:T.blue,fontSize:11,fontWeight:600,fontFamily:T.fontMono,margin:"14px 0 4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{cat.c}</h4>{cat.qs.map((q,qi)=>(<Accordion key={qi} title={q.q}><p style={{margin:0}}>{q.a}</p></Accordion>))}</div>))}
      </div>}
      {docTab==="faq-drv" && <div>
        <p style={{color:T.muted,fontSize:12,marginBottom:12,fontFamily:T.fontMono}}>27 Fragen in 9 Kategorien</p>
        {[{c:"Legitimation",qs:[{q:"Warum von einem Rehabilitanden verfasst?",a:"Weil die Lücke am deutlichsten sichtbar ist, wenn man sie durchläuft. Gestützt auf RTS, KTL, DRV-QS."},{q:"Kommerzielles Produkt?",a:"Nein. AGPL-3.0, Open Source, Civic Tech. Kein VC, keine Werbung."}]},
          {c:"Problemanalyse",qs:[{q:"Wie belastbar sind die Rückfallquoten?",a:"Holzbach 2010 (80/40%) konsistent mit Übersichtsarbeiten. 5-Verbände-Statistik (87%) als Obergrenze transparent gekennzeichnet."},{q:"Warum funktioniert bisherige SHG-Vorstellung nicht?",a:"Standortgebunden. KTL verlangt Vorstellung am Klinikort, Rehabilitand kehrt an Wohnort zurück."}]},
          {c:"Umsetzbarkeit",qs:[{q:"Technisch realistisch?",a:"React/Supabase/PostGIS — bewährter Open-Source-Stack. MVP in 6 Monaten."},{q:"SHG-Daten?",a:"Stufenweise: NAKOS-Kontaktstellen → Landeskontaktstellen → Dachverbände → Selbstregistrierung."}]},
          {c:"Finanzierung",qs:[{q:"Was kostet der Aufbau?",a:"MVP: ~100k–158k€ (9–12 Mon.). Vollausbau: ~250k–350k€ (24 Mon.)."},{q:"Kosten-Nutzen?",a:"Bei 8.000–15.000€ pro Entwöhnung genügen wenige angebundene Rehabilitanden zur Amortisierung."}]},
          {c:"Wirksamkeit",qs:[{q:"Wie wird Erfolg gemessen?",a:"KPI 1: 12-Monats-Abstinenzrate (DGSS-4). KPI 2: SHG-Anbindungsquote (Ziel ≥20pp Erhöhung). Sunset nach 24 Mon."},{q:"Was bei Nicht-Erreichen?",a:"Automatische Beendigung. Keine Rechtfertigung nötig."}]},
          {c:"Abgrenzung",qs:[{q:"Was unterscheidet AnkerNetz?",a:"Kein Wellness-Tool. Spezifisch für Reha→Alltag: Matching + Tagesstruktur + Therapeuten-Rückkanal."},{q:"Warum Open Source?",a:"Vertrauen, Transparenz. Öffentlich finanzierte Gesundheitsinfrastruktur soll kontrollierbar sein."}]},
        ].map((cat,ci)=>(<div key={ci}><h4 style={{color:T.blue,fontSize:11,fontWeight:600,fontFamily:T.fontMono,margin:"14px 0 4px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{cat.c}</h4>{cat.qs.map((q,qi)=>(<Accordion key={qi} title={q.q}><p style={{margin:0}}>{q.a}</p></Accordion>))}</div>))}
      </div>}
    </Section>
    {/* CTA */}
    <div style={{padding:"48px 0"}}>
      <div style={{background:T.surface,border:`1px solid ${T.blue}`,borderRadius:T.r,padding:32,textAlign:"center"}}>
        <h3 style={{color:T.white,fontSize:20,fontWeight:600,margin:"0 0 10px"}}>Gemeinsam bauen</h3>
        <p style={{color:T.muted,fontSize:14,margin:"0 auto 24px",maxWidth:460,lineHeight:1.6}}>AnkerNetz ist Open Source und sucht Partner: Reha-Kliniken, Kontaktstellen, Therapeuten, Entwickler.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="mailto:kontakt@ankernetz.org" style={{padding:"10px 24px",background:T.blue,color:"#fff",borderRadius:T.rSm,fontWeight:600,fontSize:13,textDecoration:"none",fontFamily:T.fontBody}}>Kontakt aufnehmen</a>
          <a href="https://deinestimme.org" style={{padding:"10px 24px",border:`1px solid ${T.muted}`,color:T.silver,borderRadius:T.rSm,fontWeight:500,fontSize:13,textDecoration:"none",fontFamily:T.fontBody}}>DeineStimme.org</a>
        </div>
      </div>
    </div>
  </div>);
};

// ═══════════════════════════════════════════════════════════
// TAB 2: DEMO (full v2 with sessions, booking, dashboard)
// ═══════════════════════════════════════════════════════════
const TabDemo = () => {
  const [view,setView]=useState("doors"); // doors|search|results|detail|anker|dashboard
  const [form,setForm]=useState({plz:"",topic:"Alkohol",fmt:"Egal",radius:"10"});
  const [selGroup,setSelGroup]=useState(null);
  const [bookings,setBookings]=useState([]);

  const addBooking = (group,session) => {
    if(bookings.find(b=>b.sid===session.sid)) return;
    setBookings([...bookings,{...session,groupName:group.name,groupId:group.id}]);
  };
  const removeBooking = (sid) => setBookings(bookings.filter(b=>b.sid!==sid));
  const isBooked = (sid) => bookings.some(b=>b.sid===sid);

  const Back = ({to,label="Zurück"}) => (<button onClick={()=>setView(to)} style={{background:"none",border:"none",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:T.fontMono,marginBottom:20,padding:0,display:"flex",alignItems:"center",gap:4}}>← {label}</button>);

  // ── DOORS ──
  if(view==="doors") return (
    <div style={{padding:"56px 0",textAlign:"center"}}>
      <h2 style={{color:T.white,fontSize:22,fontWeight:600,margin:"0 0 6px"}}>Was möchtest du erkunden?</h2>
      <p style={{color:T.muted,fontSize:13,fontFamily:T.fontMono,margin:"0 0 36px"}}>Demo-Modus — keine echten Daten</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,maxWidth:520,margin:"0 auto"}}>
        <button onClick={()=>setView("search")} style={{background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.r,padding:"28px 18px",cursor:"pointer",textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:T.blueGlow,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:20}}>🔍</div>
          <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Ich suche eine Gruppe</h3>
          <p style={{color:T.muted,fontSize:12,margin:0,lineHeight:1.4}}>SHG finden, Kennenlern-Session buchen</p>
        </button>
        <button onClick={()=>setView("anker")} style={{background:T.surface,border:`1px solid rgba(232,148,58,0.2)`,borderRadius:T.r,padding:"28px 18px",cursor:"pointer",textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:T.goldGlow,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:20}}>⚓</div>
          <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Mein Reha-Plan</h3>
          <p style={{color:T.muted,fontSize:12,margin:0,lineHeight:1.4}}>Tagesstruktur für die ersten 8 Wochen</p>
        </button>
      </div>
      {bookings.length>0 && <button onClick={()=>setView("dashboard")} style={{marginTop:24,padding:"10px 20px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.blue,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>📋 Meine Termine ({bookings.length})</button>}
    </div>
  );

  // ── SEARCH ──
  if(view==="search") {
    const Chip = ({label,field}) => (<button onClick={()=>setForm({...form,[field]:label})} style={{padding:"7px 13px",borderRadius:T.rSm,fontSize:12,cursor:"pointer",fontFamily:T.fontBody,background:form[field]===label?T.blueGlow:T.surface,border:`1px solid ${form[field]===label?T.blueActive:T.borderSubtle}`,color:form[field]===label?T.blue:T.silver}}>{label}</button>);
    return (
      <div style={{padding:"36px 0",maxWidth:420}}>
        <Back to="doors" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>Gruppe finden</h2>
        <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 28px"}}>Wir suchen passende SHGs in deiner Nähe</p>
        <div style={{display:"grid",gap:18}}>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Postleitzahl (Wohnort)</label>
            <input value={form.plz} onChange={e=>setForm({...form,plz:e.target.value})} placeholder="z.B. 12099" style={{width:"100%",padding:"11px 13px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.white,fontSize:14,fontFamily:T.fontMono,outline:"none",boxSizing:"border-box"}} /></div>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Thema</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Alkohol","Medikamente","Drogen","Glücksspiel","Essstörung"].map(t=><Chip key={t} label={t} field="topic" />)}</div></div>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Format</label><div style={{display:"flex",gap:5}}>{["Egal","Präsenz","Online","Hybrid"].map(f=><Chip key={f} label={f} field="fmt" />)}</div></div>
          <div><label style={{color:T.silver,fontSize:12,fontWeight:500,display:"block",marginBottom:5}}>Umkreis: {form.radius} km</label><input type="range" min="5" max="50" step="5" value={form.radius} onChange={e=>setForm({...form,radius:e.target.value})} style={{width:"100%",accentColor:T.blue}} /></div>
          <button onClick={()=>setView("results")} style={{padding:"13px",background:T.blue,color:T.void,border:"none",borderRadius:T.rSm,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:T.fontBody,marginTop:4}}>Gruppen suchen →</button>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if(view==="results") {
    const filtered = GROUPS.filter(g=>(form.fmt==="Egal"||g.fmt===form.fmt)&&g.topic===form.topic);
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="search" label="Suche anpassen" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>{filtered.length} Gruppen gefunden</h2>
        <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 20px"}}>PLZ {form.plz||"12099"} · {form.topic} · {form.fmt} · {form.radius} km</p>
        {filtered.map(g=>(<button key={g.id} onClick={()=>{setSelGroup(g);setView("detail");}} style={{display:"block",width:"100%",background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px 14px",cursor:"pointer",textAlign:"left",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <span style={{color:T.white,fontSize:14,fontWeight:600}}>{g.name}</span>
            <Pill color={g.score>85?T.success:T.blue} bg={g.score>85?T.successGlow:T.blueGlow}>{g.score}%</Pill>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.fmt}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.dist}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.day} {g.time}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.members} Mitglieder</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{g.sessions.length} Sessions</span></div>
        </button>))}
        {bookings.length>0 && <button onClick={()=>setView("dashboard")} style={{marginTop:16,padding:"10px 18px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.blue,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>📋 Meine Termine ({bookings.length})</button>}
      </div>
    );
  }

  // ── DETAIL + SESSIONS ──
  if(view==="detail" && selGroup) {
    const g = selGroup;
    const platformIcon = (p) => p==="Zoom"?"📹":p==="Jitsi"?"🟢":p==="Google Meet"?"🔵":p==="Hybrid"?"🔀":"📍";
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="results" label="Zurück zur Liste" />
        <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"22px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div><h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>{g.name}</h2><p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:0}}>{g.plz} · {g.dist}</p></div>
            <Pill color={T.success} bg={T.successGlow}>Match {g.score}%</Pill>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["Thema",g.topic],["Format",g.fmt],["Termin",`${g.day}, ${g.time}`],["Mitglieder",`${g.members} aktiv`],["Kontakt",g.contact],["Umkreis",g.dist]].map(([l,v],i)=>(<div key={i}><span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>{l}</span><div style={{color:T.silver,fontSize:13,marginTop:2}}>{v}</div></div>))}
          </div>
        </div>

        {/* SESSIONS */}
        <h3 style={{color:T.white,fontSize:15,fontWeight:600,margin:"0 0 12px"}}>Termine & Kennenlern-Sessions</h3>
        {g.sessions.map(s=>{
          const booked = isBooked(s.sid);
          return (<div key={s.sid} style={{background:T.surface,border:`1px solid ${booked?`${T.success}30`:T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <Pill color={s.type==="Kennenlern"?T.gold:T.blue} bg={s.type==="Kennenlern"?T.goldGlow:T.blueGlow}>{s.type}</Pill>
                <div style={{color:T.white,fontSize:14,fontWeight:500,marginTop:8}}>{new Date(s.date).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})} · {s.time}</div>
              </div>
              <span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{s.free} Plätze frei</span>
            </div>

            {/* Platform info */}
            <div style={{background:T.bg,borderRadius:T.rSm,padding:"10px 12px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:s.code||s.addr?6:0}}>
                <span style={{fontSize:16}}>{platformIcon(s.platform)}</span>
                <span style={{color:T.silver,fontSize:13,fontWeight:500}}>{s.platform}</span>
              </div>
              {s.code && <div style={{marginTop:4}}>
                <span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>MEETING-ID / LINK</span>
                <div style={{color:T.blue,fontSize:12,fontFamily:T.fontMono,marginTop:2,wordBreak:"break-all"}}>{s.code}</div>
              </div>}
              {s.pwd && <div style={{marginTop:4}}>
                <span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>PASSWORT</span>
                <div style={{color:T.silver,fontSize:12,fontFamily:T.fontMono,marginTop:2}}>{s.pwd}</div>
              </div>}
              {s.addr && <div style={{marginTop:4}}>
                <span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>ADRESSE</span>
                <div style={{color:T.silver,fontSize:12,fontFamily:T.fontMono,marginTop:2}}>{s.addr}</div>
              </div>}
            </div>

            {booked ? (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:T.success,fontSize:13,fontWeight:500}}>✓ Angemeldet</span>
                <button onClick={()=>removeBooking(s.sid)} style={{background:"none",border:`1px solid ${T.danger}30`,borderRadius:T.rSm,color:T.danger,fontSize:11,padding:"5px 10px",cursor:"pointer",fontFamily:T.fontMono}}>Absagen</button>
              </div>
            ) : (
              <button onClick={()=>addBooking(g,s)} style={{width:"100%",padding:"10px",background:T.blue,color:T.void,border:"none",borderRadius:T.rSm,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:T.fontBody}}>Verbindlich anmelden</button>
            )}
          </div>);
        })}
        {bookings.length>0 && <button onClick={()=>setView("dashboard")} style={{marginTop:12,width:"100%",padding:"12px",background:T.surface,border:`1px solid ${T.blueBorder}`,borderRadius:T.rSm,color:T.blue,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.fontBody}}>📋 Meine Termine anzeigen ({bookings.length})</button>}
      </div>
    );
  }

  // ── DASHBOARD ──
  if(view==="dashboard") {
    const sorted = [...bookings].sort((a,b)=>a.date.localeCompare(b.date));
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="doors" />
        <h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:"0 0 4px"}}>Meine Termine</h2>
        <p style={{color:T.muted,fontSize:12,fontFamily:T.fontMono,margin:"0 0 20px"}}>{bookings.length} gebuchte Sessions</p>
        {sorted.length===0 && <div style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:32,textAlign:"center"}}><p style={{color:T.muted,fontSize:13}}>Noch keine Termine gebucht. Suche eine Gruppe und melde dich an.</p><button onClick={()=>setView("search")} style={{marginTop:12,padding:"10px 20px",background:T.blue,color:T.void,border:"none",borderRadius:T.rSm,fontWeight:600,fontSize:13,cursor:"pointer"}}>Gruppe suchen</button></div>}
        {sorted.map(b=>{
          const platformIcon = b.platform==="Zoom"?"📹":b.platform==="Jitsi"?"🟢":b.platform==="Google Meet"?"🔵":b.platform==="Hybrid"?"🔀":"📍";
          return (<div key={b.sid} style={{background:T.surface,border:`1px solid ${T.borderSubtle}`,borderRadius:T.r,padding:"16px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <span style={{color:T.white,fontSize:14,fontWeight:600}}>{b.groupName}</span>
                <div style={{color:T.silver,fontSize:13,marginTop:4}}>{new Date(b.date).toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"})} · {b.time}</div>
              </div>
              <Pill color={b.type==="Kennenlern"?T.gold:T.blue} bg={b.type==="Kennenlern"?T.goldGlow:T.blueGlow}>{b.type}</Pill>
            </div>
            <div style={{background:T.bg,borderRadius:T.rSm,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span>{platformIcon}</span>
              <span style={{color:T.silver,fontSize:12,fontWeight:500}}>{b.platform}</span>
              {b.code && <span style={{color:T.blue,fontSize:11,fontFamily:T.fontMono,marginLeft:"auto",wordBreak:"break-all"}}>{b.code}</span>}
              {b.addr && <span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,marginLeft:"auto"}}>{b.addr}</span>}
            </div>
            {b.pwd && <div style={{fontSize:11,fontFamily:T.fontMono,color:T.muted,marginBottom:8}}>Passwort: <span style={{color:T.silver}}>{b.pwd}</span></div>}
            <button onClick={()=>removeBooking(b.sid)} style={{background:"none",border:`1px solid ${T.danger}30`,borderRadius:T.rSm,color:T.danger,fontSize:11,padding:"5px 10px",cursor:"pointer",fontFamily:T.fontMono}}>Termin absagen</button>
          </div>);
        })}
      </div>
    );
  }

  // ── ANKER MODULE ──
  if(view==="anker") {
    const blocks=[{i:"🏃",n:"Bewegung",t:"07:30",d:1},{i:"🧘",n:"Reflexion",t:"08:30",d:1},{i:"📞",n:"Soziales",t:"11:00",d:0},{i:"🎨",n:"Kreativ",t:"14:00",d:0},{i:"🍽️",n:"Ernährung",t:"18:00",d:0},{i:"📝",n:"Check-in",t:"21:00",d:0}];
    const Bar = ({n,c}) => (<div style={{display:"flex",gap:3,marginTop:6}}>{[1,2,3,4,5].map(x=>(<div key={x} style={{width:20,height:3,borderRadius:2,background:x<=n?c:`${T.muted}40`}} />))}</div>);
    return (
      <div style={{padding:"36px 0"}}>
        <Back to="doors" />
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:T.goldGlow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚓</div>
          <div><h2 style={{color:T.white,fontSize:18,fontWeight:600,margin:0}}>Anker-Modul</h2><p style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,margin:0}}>Tag 12 / 56 · Demo</p></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <div style={{background:T.surface,borderRadius:T.r,padding:14,border:`1px solid ${T.borderSubtle}`}}><span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>STIMMUNG</span><div style={{fontSize:24,marginTop:3}}>😊</div><Bar n={4} c={T.gold} /></div>
          <div style={{background:T.surface,borderRadius:T.r,padding:14,border:`1px solid ${T.borderSubtle}`}}><span style={{color:T.muted,fontSize:10,fontFamily:T.fontMono}}>ENERGIE</span><div style={{fontSize:24,marginTop:3}}>⚡</div><Bar n={3} c={T.blue} /></div>
        </div>
        <h3 style={{color:T.white,fontSize:14,fontWeight:600,margin:"0 0 10px"}}>Tagesstruktur</h3>
        {blocks.map((b,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.surface,borderRadius:T.rSm,border:`1px solid ${T.borderSubtle}`,marginBottom:5,opacity:b.d?0.5:1}}><span style={{fontSize:16}}>{b.i}</span><span style={{flex:1,color:T.white,fontSize:13,fontWeight:500,textDecoration:b.d?"line-through":"none"}}>{b.n}</span><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>{b.t}</span>{b.d&&<span style={{color:T.success}}>✓</span>}</div>))}
        <div style={{marginTop:20,background:T.surface,borderRadius:T.r,padding:14,border:`1px solid ${T.borderSubtle}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.muted,fontSize:11,fontFamily:T.fontMono}}>FORTSCHRITT</span><span style={{color:T.gold,fontSize:11,fontFamily:T.fontMono}}>21%</span></div>
          <div style={{height:5,background:`${T.muted}30`,borderRadius:3,marginTop:6}}><div style={{width:"21%",height:"100%",background:T.gold,borderRadius:3}} /></div>
          <p style={{color:T.muted,fontSize:11,marginTop:6,fontFamily:T.fontMono}}>12 von 56 Tagen · 2 Check-ins ausstehend</p>
        </div>
      </div>
    );
  }

  return null;
};

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function AnkerNetzApp() {
  const [authed,setAuthed]=useState(false);
  const [tab,setTab]=useState("uebersicht");
  useEffect(()=>{injectFonts();},[]);

  if(!authed) return <PasswordWall onAuth={()=>setAuthed(true)} />;

  return (
    <div style={{minHeight:"100vh",background:T.void,fontFamily:T.fontBody,color:T.silver}}>
      <nav style={{position:"sticky",top:0,zIndex:100,background:`${T.void}ee`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.borderSubtle}`,padding:"0 24px"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",height:52}}>
          <span style={{color:T.white,fontSize:14,fontWeight:600,marginRight:"auto"}}>⚓ AnkerNetz</span>
          {["uebersicht","demo"].map(id=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"7px 14px",borderRadius:T.rSm,border:"none",cursor:"pointer",background:tab===id?T.blueGlow:"transparent",color:tab===id?T.blue:T.muted,fontSize:12,fontWeight:500,fontFamily:T.fontBody}}>{id==="uebersicht"?"Übersicht":"Demo"}</button>))}
        </div>
      </nav>
      <main style={{maxWidth:720,margin:"0 auto",padding:"0 24px"}}>
        {tab==="uebersicht"?<TabUebersicht />:<TabDemo />}
      </main>
      <footer style={{borderTop:`1px solid ${T.borderSubtle}`,padding:20,textAlign:"center",marginTop:32}}>
        <p style={{color:T.muted,fontSize:11,fontFamily:T.fontMono,margin:0}}>AnkerNetz · AGPL-3.0 · Strauß & Reinemann GbR (i.Gr.) · 2026</p>
      </footer>
    </div>
  );
}
