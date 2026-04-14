import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// ANKERNETZ MVP v0.2
// Password: shg2026
// Two doors: Gruppensuche / Mein Reha-Plan
// Booking system with Dashboard
// ═══════════════════════════════════════════════════════════════════════════

const MVP_PASSWORD = "shg2026";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────
const T = {
  void: "#0B0B0F",
  blue: "#5B8DEF",
  blueGlow: "rgba(91,141,239,0.12)",
  blueBright: "rgba(91,141,239,0.55)",
  blueSubtle: "rgba(91,141,239,0.06)",
  gold: "#E8943A",
  goldGlow: "rgba(232,148,58,0.12)",
  silver: "#C0C8D0",
  muted: "#5A6068",
  mutedLight: "#7A828A",
  surface: "#111219",
  surfaceRaised: "#161721",
  border: "rgba(91,141,239,0.10)",
  borderActive: "rgba(91,141,239,0.30)",
  borderSubtle: "rgba(192,200,208,0.06)",
  success: "#5BEF8D",
  successGlow: "rgba(91,239,141,0.12)",
  successBorder: "rgba(91,239,141,0.2)",
  danger: "#EF5B5B",
  white: "#EAEEF2",
  fontBody: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif",
  fontMono: "'DM Mono', 'Fira Mono', monospace",
  r: "10px",
  rSm: "6px",
  rLg: "14px",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:${T.void};margin:0;overflow-x:hidden}
  ::selection{background:${T.blueGlow};color:#fff}
  input::placeholder{color:${T.muted}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideIn{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
  @keyframes checkPop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
  .hov:hover{border-color:${T.borderActive}!important;transform:translateY(-2px)!important}
  .glow:hover{box-shadow:0 0 20px rgba(91,141,239,0.25)!important}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
`;

// ─── MOCK DATA ───────────────────────────────────────────────────────────
const TOPICS = [
  { id: "dep", label: "Depression", icon: "◐" },
  { id: "anx", label: "Angststörung", icon: "◑" },
  { id: "add", label: "Sucht / Abhängigkeit", icon: "◒" },
  { id: "bur", label: "Burnout", icon: "◓" },
  { id: "eat", label: "Essstörung", icon: "◔" },
  { id: "trm", label: "Trauma / PTBS", icon: "◐" },
  { id: "chr", label: "Chronische Schmerzen", icon: "◑" },
  { id: "slp", label: "Schlafstörungen", icon: "◒" },
];

const PLATFORMS = [
  { id: "zoom", label: "Zoom", color: "#2D8CFF" },
  { id: "jitsi", label: "Jitsi Meet", color: "#location17A" },
  { id: "gmeet", label: "Google Meet", color: "#00897B" },
  { id: "praesenz", label: "Präsenz", color: T.gold },
];

// Generate upcoming dates for sessions
function futureDate(daysFromNow, hour, min) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d;
}

function formatDate(d) {
  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`;
}

function formatTime(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const MOCK_SHGS = [
  { id: 1, name: "Lichtblick Berlin", topic: "dep", plz: "10243", city: "Berlin-Friedrichshain", format: "Präsenz", frequency: "Wöchentlich, Di 18:00", members: 12, contact: "lichtblick@example.org", lat: 52.5128, lng: 13.4318, description: "Offene Gruppe für Menschen mit Depressionen. Geleitetes Gespräch, keine Anmeldung nötig.",
    sessions: [
      { id: "s1a", date: futureDate(3, 18, 0), type: "Kennenlern-Session", platform: "zoom", inviteCode: "874 2931 4820", inviteLink: "https://zoom.us/j/87429314820", spots: 4 },
      { id: "s1b", date: futureDate(10, 18, 0), type: "Offenes Treffen", platform: "praesenz", spots: 8, address: "Boxhagener Str. 42, 10245 Berlin" },
      { id: "s1c", date: futureDate(17, 18, 0), type: "Kennenlern-Session", platform: "jitsi", inviteLink: "https://meet.jit.si/LichtblickBerlin", spots: 6 },
    ]},
  { id: 2, name: "MutMacher Kreuzberg", topic: "anx", plz: "10967", city: "Berlin-Kreuzberg", format: "Hybrid", frequency: "14-tägig, Mi 19:00", members: 8, contact: "mutmacher@example.org", lat: 52.4884, lng: 13.3882, description: "Angst- und Panikstörungen. Mischung aus Austausch und Übungen.",
    sessions: [
      { id: "s2a", date: futureDate(5, 19, 0), type: "Kennenlern-Session", platform: "zoom", inviteCode: "339 5571 2200", inviteLink: "https://zoom.us/j/33955712200", spots: 3 },
      { id: "s2b", date: futureDate(19, 19, 0), type: "Offenes Treffen", platform: "praesenz", spots: 6, address: "Gneisenaustr. 15, 10961 Berlin" },
    ]},
  { id: 3, name: "Neustart Potsdam", topic: "add", plz: "14467", city: "Potsdam", format: "Präsenz", frequency: "Wöchentlich, Do 17:30", members: 15, contact: "neustart-pdm@example.org", lat: 52.3906, lng: 13.0645, description: "Sucht-Selbsthilfe, abstinenzorientiert. Newcomer willkommen.",
    sessions: [
      { id: "s3a", date: futureDate(2, 17, 30), type: "Kennenlern-Session", platform: "gmeet", inviteLink: "https://meet.google.com/abc-defg-hij", spots: 5 },
      { id: "s3b", date: futureDate(9, 17, 30), type: "Offenes Treffen", platform: "praesenz", spots: 10, address: "Charlottenstr. 72, 14467 Potsdam" },
    ]},
  { id: 4, name: "Atempause Frankfurt", topic: "bur", plz: "60311", city: "Frankfurt am Main", format: "Präsenz", frequency: "Wöchentlich, Mo 18:30", members: 10, contact: "atempause-ffm@example.org", lat: 50.1109, lng: 8.6821, description: "Burnout und Erschöpfungsdepression. Vertraulicher Rahmen.",
    sessions: [
      { id: "s4a", date: futureDate(4, 18, 30), type: "Kennenlern-Session", platform: "zoom", inviteCode: "551 8833 0912", inviteLink: "https://zoom.us/j/55188330912", spots: 4 },
    ]},
  { id: 5, name: "Stille Stärke Kassel", topic: "dep", plz: "34117", city: "Kassel", format: "Online", frequency: "Wöchentlich, Fr 19:00", members: 20, contact: "stille-staerke@example.org", lat: 51.3127, lng: 9.4797, description: "Online-Selbsthilfe für Depression. Zoom, max. 12 Teilnehmer pro Sitzung.",
    sessions: [
      { id: "s5a", date: futureDate(6, 19, 0), type: "Kennenlern-Session", platform: "zoom", inviteCode: "220 4477 9103", inviteLink: "https://zoom.us/j/22044779103", spots: 5 },
      { id: "s5b", date: futureDate(13, 19, 0), type: "Offenes Treffen", platform: "zoom", inviteCode: "220 4477 9103", inviteLink: "https://zoom.us/j/22044779103", spots: 8 },
    ]},
  { id: 6, name: "Weg:Weiser Mitte", topic: "trm", plz: "10178", city: "Berlin-Mitte", format: "Präsenz", frequency: "14-tägig, Sa 11:00", members: 6, contact: "wegweiser@example.org", lat: 52.5244, lng: 13.4105, description: "Traumafolgestörungen. Stabilisierungsübungen und Erfahrungsaustausch.",
    sessions: [
      { id: "s6a", date: futureDate(8, 11, 0), type: "Kennenlern-Session", platform: "jitsi", inviteLink: "https://meet.jit.si/WegWeiserMitte", spots: 3 },
    ]},
  { id: 7, name: "KörperDialog Wiesbaden", topic: "chr", plz: "65183", city: "Wiesbaden", format: "Präsenz", frequency: "Monatlich, 1. Sa 10:00", members: 9, contact: "koerperdialog@example.org", lat: 50.0782, lng: 8.2398, description: "Chronische Schmerzen. Achtsamkeitsbasierter Ansatz.",
    sessions: [
      { id: "s7a", date: futureDate(12, 10, 0), type: "Offenes Treffen", platform: "praesenz", spots: 6, address: "Taunusstr. 8, 65183 Wiesbaden" },
    ]},
  { id: 8, name: "NachtRuhe Berlin", topic: "slp", plz: "10777", city: "Berlin-Schöneberg", format: "Hybrid", frequency: "14-tägig, Di 20:00", members: 7, contact: "nachtruhe@example.org", lat: 52.4970, lng: 13.3537, description: "Schlafstörungen und Insomnie. Schlafhygiene-Tipps und Austausch.",
    sessions: [
      { id: "s8a", date: futureDate(7, 20, 0), type: "Kennenlern-Session", platform: "zoom", inviteCode: "993 1122 5544", inviteLink: "https://zoom.us/j/99311225544", spots: 4 },
    ]},
  { id: 9, name: "Ankommen Cottbus", topic: "dep", plz: "03046", city: "Cottbus", format: "Präsenz", frequency: "Wöchentlich, Mi 17:00", members: 11, contact: "ankommen-cb@example.org", lat: 51.7563, lng: 14.3329, description: "Depression nach Reha. Schwerpunkt Alltagsstruktur.",
    sessions: [
      { id: "s9a", date: futureDate(4, 17, 0), type: "Kennenlern-Session", platform: "gmeet", inviteLink: "https://meet.google.com/xyz-uvwx-rst", spots: 5 },
    ]},
  { id: 10, name: "FreiRaum Darmstadt", topic: "anx", plz: "64283", city: "Darmstadt", format: "Präsenz", frequency: "Wöchentlich, Do 18:00", members: 14, contact: "freiraum-da@example.org", lat: 49.8728, lng: 8.6512, description: "Soziale Angst und Agoraphobie. Expositionsbegleitung möglich.",
    sessions: [
      { id: "s10a", date: futureDate(5, 18, 0), type: "Kennenlern-Session", platform: "jitsi", inviteLink: "https://meet.jit.si/FreiRaumDA", spots: 6 },
    ]},
  { id: 11, name: "Balance Berlin", topic: "eat", plz: "10405", city: "Berlin-Prenzlauer Berg", format: "Präsenz", frequency: "Wöchentlich, Mo 19:00", members: 8, contact: "balance-berlin@example.org", lat: 52.5345, lng: 13.4196, description: "Essstörungen aller Art. Begleitete Gruppe, Warteliste möglich.",
    sessions: [
      { id: "s11a", date: futureDate(6, 19, 0), type: "Kennenlern-Session", platform: "zoom", inviteCode: "445 6677 8899", inviteLink: "https://zoom.us/j/44566778899", spots: 3 },
    ]},
  { id: 12, name: "Brücke Brandenburg", topic: "add", plz: "14770", city: "Brandenburg a.d. Havel", format: "Präsenz", frequency: "Wöchentlich, Fr 16:00", members: 18, contact: "bruecke-brb@example.org", lat: 52.4085, lng: 12.5316, description: "Alkohol- und Medikamentenabhängigkeit. Offene Gruppe.",
    sessions: [
      { id: "s12a", date: futureDate(3, 16, 0), type: "Offenes Treffen", platform: "praesenz", spots: 12, address: "Hauptstr. 22, 14770 Brandenburg" },
    ]},
  { id: 13, name: "Phönix Gießen", topic: "bur", plz: "35390", city: "Gießen", format: "Online", frequency: "14-tägig, Mi 19:30", members: 12, contact: "phoenix-gi@example.org", lat: 50.5840, lng: 8.6784, description: "Burnout-Prävention und -Recovery. Berufstätige willkommen.",
    sessions: [
      { id: "s13a", date: futureDate(9, 19, 30), type: "Kennenlern-Session", platform: "zoom", inviteCode: "112 3344 5566", inviteLink: "https://zoom.us/j/11233445566", spots: 5 },
    ]},
  { id: 14, name: "HoffnungsAnker Spandau", topic: "trm", plz: "13597", city: "Berlin-Spandau", format: "Präsenz", frequency: "Wöchentlich, Do 18:30", members: 5, contact: "hoffnungsanker@example.org", lat: 52.5364, lng: 13.2014, description: "Komplexe PTBS. Kleine Gruppe, geschützter Rahmen.",
    sessions: [
      { id: "s14a", date: futureDate(4, 18, 30), type: "Kennenlern-Session", platform: "jitsi", inviteLink: "https://meet.jit.si/HoffnungsAnkerSpandau", spots: 2 },
    ]},
  { id: 15, name: "Gelassenheit Fulda", topic: "anx", plz: "36037", city: "Fulda", format: "Hybrid", frequency: "Wöchentlich, Di 18:00", members: 10, contact: "gelassenheit-fd@example.org", lat: 50.5528, lng: 9.6778, description: "Generalisierte Angststörung. ACT-basierte Selbsthilfe.",
    sessions: [
      { id: "s15a", date: futureDate(5, 18, 0), type: "Kennenlern-Session", platform: "gmeet", inviteLink: "https://meet.google.com/ghi-jklm-nop", spots: 4 },
    ]},
];

// ─── GEO ─────────────────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function computeScore(topic, dist, fmt) { return +(0.6 * topic + 0.3 * Math.max(0, 1 - dist / 200) + 0.1 * fmt).toFixed(2); }
async function geocodePLZ(plz) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${plz}&country=DE&format=json&limit=1`, { headers: { "User-Agent": "AnkerNetz-MVP/0.2" } });
    const d = await r.json();
    if (d.length > 0) return { lat: +d[0].lat, lng: +d[0].lon };
  } catch (e) { console.error(e); }
  return null;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────
const Btn = ({ children, onClick, disabled, secondary, small, style: sx }) => (
  <button onClick={onClick} disabled={disabled} className={secondary ? "" : "glow"} style={{
    width: "100%", padding: small ? "11px 16px" : "15px 18px", fontSize: small ? 13 : 15, fontWeight: 600,
    fontFamily: T.fontBody, border: secondary ? `1px solid ${T.border}` : "none", borderRadius: T.r,
    background: secondary ? "transparent" : disabled ? T.muted : T.blue,
    color: secondary ? T.muted : disabled ? T.silver : "#fff",
    opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", ...sx,
  }}>{children}</button>
);

const Tag = ({ children, color }) => (
  <span style={{ padding: "3px 8px", borderRadius: T.rSm, fontSize: 11, fontFamily: T.fontMono, color: color || T.muted,
    background: color ? `${color}15` : T.borderSubtle, border: `1px solid ${color ? `${color}30` : T.border}` }}>{children}</span>
);

const Overlay = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,11,15,0.88)", backdropFilter: "blur(16px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s" }}>
    <div onClick={e => e.stopPropagation()} style={{ background: T.surface, border: `1px solid ${T.borderActive}`, borderRadius: 16, padding: "24px 22px", maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto", animation: "slideIn 0.3s ease-out" }}>
      <button onClick={onClose} style={{ float: "right", background: "transparent", border: "none", color: T.muted, fontSize: 20, cursor: "pointer", padding: "2px 6px" }}>✕</button>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 10, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, color: T.silver, lineHeight: 1.4 }}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD WALL
// ═══════════════════════════════════════════════════════════════════════════
function PasswordWall({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [foc, setFoc] = useState(false);
  const submit = () => { if (pw === MVP_PASSWORD) onUnlock(); else { setErr(true); setTimeout(() => setErr(false), 1500); setPw(""); } };
  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "100px 24px", textAlign: "center", animation: "fadeUp 0.6s" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: T.blueGlow, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 24px" }}>⚓</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 8, fontFamily: T.fontBody }}>MVP Demo</h2>
      <p style={{ fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.5 }}>Geschützter Bereich. Passwort eingeben.</p>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        onKeyDown={e => e.key === "Enter" && pw && submit()} placeholder="Passwort" autoFocus
        style={{ width: "100%", padding: "14px 20px", fontSize: 16, fontFamily: T.fontMono, background: T.surface,
          border: `1.5px solid ${err ? T.danger : foc ? T.blue : T.border}`, borderRadius: T.r, color: "#fff", outline: "none",
          textAlign: "center", letterSpacing: "0.12em", transition: "all 0.2s", boxSizing: "border-box",
          ...(foc && !err ? { boxShadow: `0 0 0 3px ${T.blueGlow}` } : {}),
          ...(err ? { animation: "shake 0.4s" } : {}),
        }} />
      <div style={{ marginTop: 12 }}><Btn onClick={submit} disabled={!pw}>Entsperren</Btn></div>
      {err && <p style={{ marginTop: 12, fontSize: 12, color: T.danger, fontFamily: T.fontMono }}>Falsches Passwort</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DOOR SELECTOR — Two paths after password
// ═══════════════════════════════════════════════════════════════════════════
function DoorSelector({ onSelect }) {
  const doors = [
    { id: "search", icon: "◎", title: "Ich suche eine Gruppe", sub: "PLZ eingeben → Thema wählen → passende Gruppen finden → Kennenlern-Session buchen", color: T.blue },
    { id: "rehaplan", icon: "◉", title: "Mein Reha-Plan", sub: "Dein Therapeut hat einen Plan für dich vorbereitet — Tagesstruktur, Check-ins, Termine", color: T.gold },
  ];
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px", animation: "fadeUp 0.6s" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.white, letterSpacing: "-0.03em", marginBottom: 8 }}>Willkommen bei AnkerNetz</h2>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5 }}>Was möchtest du tun?</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {doors.map((d, i) => (
          <div key={d.id} className="hov" onClick={() => onSelect(d.id)} style={{
            padding: "28px 24px", borderRadius: T.rLg, background: T.surface, border: `1.5px solid ${T.border}`,
            cursor: "pointer", transition: "all 0.25s", display: "flex", gap: 18, alignItems: "flex-start",
            animation: `fadeUp 0.5s ease-out ${i * 0.1}s both`,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${d.color}15`, border: `1px solid ${d.color}25`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: d.color }}>{d.icon}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.white, marginBottom: 6 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{d.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION BOOKING
// ═══════════════════════════════════════════════════════════════════════════
function SessionCard({ session, shgName, onBook, booked }) {
  const plat = PLATFORMS.find(p => p.id === session.platform) || PLATFORMS[3];
  const isKennenlern = session.type === "Kennenlern-Session";
  return (
    <div style={{ padding: "16px 18px", borderRadius: T.r, background: T.surfaceRaised, border: `1px solid ${booked ? T.successBorder : T.border}`,
      transition: "all 0.2s", animation: "fadeUp 0.3s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.white, marginBottom: 3 }}>{formatDate(session.date)}</div>
          <div style={{ fontSize: 13, fontFamily: T.fontMono, color: T.blueBright }}>{formatTime(session.date)} Uhr</div>
        </div>
        <Tag color={isKennenlern ? T.blue : T.muted}>{session.type}</Tag>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <Tag color={plat.color}>{plat.label}</Tag>
        <Tag>{session.spots} Plätze frei</Tag>
      </div>

      {session.platform !== "praesenz" && session.inviteCode && (
        <div style={{ padding: "10px 14px", borderRadius: T.rSm, background: T.blueSubtle, border: `1px solid ${T.border}`, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Invite-Code</div>
          <div style={{ fontSize: 16, fontFamily: T.fontMono, color: T.white, letterSpacing: "0.08em" }}>{session.inviteCode}</div>
        </div>
      )}

      {session.platform === "praesenz" && session.address && (
        <div style={{ padding: "10px 14px", borderRadius: T.rSm, background: T.borderSubtle, border: `1px solid ${T.border}`, marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Adresse</div>
          <div style={{ fontSize: 13, color: T.silver }}>{session.address}</div>
        </div>
      )}

      {booked ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: T.r, background: T.successGlow, border: `1px solid ${T.successBorder}` }}>
          <span style={{ fontSize: 18, animation: "checkPop 0.4s ease-out" }}>✓</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>Gebucht — erscheint im Dashboard</span>
        </div>
      ) : (
        <Btn small onClick={() => onBook(session, shgName)}>Verbindlich anmelden</Btn>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHG DETAIL WITH SESSIONS
// ═══════════════════════════════════════════════════════════════════════════
function SHGDetail({ shg, coords, onClose, onBook, bookedIds }) {
  const dist = coords ? haversine(coords.lat, coords.lng, shg.lat, shg.lng).toFixed(1) : null;
  const [tab, setTab] = useState("info");
  return (
    <Overlay onClose={onClose}>
      <h3 style={{ fontSize: 21, fontWeight: 700, color: T.white, marginBottom: 16, paddingRight: 30 }}>{shg.name}</h3>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["info", "Info"], ["termine", `Termine (${(shg.sessions || []).length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "8px 16px", fontSize: 12, fontFamily: T.fontMono, border: `1px solid ${tab === id ? T.blue : T.border}`,
            borderRadius: T.rSm, background: tab === id ? T.blueGlow : "transparent", color: tab === id ? T.blue : T.muted,
            cursor: "pointer", transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      {tab === "info" && (
        <div style={{ animation: "fadeUp 0.3s" }}>
          <Field label="Beschreibung">{shg.description}</Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <Field label="Ort">{shg.city}{dist ? ` · ${dist} km` : ""}</Field>
            <Field label="Format">{shg.format}</Field>
            <Field label="Treffen">{shg.frequency}</Field>
            <Field label="Teilnehmer">~{shg.members}</Field>
          </div>
          <Field label="PLZ"><span style={{ fontFamily: T.fontMono }}>{shg.plz}</span></Field>
          <div style={{ marginTop: 8 }}>
            <Btn small onClick={() => window.open(`mailto:${shg.contact}`)}>Kontakt → {shg.contact}</Btn>
          </div>
        </div>
      )}

      {tab === "termine" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.3s" }}>
          {(shg.sessions || []).length === 0 ? (
            <p style={{ fontSize: 14, color: T.muted, textAlign: "center", padding: "24px 0" }}>Keine Termine eingetragen.</p>
          ) : (
            (shg.sessions || []).map(s => (
              <SessionCard key={s.id} session={s} shgName={shg.name} onBook={onBook} booked={bookedIds.has(s.id)} />
            ))
          )}
        </div>
      )}
    </Overlay>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING FLOW (Gruppensuche)
// ═══════════════════════════════════════════════════════════════════════════
function StepDots({ step }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: step === i ? 28 : 8, height: 8, borderRadius: 4, background: step >= i ? T.blue : T.border, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }} />)}
      </div>
      <div style={{ fontSize: 11, fontFamily: T.fontMono, color: T.muted, marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {["PLZ", "Thema", "Ergebnisse"][step]}
      </div>
    </div>
  );
}

function Gruppensuche({ bookings, setBookings, onShowDashboard }) {
  const [step, setStep] = useState(0);
  const [plz, setPlz] = useState("");
  const [coords, setCoords] = useState(null);
  const [topics, setTopics] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [foc, setFoc] = useState(false);

  const bookedIds = new Set(bookings.map(b => b.sessionId));

  const handlePLZ = async () => {
    setLoading(true);
    const geo = await geocodePLZ(plz);
    if (geo) { setCoords(geo); setStep(1); } else alert("PLZ nicht gefunden.");
    setLoading(false);
  };

  const handleSearch = () => {
    const matched = MOCK_SHGS.map(shg => {
      const tm = topics.includes(shg.topic) ? 1 : 0;
      const d = haversine(coords.lat, coords.lng, shg.lat, shg.lng);
      const fm = shg.format === "Online" ? 1 : shg.format === "Hybrid" ? 0.7 : 0.5;
      return { ...shg, _score: computeScore(tm, d, fm), _dist: d };
    }).filter(s => s._score > 0.15).sort((a, b) => b._score - a._score);
    setResults(matched);
    setStep(2);
  };

  const handleBook = (session, shgName) => {
    const booking = { sessionId: session.id, shgName, date: session.date, type: session.type, platform: session.platform,
      inviteCode: session.inviteCode, inviteLink: session.inviteLink, address: session.address, bookedAt: new Date() };
    setBookings(prev => [...prev, booking]);
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
      <StepDots step={step} />

      {step === 0 && (
        <div style={{ animation: "fadeUp 0.5s" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.white, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 8 }}>Finde deine Gruppe</h2>
          <p style={{ fontSize: 14, color: T.muted, textAlign: "center", marginBottom: 24 }}>Postleitzahl eingeben — wir zeigen dir passende SHGs in deiner Nähe.</p>
          <input type="text" inputMode="numeric" maxLength={5} placeholder="z.B. 10243" value={plz}
            onChange={e => setPlz(e.target.value.replace(/\D/g, ""))} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} autoFocus
            onKeyDown={e => e.key === "Enter" && /^\d{5}$/.test(plz) && !loading && handlePLZ()}
            style={{ width: "100%", padding: "16px 20px", fontSize: 20, fontFamily: T.fontMono, background: T.surface,
              border: `1.5px solid ${foc ? T.blue : T.border}`, borderRadius: T.r, color: "#fff", outline: "none",
              textAlign: "center", letterSpacing: "0.15em", transition: "all 0.2s", boxSizing: "border-box",
              ...(foc ? { boxShadow: `0 0 0 3px ${T.blueGlow}` } : {}),
            }} />
          <div style={{ marginTop: 12 }}><Btn onClick={handlePLZ} disabled={!/^\d{5}$/.test(plz) || loading}>{loading ? "Wird gesucht …" : "Weiter"}</Btn></div>
        </div>
      )}

      {step === 1 && (
        <div style={{ animation: "fadeUp 0.5s" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.white, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 8 }}>Wonach suchst du?</h2>
          <p style={{ fontSize: 14, color: T.muted, textAlign: "center", marginBottom: 20 }}>Ein oder mehrere Themen wählen.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TOPICS.map(t => {
              const sel = topics.includes(t.id);
              return (
                <div key={t.id} onClick={() => setTopics(p => sel ? p.filter(x => x !== t.id) : [...p, t.id])}
                  style={{ padding: "14px 16px", borderRadius: T.r, border: `1.5px solid ${sel ? T.blue : T.border}`,
                    background: sel ? T.blueGlow : T.surface, cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                    transition: "all 0.2s", ...(sel ? { boxShadow: `0 0 0 3px ${T.blueGlow}` } : {}),
                  }}>
                  <span style={{ fontSize: 18, opacity: 0.5 }}>{t.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: sel ? T.white : T.silver }}>{t.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}><Btn onClick={handleSearch} disabled={!topics.length}>{!topics.length ? "Mindestens ein Thema" : `${topics.length} gewählt — Suchen`}</Btn></div>
          <div style={{ marginTop: 8 }}><Btn secondary onClick={() => setStep(0)}>← Zurück</Btn></div>
        </div>
      )}

      {step === 2 && (
        <div style={{ animation: "fadeUp 0.5s" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.white, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 4 }}>
            {results.length} Gruppe{results.length !== 1 ? "n" : ""} gefunden
          </h2>
          <p style={{ fontSize: 14, color: T.muted, textAlign: "center", marginBottom: 16 }}>Klick für Details und Termine.</p>

          {bookings.length > 0 && (
            <div onClick={onShowDashboard} className="hov" style={{ padding: "12px 16px", borderRadius: T.r, background: T.successGlow, border: `1px solid ${T.successBorder}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, transition: "all 0.2s" }}>
              <span style={{ fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{bookings.length} Termin{bookings.length > 1 ? "e" : ""} gebucht → Dashboard öffnen</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((r, i) => {
              const dist = coords ? haversine(coords.lat, coords.lng, r.lat, r.lng).toFixed(1) : null;
              const hasBooking = (r.sessions || []).some(s => bookedIds.has(s.id));
              return (
                <div key={r.id} className="hov" onClick={() => setDetail(r)} style={{
                  padding: "18px 20px", borderRadius: 12, background: T.surface,
                  border: `1px solid ${hasBooking ? T.successBorder : T.border}`,
                  cursor: "pointer", transition: "all 0.25s", animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: T.white, lineHeight: 1.3 }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      {hasBooking && <span style={{ fontSize: 14, color: T.success }}>✓</span>}
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontFamily: T.fontMono, fontWeight: 600,
                        background: r._score >= 0.7 ? T.successGlow : r._score >= 0.4 ? T.goldGlow : T.borderSubtle,
                        color: r._score >= 0.7 ? T.success : r._score >= 0.4 ? T.gold : T.muted,
                        border: `1px solid ${r._score >= 0.7 ? T.successBorder : r._score >= 0.4 ? "rgba(232,148,58,0.2)" : T.border}`,
                      }}>{Math.round(r._score * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    {[r.city, dist && `${dist} km`, r.format, `${(r.sessions || []).length} Termine`].filter(Boolean).map((tag, j) => <Tag key={j}>{tag}</Tag>)}
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{r.description}</p>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}><Btn secondary onClick={() => setStep(1)}>← Themen ändern</Btn></div>
          <div style={{ marginTop: 8 }}><Btn secondary onClick={() => { setStep(0); setPlz(""); setCoords(null); setTopics([]); setResults([]); }}>↻ Neue Suche</Btn></div>

          {detail && <SHGDetail shg={detail} coords={coords} onClose={() => setDetail(null)} onBook={handleBook} bookedIds={bookedIds} />}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REHA-PLAN (Therapeuten-vorbereitet — Mockup)
// ═══════════════════════════════════════════════════════════════════════════
function RehaPlan({ bookings, onShowDashboard }) {
  const mockPlan = {
    therapist: "Dr. M. Weber",
    clinic: "Fachklinik Sonnenhof",
    rehaType: "Alkoholabhängigkeit",
    entlassung: "15. März 2026",
    daysSince: 30,
    modules: [
      { id: "kompass", icon: "◎", title: "Kompass", sub: "Morgen-Check-in · Suchtdruck · Stimmung", color: T.blue, active: true },
      { id: "koerper", icon: "◉", title: "Körper Heute", sub: "Regenerationszähler · Organfakt des Tages", color: T.gold, active: true },
      { id: "spiegel", icon: "◈", title: "Spiegel", sub: "Wochenrückblick · Trends · Journal", color: T.silver, active: false },
      { id: "notfall", icon: "⊕", title: "Notfall", sub: "Sofortkontakt · Krisentelefon · Atemübung", color: T.danger, active: true },
    ],
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 80px", animation: "fadeUp 0.6s" }}>
      {/* Header card */}
      <div style={{ padding: "24px", borderRadius: T.rLg, background: T.surface, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Dein Reha-Plan</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.white }}>Tag {mockPlan.daysSince}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontFamily: T.fontMono, color: T.muted }}>Erstellt von</div>
            <div style={{ fontSize: 14, color: T.silver }}>{mockPlan.therapist}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{mockPlan.clinic}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag color={T.blue}>{mockPlan.rehaType}</Tag>
          <Tag>Entlassung: {mockPlan.entlassung}</Tag>
          <Tag color={T.success}>{mockPlan.daysSince} Tage abstinent</Tag>
        </div>
      </div>

      {/* Anker-Module */}
      <div style={{ fontSize: 11, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Anker-Module</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {mockPlan.modules.map((m, i) => (
          <div key={m.id} className="hov" style={{
            padding: "18px 20px", borderRadius: T.r, background: T.surface, border: `1px solid ${T.border}`,
            display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "all 0.2s", opacity: m.active ? 1 : 0.45,
            animation: `fadeUp 0.4s ease-out ${i * 0.08}s both`,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}15`, border: `1px solid ${m.color}25`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: m.color, flexShrink: 0 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.white, marginBottom: 2 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{m.sub}</div>
            </div>
            {m.active ? <Tag color={T.success}>Aktiv</Tag> : <Tag>Kommt bald</Tag>}
          </div>
        ))}
      </div>

      {/* Booked sessions */}
      {bookings.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Gebuchte Termine</div>
          <div onClick={onShowDashboard} className="hov" style={{ padding: "16px 18px", borderRadius: T.r, background: T.successGlow, border: `1px solid ${T.successBorder}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.success }}>{bookings.length} Termin{bookings.length > 1 ? "e" : ""} → zum Dashboard</span>
          </div>
        </>
      )}

      <p style={{ fontSize: 12, color: T.muted, textAlign: "center", marginTop: 28, fontStyle: "italic" }}>
        Die Module sind als Mockup dargestellt. In der Vollversion konfiguriert dein Therapeut die Inhalte individuell.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD — Booked Appointments
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({ bookings, setBookings }) {
  const sorted = [...bookings].sort((a, b) => new Date(a.date) - new Date(b.date));
  const cancelBooking = (sessionId) => setBookings(prev => prev.filter(b => b.sessionId !== sessionId));

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 80px", animation: "fadeUp 0.5s" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: T.white, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 4 }}>Meine Termine</h2>
      <p style={{ fontSize: 14, color: T.muted, textAlign: "center", marginBottom: 24 }}>
        {sorted.length === 0 ? "Noch keine Termine gebucht." : `${sorted.length} Termin${sorted.length > 1 ? "e" : ""} gebucht`}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((b, i) => {
          const plat = PLATFORMS.find(p => p.id === b.platform) || PLATFORMS[3];
          const d = new Date(b.date);
          const isPast = d < new Date();
          return (
            <div key={b.sessionId} style={{
              padding: "20px", borderRadius: T.rLg, background: T.surface, border: `1px solid ${isPast ? T.border : T.successBorder}`,
              opacity: isPast ? 0.5 : 1, animation: `fadeUp 0.4s ease-out ${i * 0.06}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: T.white, marginBottom: 2 }}>{b.shgName}</div>
                  <div style={{ fontSize: 14, fontFamily: T.fontMono, color: T.blueBright }}>{formatDate(d)} · {formatTime(d)} Uhr</div>
                </div>
                <Tag color={plat.color}>{plat.label}</Tag>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                <Tag>{b.type}</Tag>
                {isPast && <Tag color={T.muted}>Vergangen</Tag>}
              </div>

              {b.platform !== "praesenz" && b.inviteCode && (
                <div style={{ padding: "10px 14px", borderRadius: T.rSm, background: T.blueSubtle, border: `1px solid ${T.border}`, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Invite-Code</div>
                  <div style={{ fontSize: 16, fontFamily: T.fontMono, color: T.white, letterSpacing: "0.08em" }}>{b.inviteCode}</div>
                </div>
              )}

              {b.platform !== "praesenz" && b.inviteLink && (
                <div style={{ marginBottom: 10 }}>
                  <Btn small onClick={() => window.open(b.inviteLink, "_blank")} style={{ background: plat.color }}>
                    {plat.label} öffnen →
                  </Btn>
                </div>
              )}

              {b.platform === "praesenz" && b.address && (
                <div style={{ padding: "10px 14px", borderRadius: T.rSm, background: T.borderSubtle, border: `1px solid ${T.border}`, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontFamily: T.fontMono, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Adresse</div>
                  <div style={{ fontSize: 13, color: T.silver }}>{b.address}</div>
                </div>
              )}

              {!isPast && (
                <Btn small secondary onClick={() => cancelBooking(b.sessionId)}>Termin absagen</Btn>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function AnkerNetzApp() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState("doors"); // doors | search | rehaplan | dashboard
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const navItems = [
    { id: "doors", label: "Start", always: true },
    { id: "search", label: "Gruppensuche", always: false },
    { id: "rehaplan", label: "Reha-Plan", always: false },
    { id: "dashboard", label: `Termine${bookings.length ? ` (${bookings.length})` : ""}`, always: false },
  ];

  const showNav = authed && view !== "doors";

  return (
    <div style={{ minHeight: "100vh", background: T.void, color: T.silver, fontFamily: T.fontBody, WebkitFontSmoothing: "antialiased" }}>
      {/* Header */}
      <header style={{ width: "100%", padding: "0 20px", borderBottom: `1px solid ${T.border}`, background: "rgba(14,15,22,0.85)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 24, cursor: authed ? "pointer" : "default" }}
            onClick={() => authed && setView("doors")}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${T.blue}, ${T.blue}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: T.void }}>⚓</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.white, letterSpacing: "-0.02em" }}>AnkerNetz</span>
          </div>

          {showNav && (
            <nav style={{ display: "flex", gap: 2, flex: 1, overflow: "auto" }}>
              {navItems.filter(n => !n.always || view !== "doors").filter(n => n.always || view === n.id || (n.id === "dashboard" && bookings.length > 0) || n.id === view).map(n => (
                <button key={n.id} onClick={() => setView(n.id)} style={{
                  background: "transparent", border: "none", padding: "14px 10px", fontSize: 12, fontWeight: 500,
                  fontFamily: T.fontBody, color: view === n.id ? T.white : T.muted, cursor: "pointer", transition: "color 0.2s",
                  whiteSpace: "nowrap", borderBottom: view === n.id ? `2px solid ${T.blue}` : "2px solid transparent",
                }}>{n.label}</button>
              ))}
            </nav>
          )}

          <span style={{ fontSize: 9, fontFamily: T.fontMono, color: T.muted, padding: "3px 8px", borderRadius: 4, background: T.borderSubtle, border: `1px solid ${T.border}`, marginLeft: "auto", whiteSpace: "nowrap" }}>v0.2</span>
        </div>
      </header>

      {/* Content */}
      {!authed && <PasswordWall onUnlock={() => setAuthed(true)} />}
      {authed && view === "doors" && <DoorSelector onSelect={(d) => setView(d === "search" ? "search" : "rehaplan")} />}
      {authed && view === "search" && <Gruppensuche bookings={bookings} setBookings={setBookings} onShowDashboard={() => setView("dashboard")} />}
      {authed && view === "rehaplan" && <RehaPlan bookings={bookings} onShowDashboard={() => setView("dashboard")} />}
      {authed && view === "dashboard" && <Dashboard bookings={bookings} setBookings={setBookings} />}
    </div>
  );
}
