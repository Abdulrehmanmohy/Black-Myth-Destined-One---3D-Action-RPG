/**
 * Shadow God Index & Six Roots Relics Codex
 * 100% Pure English dark mythological bestiary with poetic verses and lore entries
 */

import React, { useState } from 'react';
import { X, BookOpen, ScrollText } from 'lucide-react';

interface CodexModalProps {
  onClose: () => void;
}

interface CodexItem {
  id: string;
  name: string;
  title: string;
  category: 'protagonist' | 'boss' | 'companion' | 'relic';
  realm: string;
  poem: string;
  lore: string;
}

const CODEX_DATA: CodexItem[] = [
  {
    id: 'destined_one',
    name: 'The Destined One',
    title: 'Fragmented Will of the Great Sage',
    category: 'protagonist',
    realm: 'Huaguo Mountain · Reincarnation Stream',
    poem: 'The golden fillet binds no slave; I cross the realms to ask of fate. Five centuries past, crushed bone remained; today my staff shall break the gate.',
    lore: 'An ape born of mountain rock carrying the fragmented soul-spark of the Great Sage Equal to Heaven. Driven by destiny and an unbroken will, you traverse the three realms to unmask the false benevolence of gods and buddhas.',
  },
  {
    id: 'jingu_bang',
    name: 'Ruyi Jingu Bang',
    title: 'Cosmic Iron Staff of Compliance',
    category: 'relic',
    realm: 'Eastern Sea Dragon Palace · Ancient Ocean Pillar',
    poem: 'Thirteen thousand and five hundred pounds, it shifts at will to shake the sky. Forged to anchor cosmic seas, it heeds one master’s battle cry.',
    lore: 'Forged from divine iron by Yu the Great to measure cosmic floodwaters, it answers only to the will of the monkey sage. Capable of growing to touch the heavens or shrinking into an embroidery needle.',
  },
  {
    id: 'guangzhi',
    name: 'Guangzhi',
    title: 'Monk of the Red Tides · Twin Flame Glaive',
    category: 'boss',
    realm: 'Black Wind Mountain · Guanyin Temple Ruins',
    poem: 'One covetous thought for golden silk turned prayer staff to blazing wheels. Seek not salvation in bleak hills; the hell you fled is what one feels.',
    lore: 'Once an esteemed disciple of the Guanyin Temple seduced by elder Jinchi’s obsession with immortality and the radiant golden cassock. Transformed into a fiery wolf monk wielding the twin-bladed Red Tides glaive.',
  },
  {
    id: 'tiger_vanguard',
    name: 'Tiger Vanguard',
    title: 'Guardian of the Blood Pool · Dual Broadswords',
    category: 'boss',
    realm: 'Yellow Wind Ridge · Temple of Crouching Tiger',
    poem: 'Atop the high altar where blood runs red, twin dao cleave mountains of the dead. One tiger roar splits stone and sky; what prey can dare to pass him by?',
    lore: 'Guarding the cavernous temple built atop a churning subterranean pool of celestial blood. Clad in iron pauldrons and wielding dual broadswords, his devastating pounces crack the desert bedrock.',
  },
  {
    id: 'yellow_wind_sage',
    name: 'Yellow Wind Sage',
    title: 'Master of Samadhi Wind · Great Desert Demon',
    category: 'boss',
    realm: 'Yellow Wind Ridge · Fright Cliff',
    poem: 'The Samadhi tempest sweeps the wastes; deities veil their faces in fear. When buddhas within are put to sword, a demon reigns supreme and clear.',
    lore: 'A ferociously cunning demon king from Mount Ling possessing the dread Samadhi Wind. When unleashed, heaven and earth darken, sun and moon lose radiance, and celestial dragons are stripped of scale.',
  },
  {
    id: 'white_clothed_noble',
    name: 'White Clothed Noble',
    title: 'Scholar of the Marsh · Serpentine Spear',
    category: 'boss',
    realm: 'Black Wind Mountain · White Mist Marsh',
    poem: 'In snow-white silk beside cold reeds, his lance strikes like a serpent’s bite. Call not the scholar’s crown refined; beneath the skin dwells dragon blight.',
    lore: 'A serpentine demon warrior who adopted the robes, manners, and poetry of mortal scholars. Despite his graceful steps and refined verses, his double-ended spear strikes with icy venom.',
  },
  {
    id: 'lingji_headless',
    name: 'Headless Musician & Lingji',
    title: 'The Ascetic of the Plucked Lute',
    category: 'companion',
    realm: 'Yellow Wind Ridge · Ravine of Drums',
    poem: 'Three strings resound as sandstorms rise; a headless monk sings grief and cheer. An honored guest of Spirit Mount, why falls his head to wander here?',
    lore: 'A mysterious headless ascetic plucking a sanxian lute amidst howling sandstorms. His mournful ballads narrate the bloody dealings between Bodhisattva Lingji and the demons of Yellow Wind Ridge.',
  },
  {
    id: 'bull_demon_king',
    name: 'Bull Demon King',
    title: 'Great Sage Who Pacifies Heaven',
    category: 'companion',
    realm: 'Flaming Mountain · Cuiyun Palace',
    poem: 'Sworn brothers turned to bitter foes; one palm leaf fan burned flesh and kin. Where stands the Great Sage of the Earth, mourning old graves where flames begin?',
    lore: 'Once the Great Sage who Pacifies Heaven and sworn brother to Sun Wukong. Bound by tragedy, the grief of losing his son Red Boy, and the betrayal of the heavenly court, he laments an era turned to ash.',
  },
];

const SIX_ROOTS = [
  {
    id: 'root_eyes',
    name: 'Craving of Eyes',
    organ: 'Eyes / Sight',
    power: '+25% Focus Point Generation',
    desc: 'The sight that once beheld the splendour of the celestial peach banquets and the blazing furnace of Lord Lao.',
  },
  {
    id: 'root_ears',
    name: 'Vanity of Ears',
    organ: 'Ears / Sound',
    power: '+40% Extended Dodge Window (Coyote Time)',
    desc: 'The hearing that discerned Sanskrit mantras disguised as blessings and the deceptive cries of fallen deities.',
  },
  {
    id: 'root_nose',
    name: 'Frustration of Nose',
    organ: 'Nose / Scent',
    power: 'Gourd heals +20% extra HP',
    desc: 'The scent of immortal peach blossoms on Mount Huaguo and the acrid brimstone beneath the Five Phases Mountain.',
  },
  {
    id: 'root_tongue',
    name: 'Gluttony of Tongue',
    organ: 'Tongue / Taste',
    power: '-25% Spell Cooldown Duration',
    desc: 'The taste of imperial celestial wine and molten copper poured down an unyielding throat.',
  },
  {
    id: 'root_body',
    name: 'Burden of Body',
    organ: 'Body / Touch',
    power: '+35% Stamina Recovery Speed',
    desc: 'The diamond flesh that withstood celestial thunderbolts, guillotine blades, and samadhi fire.',
  },
  {
    id: 'root_mind',
    name: 'Pride of Mind',
    organ: 'Mind / Thought',
    power: '+30% Heavy Staff Slam Damage',
    desc: 'The uncrushable pride that dared to proclaim: "The Great Sage Equal to Heaven".',
  },
];

export const CodexModal: React.FC<CodexModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'codex' | 'roots'>('codex');
  const [selectedItem, setSelectedItem] = useState<CodexItem>(CODEX_DATA[0]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-4 pointer-events-auto">
      <div className="w-full max-w-4xl h-[88vh] rounded-xl border border-amber-600/50 bg-myth-card p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold font-myth tracking-widest text-neutral-100">
                SHADOW GOD INDEX & THE SIX ROOTS
              </h2>
              <div className="text-[10px] text-neutral-400 font-myth tracking-wider uppercase">
                Chronicles of the Dark Pilgrimage & Fragmented Will
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Tab switch */}
            <div className="flex items-center p-1 rounded-lg border border-neutral-800 bg-black/60">
              <button
                onClick={() => setActiveTab('codex')}
                className={`px-3 py-1 rounded text-xs font-myth tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'codex'
                    ? 'bg-amber-600/80 text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Bestiary Codex
              </button>
              <button
                onClick={() => setActiveTab('roots')}
                className={`px-3 py-1 rounded text-xs font-myth tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'roots'
                    ? 'bg-amber-600/80 text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Six Roots Relics
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded border border-neutral-800 hover:border-amber-500 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Bestiary & Characters */}
        {activeTab === 'codex' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Sidebar list */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 border-r border-neutral-800/80">
              {CODEX_DATA.map((item) => {
                const isSelected = item.id === selectedItem.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/40 shadow-sm'
                        : 'border-neutral-800/60 bg-black/40 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-200 font-myth">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-500/80 truncate mt-0.5 font-myth">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                      {item.realm}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Details Panel */}
            <div className="md:col-span-2 flex flex-col justify-between overflow-y-auto p-4 rounded-lg border border-neutral-800 bg-black/60">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-myth font-bold">
                      {selectedItem.category.toUpperCase()} · {selectedItem.realm}
                    </span>
                    <h3 className="text-2xl font-black font-myth tracking-wider text-neutral-100 mt-1">
                      {selectedItem.name}
                    </h3>
                    <div className="text-xs text-amber-400/90 font-serif italic mt-0.5">
                      {selectedItem.title}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded border border-amber-600/40 bg-neutral-950 flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                {/* Classical Verse Card */}
                <div className="p-3.5 rounded bg-amber-950/20 border-l-2 border-amber-500 text-amber-200/90 font-serif text-sm leading-relaxed tracking-wide italic">
                  "{selectedItem.poem}"
                </div>

                {/* Lore Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-myth">
                    Fragmentary Annals:
                  </h4>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-serif">
                    {selectedItem.lore}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
                <span>SEAL STATUS: AWAKENED</span>
                <span>ENTRY ID: {selectedItem.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Six Roots Relics */
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="p-3 rounded-lg border border-neutral-800 bg-black/50 text-xs text-neutral-300 font-serif leading-relaxed">
              When the Great Sage fell, his spirit essence split into six primordial roots: Sight, Sound, Scent, Taste, Body, and Mind. Scattered among the dread demon kings of the Three Realms, the Destined One must recover each relic to reforge the immortal body.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SIX_ROOTS.map((root, i) => (
                <div
                  key={root.id}
                  className="p-4 rounded-lg border border-amber-800/40 bg-black/60 flex flex-col justify-between gap-3 hover:border-amber-600/60 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] text-amber-400/80 font-myth tracking-widest uppercase">
                        Relic {i + 1} · {root.organ}
                      </div>
                      <div className="text-base font-bold text-neutral-100 font-myth mt-0.5">
                        {root.name}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-mono">
                      {root.power}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-serif italic">
                    "{root.desc}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
