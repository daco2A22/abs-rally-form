import React, { useMemo, useState } from "react";

const FFSA_CLASSES = [
  {
    id: "R5Rally2", label: "R5/Rally2", color: "#f0b429",
    cars: [
      "Skoda Fabia RS Rally2",
      "Toyota GR Yaris Rally2",
      "Hyundai i20 N Rally2",
      "Ford Fiesta Rally2",
      "Skoda Fabia R5 evo",
      "Citroen C3 R5",
      "Ford Fiesta R5",
      "VW Polo GTI R5",
      "Skoda Fabia R5",
      "Hyundai i20 R5",
      "Peugeot 208 T16 R5",
      "Citroen DS3 R5",
    ],
  },
  {
    id: "SuperS2000", label: "Super 2000", color: "#27ae60",
    cars: [
      "Peugeot 207 S2000 Evolution Plus",
      "Skoda Fabia S2000 Evo 2",
      "Ford Fiesta Mk VI S2000",
      "Abarth Grande Punto S2000",
    ],
  },
  {
    id: "RGT", label: "RGT", color: "#8e44ad",
    cars: [
      "Porsche 911 GT3 RS (2010) RGT",
      "Porsche 911 GT3 RS (2007) RGT",
      "Alpine A110 Rally RGT",
      "Fiat 124 Abarth Rally RGT",
      "Aston Martin Vantage RGT",
      "Lotus Exige S RGT",
    ],
  },
  { id: "Rally3", label: "Rally 3", color: "#e67e22", cars: ["Renault Clio Rally3", "Ford Fiesta Rally3 evo", "Ford Fiesta Rally3"] },
  { id: "A8", label: "A8", color: "#2980b9", cars: ["Subaru Impreza GC8 555 GrpA", "BMW M3 E36 GrpA", "BMW M3 E30 GrpA", "Mitsubishi Lancer Evo II GrpA", "Toyota Celica 2000GT(ST185) GrpA", "Volvo 240 Turbo GrpA", "Audi 200 quattro GrpA", "Ford Escort Mk V RS Cosworth GrpA", "Lancia Delta HF 4WD GrpA", "Mazda 323 BF 4WD Turbo GrpA"] },
  { id: "N4", label: "N4", color: "#7d3c98", cars: ["Mitsubishi Lancer Evo IX N4", "Subaru Impreza N14 N4", "Seat Leon Cupra R GrpN"] },
  { id: "R4", label: "R4", color: "#884ea0", cars: ["Mitsubishi Lancer Evo IX R4", "Mitsubishi Lancer Evo X R4", "Subaru Impreza N15 R4"] },
  { id: "Rally4", label: "Rally 4", color: "#f39c12", cars: ["Peugeot 208 Rally4", "Renault Clio Rally4", "Ford Fiesta Rally4"] },
  { id: "R3", label: "R3", color: "#5d6d7e", cars: ["Renault Clio III R3", "Honda Civic Type R(FN2) R3", "Renault Clio IV R3T", "Citroen DS3 R3-MAX", "Fiat Abarth 500 R3T"] },
  { id: "SuperS1600", label: "Super 1600", color: "#16a085", cars: ["Citroen C2 GT S1600"] },
  { id: "R2", label: "R2", color: "#717d7e", cars: ["Peugeot 208 R2", "Citroen C2 R2 Max", "Renault Twingo R2 Evo", "Ford Fiesta Mk VIII R2", "Opel ADAM R2", "Ford Fiesta R2"] },
  { id: "A7", label: "A7", color: "#1a5276", cars: ["Renault Clio 16S Williams GrpA", "Peugeot 306 Maxi Kit Car", "VW Golf II GTI 16V GrpA", "Citroen Xsara Kit Car", "Renault 5 GT Turbo GrpA"] },
  { id: "A6", label: "A6", color: "#5b2c8f", cars: ["Peugeot 106 Rallye S20 GrpA", "Lada Kalina RC2 GrpA"] },
  { id: "Rally5", label: "Rally 5", color: "#d4ac0d", cars: ["Renault Clio Rally5"] },
  { id: "R1", label: "R1", color: "#1d8348", cars: ["Renault Twingo R1", "Citroen DS3 R1"] },
];

const LANGUAGES = ["French", "English", "Spanish", "Italian", "German", "Portuguese", "Polish", "Other"];

export default function V2PreviewRBR() {
  const [form, setForm] = useState({
    pseudo: "",
    nom: "",
    discord: "",
    nationality: "",
    languages: [],
    experience: "",
    rsfProfile: "",
    otherLang: "",
    car: "",
    classId: "",
    reglement: false,
  });
  const [activeClass, setActiveClass] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const currentClass = useMemo(() => FFSA_CLASSES.find((c) => c.id === activeClass) || null, [activeClass]);
  const selectedCls = useMemo(() => FFSA_CLASSES.find((c) => c.id === form.classId), [form.classId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const selectClass = (cls) => {
    const isClosing = activeClass === cls.id;
    setActiveClass(isClosing ? null : cls.id);
    if (!isClosing && form.classId !== cls.id) {
      setForm((f) => ({ ...f, car: "", classId: cls.id }));
    }
    setErrors((e) => ({ ...e, car: undefined }));
  };

  const selectCar = (car) => {
    setForm((f) => ({ ...f, car, classId: activeClass }));
    setErrors((e) => ({ ...e, car: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.pseudo.trim()) e.pseudo = "Requis / Required";
    if (!form.nom.trim()) e.nom = "Requis / Required";
    if (!form.classId) e.car = "Choisissez une classe / Please select a class";
    if (!form.reglement) e.reglement = "Vous devez accepter le règlement / You must accept the regulations";
    return e;
  };

  const WEBHOOK_URL = "https://discord.com/api/webhooks/1478513912428105798/YskhrmFbw6fxGY5rAn4DOcueBP7_MJSrlsYyD3kuEu0FEMPu9R1Ojc9lpav_VdeLa3Li";

  const normalizeRSF = (url) => url.trim().toLowerCase().replace(/\/$/, "");

  const checkDuplicate = (rsf) => {
    if (!rsf) return false;
    try {
      const stored = JSON.parse(localStorage.getItem("afrl_registrations") || "[]");
      return stored.some((r) => normalizeRSF(r.rsf) === normalizeRSF(rsf));
    } catch { return false; }
  };

  const saveRegistration = (data) => {
    try {
      const stored = JSON.parse(localStorage.getItem("afrl_registrations") || "[]");
      stored.push({ rsf: data.rsfProfile, pseudo: data.pseudo, ts: Date.now() });
      localStorage.setItem("afrl_registrations", JSON.stringify(stored));
    } catch {}
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (checkDuplicate(form.rsfProfile)) {
      setErrors((prev) => ({ ...prev, rsfProfile: "Profil RSF déjà inscrit / RSF profile already registered" }));
      return;
    }
    setLoading(true);
    const cls = FFSA_CLASSES.find((c) => c.id === form.classId);
    const langs = form.languages.includes("Other") && form.otherLang
      ? [...form.languages.filter((l) => l !== "Other"), form.otherLang]
      : form.languages;
    const embed = {
      title: "🏁 Nouvelle inscription / New Registration — ABS French Rally League",
      color: 0xf0b429,
      fields: [
        { name: "👤 Pseudo", value: form.pseudo || "—", inline: true },
        { name: "📛 Nom réel / Real Name", value: form.nom || "—", inline: true },
        { name: "💬 Discord", value: form.discord || "—", inline: true },
        { name: "🌍 Nationalité / Nationality", value: form.nationality || "—", inline: true },
        { name: "🗣️ Langues / Languages", value: langs.join(", ") || "—", inline: true },
        { name: "⭐ Niveau / Level", value: form.experience || "—", inline: true },
        { name: "🏎️ Classe / Class", value: cls?.label || "—", inline: true },
        { name: "🚗 Voiture / Car", value: form.car || "—", inline: true },
        { name: "🔗 Profil RSF", value: form.rsfProfile || "—", inline: false },
      ],
      footer: { text: "ABS French Rally League — RBR RSF NGP7" },
      timestamp: new Date().toISOString(),
    };
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
      saveRegistration(form);
      setSubmitted(true);
    } catch {
      alert("Erreur réseau, réessaie / Network error, please retry");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      pseudo: "",
      nom: "",
      discord: "",
      nationality: "",
      languages: [],
      experience: "",
      rsfProfile: "",
      otherLang: "",
      car: "",
      classId: "",
      reglement: false,
    });
    setActiveClass(null);
    setErrors({});
  };

  const toggleLang = (lang) => {
    const active = form.languages.includes(lang);
    setForm((f) => ({
      ...f,
      languages: active ? f.languages.filter((l) => l !== lang) : [...f.languages, lang],
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
          <div className="w-full overflow-hidden rounded-2xl border border-[#242424] bg-[linear-gradient(180deg,#151515_0%,#101010_100%)] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="h-1.5 bg-gradient-to-r from-[#f0b429] via-[#ffd55f] to-[#f0b429]" />
            <div className="p-8 text-center md:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f0b429] bg-[rgba(240,180,41,0.10)] text-4xl text-[#f0b429] shadow-[0_0_35px_rgba(240,180,41,0.15)]">✓</div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#f0b429]">ABS French Rally League</p>
              <h2 className="mb-5 text-4xl font-black uppercase md:text-5xl">Inscription confirmée</h2>
              <div className="mx-auto mb-8 grid max-w-2xl gap-3 md:grid-cols-3">
                <InfoCard label="Pseudo" value={form.pseudo || '—'} />
                <InfoCard label="Classe" value={selectedCls?.label || '—'} accent={selectedCls?.color} />
                <InfoCard label="Voiture" value={form.car || '—'} />
              </div>
              <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">
                Merci pour ton inscription. Rejoins le Discord pour suivre les annonces, les infos championnat et les prochains départs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="https://discord.gg/c3pyhvWjKx" className="rounded-xl bg-[#5865F2] px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-1 hover:opacity-90">
                  Rejoindre le Discord
                </a>
                <button className="rounded-xl border border-[#333] px-6 py-3 text-sm text-zinc-300 transition hover:bg-white/5" onClick={() => setSubmitted(false)}>
                  Modifier l'inscription
                </button>
                <button className="rounded-xl border border-red-600/40 bg-red-600/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-600/20" onClick={resetForm}>
                  Annuler l'inscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <header className="relative overflow-hidden border-b border-[#272727] bg-[radial-gradient(circle_at_top_left,rgba(240,180,41,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(88,101,242,0.12),transparent_24%),linear-gradient(135deg,#111_0%,#151515_60%,#0d0d0d_100%)] px-6 py-10 md:px-8 md:py-12">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#f0b429] to-transparent" />
        <div className="absolute left-0 top-0 h-full w-1 bg-[#f0b429]" />
        <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#f0b429]/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[#5865F2]/10 blur-3xl" />
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 select-none text-[110px] font-black tracking-[-5px] text-[rgba(240,180,41,0.05)] xl:block">RBR</div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <img src="/abs.png" alt="ABS Rallye" className="h-44 w-44 shrink-0 object-contain drop-shadow-[0_0_35px_rgba(240,180,41,0.6)] md:h-52 md:w-52" />

              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f0b429]/30 bg-[#f0b429]/12 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[3px] text-[#f7d169] shadow-md">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#f0b429]" />
                  ABS French Rally League
                </div>
                <h1 className="text-4xl font-black leading-none md:text-6xl xl:text-7xl">
                  INSCRIPTION <span className="text-[#f0b429]">/ REGISTRATION</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm uppercase tracking-[2px] text-zinc-400 md:text-base">
                  Richard Burns Rally — RSF Plugin NGP7
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a href="https://discord.gg/c3pyhvWjKx" className="rounded-xl bg-[#5865F2] px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-200 hover:-translate-y-1 hover:opacity-90">
                    Rejoindre le Discord
                  </a>
                  <div className="rounded-xl border border-[#2f2f2f] bg-black/25 px-4 py-3 text-xs uppercase tracking-[2px] text-zinc-400">
                    Ligue RBR France
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center xl:justify-end">
              <img src="/afrl.png" alt="AFRL" className="h-36 object-contain opacity-95 md:h-44" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-7">
            <SectionCard number="01" title="Identité du pilote / Driver Identity">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Pseudo ingame *" error={errors.pseudo}>
                  <Input name="pseudo" value={form.pseudo} onChange={handleChange} placeholder="Ex: SpeedDemon77" />
                </Field>
                <Field label="Nom réel / Real name *" error={errors.nom}>
                  <Input name="nom" value={form.nom} onChange={handleChange} placeholder="Prénom Nom / First Last" />
                </Field>
                <Field label="Discord">
                  <Input name="discord" value={form.discord} onChange={handleChange} placeholder="username" />
                </Field>
                <Field label="Nationalité / Nationality">
                  <Input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Ex: Français" />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Profil RSF / RSF Profile">
                    <Input name="rsfProfile" value={form.rsfProfile} onChange={handleChange} placeholder="rallysimfans.hu/rbr/profile.php?..." />
                  </Field>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">Niveau d'expérience / Experience Level</p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'beginner', label: 'Débutant / Beginner' },
                    { id: 'intermediate', label: 'Intermédiaire / Intermediate' },
                    { id: 'confirmed', label: 'Confirmé / Confirmed' },
                    { id: 'expert', label: 'Expert / Expert' },
                  ].map((lvl) => {
                    const active = form.experience === lvl.id;
                    return (
                      <PillButton key={lvl.id} active={active} onClick={() => setForm((f) => ({ ...f, experience: lvl.id }))}>
                        {active ? '✓ ' : ''}{lvl.label}
                      </PillButton>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">Langues parlées / Languages spoken</p>
                <div className="flex flex-wrap gap-2.5">
                  {LANGUAGES.map((lang) => {
                    const active = form.languages.includes(lang);
                    return (
                      <PillButton key={lang} active={active} onClick={() => toggleLang(lang)}>
                        {active ? '✓ ' : ''}{lang}
                      </PillButton>
                    );
                  })}
                </div>
                {form.languages.includes('Other') && (
                  <div className="mt-3">
                    <Input name="otherLang" value={form.otherLang} onChange={handleChange} placeholder="Précisez / Please specify..." />
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard number="02" title="Classe & Voiture / Class & Car">
              <p className="mb-4 text-xs text-zinc-500">Clique sur une classe pour voir les voitures disponibles.</p>
              <div className="flex flex-wrap gap-2.5">
                {FFSA_CLASSES.map((cls) => {
                  const isActive = activeClass === cls.id;
                  const isSelected = form.classId === cls.id;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => selectClass(cls)}
                      className="group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-1 hover:scale-[1.02]"
                      style={{
                        borderColor: isActive ? cls.color : isSelected ? `${cls.color}88` : '#2a2a2a',
                        background: isActive ? `${cls.color}28` : isSelected ? `${cls.color}12` : '#111',
                        color: isActive || isSelected ? cls.color : '#888',
                        boxShadow: isActive ? `0 0 16px ${cls.color}55` : isSelected ? `0 0 10px ${cls.color}25` : 'none',
                      }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full transition duration-150 group-hover:scale-125" style={{ background: cls.color, opacity: isActive || isSelected ? 1 : 0.35 }} />
                      {cls.label}
                      <span className="ml-1 text-[10px] opacity-60">{cls.cars.length}</span>
                    </button>
                  );
                })}
              </div>

              {currentClass && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#252525] bg-[#0d0d0d]">
                  <div className="flex items-center justify-between border-b-2 px-4 py-3" style={{ borderColor: currentClass.color }}>
                    <span className="text-lg font-bold" style={{ color: currentClass.color }}>{currentClass.label}</span>
                    <span className="text-xs text-zinc-500">{currentClass.cars.length} cars</span>
                  </div>
                  <div className="grid gap-2 p-2 md:grid-cols-2">
                    {currentClass.cars.map((car) => {
                      const picked = form.car === car && form.classId === currentClass.id;
                      return (
                        <button
                          key={car}
                          onClick={() => selectCar(car)}
                          className="flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition duration-150 hover:-translate-y-0.5 hover:bg-white/5"
                          style={{
                            background: picked ? `${currentClass.color}20` : 'transparent',
                            borderColor: picked ? currentClass.color : 'transparent',
                            color: picked ? '#fff' : '#bbb',
                          }}
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2" style={{ borderColor: picked ? currentClass.color : '#444', background: picked ? currentClass.color : 'transparent' }}>
                            {picked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          {car}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {form.classId && (
                <div className="mt-4 rounded-2xl border bg-black/30 px-4 py-3" style={{ borderColor: selectedCls?.color, color: selectedCls?.color }}>
                  🏁 <strong>{selectedCls?.label}</strong>
                  {form.car ? <span className="ml-2 text-zinc-300">— {form.car}</span> : <span className="ml-2 text-zinc-500">— aucune voiture / no car selected</span>}
                </div>
              )}
              {errors.car && <p className="mt-2 text-sm text-[#f0b429]">{errors.car}</p>}
            </SectionCard>

            <SectionCard number="03" title="Règlement / Regulations">
              <div className="rounded-2xl border border-[#2c2c2c] bg-black/20 p-4">
                <p className="text-sm leading-7 text-zinc-300">📋 Consulte le règlement complet sur le Discord officiel avant de valider ton inscription.</p>
                <a
                  href="https://discord.com/channels/1445115678733500448/1478513174369013884"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Voir le règlement
                </a>
              </div>
              <label className="mt-4 flex items-start gap-3 rounded-2xl border border-[#2b2b2b] bg-black/15 p-4 text-zinc-300 transition hover:bg-white/[0.03]">
                <input type="checkbox" name="reglement" checked={form.reglement} onChange={handleChange} className="mt-1 accent-[#f0b429]" />
                <span>J'ai lu et j'accepte le règlement / I have read and accept the ABS French Rally League regulations</span>
              </label>
              {errors.reglement && <p className="mt-2 text-sm text-[#f0b429]">{errors.reglement}</p>}
            </SectionCard>
          </div>

          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <div className="overflow-hidden rounded-2xl border border-[#242424] bg-[linear-gradient(180deg,#151515_0%,#111_100%)] shadow-[0_12px_50px_rgba(0,0,0,0.35)]">
              <div className="border-b border-[#252525] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[3px] text-[#f0b429]">Résumé avant validation</p>
                <h3 className="mt-2 text-xl font-black uppercase">Vérification rapide</h3>
              </div>
              <div className="space-y-3 p-5">
                <SummaryRow label="Pseudo" value={form.pseudo || '—'} />
                <SummaryRow label="Nom" value={form.nom || '—'} />
                <SummaryRow label="Classe" value={selectedCls?.label || '—'} accent={selectedCls?.color} />
                <SummaryRow label="Voiture" value={form.car || '—'} />
                <SummaryRow label="Discord" value={form.discord || '—'} />
                <SummaryRow label="Nationalité" value={form.nationality || '—'} />
                <div className="rounded-xl border border-[#2b2b2b] bg-black/20 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">Statut</div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${form.reglement ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                    {form.reglement ? 'Règlement accepté' : 'En attente d’acceptation'}
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="mt-2 w-full rounded-xl bg-[#f0b429] px-6 py-4 text-lg font-black uppercase tracking-[2px] text-white shadow-lg transition duration-200 hover:-translate-y-1 hover:brightness-105 active:translate-y-0 disabled:opacity-60">
                  VALIDER / SUBMIT →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SectionCard({ number, title, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#242424] bg-[linear-gradient(180deg,#141414_0%,#101010_100%)] p-6 shadow-[0_12px_50px_rgba(0,0,0,0.25)] md:p-7">
      <h3 className="mb-5 flex items-center gap-3 text-2xl font-black uppercase tracking-wide">
        <span className="text-sm tracking-[2px] text-[#f0b429]">{number}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">{label}</label>
      {children}
      {error && <p className="text-sm text-[#f0b429]">{error}</p>}
    </div>
  );
}

function Input(props) {
  return <input {...props} className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f0b429] focus:shadow-[0_0_0_3px_rgba(240,180,41,0.12)]" />;
}

function PillButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-150 hover:-translate-y-0.5"
      style={{
        borderColor: active ? '#f0b429' : '#2a2a2a',
        background: active ? 'rgba(240,180,41,0.18)' : '#131313',
        color: active ? '#fff' : '#888',
      }}
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-[#2b2b2b] bg-black/20 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm" style={{ color: accent || '#fff' }}>{value}</div>
    </div>
  );
}

function InfoCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-[#2b2b2b] bg-black/20 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[2px] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm" style={{ color: accent || '#fff' }}>{value}</div>
    </div>
  );
}
