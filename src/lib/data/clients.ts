/**
 * BordProd — Client Data Registry
 * =========================================================================
 * Single source of truth for all client info and their associated media.
 *
 * To add a new client:
 *   1. Create a new object in the `clients` array below.
 *   2. Fill in the client profile (name, ig, badge color, sector, etc.)
 *   3. Add their portfolio videos to `portfolioVideos`.
 *   4. Optionally add BTS and feedback videos.
 *   5. That's it — the landing page will pick them up automatically.
 * 
 * PUSH PUS HIT I AM PERFECt
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClientKey = 'rein' | 'atlas' | 'fitness' | 'iron' | 'immoby' | 'evapark' | 'mondial' | 'feedback';

export interface Client {
  /** Unique slug used as clientKey */
  key: ClientKey;
  /** Display name shown on cards and modals */
  name: string;
  /** Short description of their business (shown as card title) */
  sector: string;
  /** Instagram handle without the @ (e.g. "reine_abayas") */
  igHandle?: string;
  /** Tailwind gradient classes for the badge (e.g. "from-pink-600 to-rose-400") */
  badgeBg: string;
  /** Portfolio videos produced for this client */
  portfolioVideos: PortfolioVideo[];
  /** Optional: behind-the-scenes clips for this client */
  btsVideos?: BTSVideo[];
  /** Optional: feedback / testimonial videos from this client */
  feedbackVideos?: FeedbackVideo[];
}

export interface PortfolioVideo {
  id: string;
  url: string;
  /** Overrides client.sector for this specific card (optional) */
  category?: string;
  /** Overrides client.sector as the card title (optional) */
  title?: string;
}

export interface BTSVideo {
  id: string;
  title: string;
  url: string;
  tag: string;
}

export interface FeedbackVideo {
  id: string;
  /** Name of the person giving feedback */
  personName: string;
  url: string;
}

// ─── Instagram Reels Grid ─────────────────────────────────────────────────────

export interface IGReel {
  id: string;
  url: string;
  embedUrl: string;
  title: string;
  category: string;
}

// ─── Global Config ────────────────────────────────────────────────────────────

export const BORDPROD_IG = 'https://www.instagram.com/bord_prodagency?igsh=amxueGN3aXhiYWt6';
export const HERO_VIDEO_URL = 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/Vd+Landing+Page+compresse.mp4';

// ─── BTS / Coulisses (global, not per-client) ─────────────────────────────────

export const btsVideos: BTSVideo[] = [
  {
    id: 'bts-1',
    title: '',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/les+coulisses+COMPRESSE/1+COMPRESSE.mp4',
    tag: 'Coulisses Plateaux',
  },
  {
    id: 'bts-2',
    title: '',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/les+coulisses+COMPRESSE/2+COMPRESSE.mp4',
    tag: 'Direction Technique',
  },
  {
    id: 'bts-3',
    title: '',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/les+coulisses+COMPRESSE/Iron+Gym+COMPRESSE.mp4',
    tag: 'On-Set Action',
  },
  {
    id: 'bts-4',
    title: '',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/les+coulisses+COMPRESSE/Suhail+Hadad+COMPRESSE.mp4',
    tag: 'Making Of',
  },
];

// ─── Instagram Reels Grid ─────────────────────────────────────────────────────

export const instagramReels: IGReel[] = [
  {
    id: 'DOWQAHcDMQt',
    url: 'https://www.instagram.com/p/DOWQAHcDMQt/',
    embedUrl: 'https://www.instagram.com/p/DOWQAHcDMQt/embed',
    title: 'Direction Artistique & Studio',
    category: 'Brand Pitch',
  },
  {
    id: 'DOeIeUHjDcb',
    url: 'https://www.instagram.com/p/DOeIeUHjDcb/',
    embedUrl: 'https://www.instagram.com/p/DOeIeUHjDcb/embed',
    title: 'Hook Publicitaire Performance',
    category: 'Performance Ad',
  },
  {
    id: 'DPzZIWNjJIw',
    url: 'https://www.instagram.com/p/DPzZIWNjJIw/',
    embedUrl: 'https://www.instagram.com/p/DPzZIWNjJIw/embed',
    title: 'Reel Cinéma & Sound Design',
    category: 'Cinema Reel',
  },
  {
    id: 'DO6lfHEDHEk',
    url: 'https://www.instagram.com/p/DO6lfHEDHEk/',
    embedUrl: 'https://www.instagram.com/p/DO6lfHEDHEk/embed',
    title: 'Format Viral 9:16 High-CTR',
    category: 'Viral UGC',
  },
];

// ─── Client Registry ──────────────────────────────────────────────────────────

export const clients: Client[] = [
  // ── Rein Abayas ─────────────────────────────────────────────────────────────
  {
    key: 'rein',
    name: 'Rein Abayas',
    sector: 'Marque de Vêtements',
    igHandle: 'reine_abayas',
    badgeBg: 'from-pink-600 to-rose-400',
    portfolioVideos: [
      {
        id: 'rein-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/rein+abayas+COMPRESSE/Rein+1+COMPRESSE.mp4',
        category: 'Mode & Couture',
      },
      {
        id: 'rein-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/rein+abayas+COMPRESSE/Rein+2+COMPRESSE.mp4',
        category: 'Mode & Couture',
        badgeBg: 'from-fuchsia-500 to-pink-500',
      } as any,
    ],
  },

  // ── Atlas Dental ─────────────────────────────────────────────────────────────
  {
    key: 'atlas',
    name: 'Atlas Dental',
    sector: 'Cabinet Dentaire',
    igHandle: 'atlasdental.clinic',
    badgeBg: 'from-cyan-500 to-blue-600',
    portfolioVideos: [
      {
        id: 'atlas-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/atlas+dental+COMPRESSE/01+COMPRESSE.mp4',
        category: 'Cabinet Dentaire',
      },
    ],
  },

  // ── Fitness Gols ─────────────────────────────────────────────────────────────
  {
    key: 'fitness',
    name: 'Fitness Gols',
    sector: 'Coaching & Fitness',
    igHandle: 'fitness_goals_club23',
    badgeBg: 'from-amber-500 to-orange-500',
    portfolioVideos: [
      {
        id: 'fitness-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/fitness+gols+COMPESSE/Weight+Loss+Challenge+3+COMPESSE.mp4',
        category: 'Coaching & Transformation',
      },
      {
        id: 'fitness-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/fitness+gols+COMPESSE/Xtrem+4+Challeng+Modife+COMPESSE.mp4',
        category: 'Coaching & Performance',
        badgeBg: 'from-orange-500 to-red-500',
      } as any,
    ],
  },

  // ── Iron Gym ──────────────────────────────────────────────────────────────────
  {
    key: 'iron',
    name: 'Iron Gym',
    sector: 'Club de Sport',
    igHandle: 'irongym_casablanca',
    badgeBg: 'from-red-600 to-rose-500',
    portfolioVideos: [
      {
        id: 'iron-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/iron+gym+COMPRESSE/Igon+Gym+Exercise+1+COMPRESSE.mp4',
        category: 'Musculation & Fitness',
      },
      {
        id: 'iron-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/iron+gym+COMPRESSE/Igon+Gym+Exercise+4+COMPRESSE.mp4',
        category: 'Musculation & Fitness',
        badgeBg: 'from-rose-600 to-pink-500',
      } as any,
    ],
  },

  // ── M Immoby ──────────────────────────────────────────────────────────────────
  {
    key: 'immoby',
    name: 'Immoby',
    sector: 'agence immobilière',
    igHandle: 'immoby.ma',
    badgeBg: 'from-emerald-500 to-teal-400',
    portfolioVideos: [
      {
        id: 'immoby-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/m+immoby+COMPRESSE/01+COMPRESSE.mp4',
        category: 'Immobilier de Luxe',
      },
    ],
  },

  // ── Eva Park ──────────────────────────────────────────────────────────────────
  {
    key: 'evapark',
    name: 'Eva Park',
    sector: 'project immobilière',
    igHandle: 'evapark.marrakech', // Add their IG handle here when available
    badgeBg: 'from-teal-500 to-cyan-500',
    portfolioVideos: [
      {
        id: 'evapark-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/m+immoby+COMPRESSE/Eva+Park+01+COMPRESSE.mp4',
        category: 'Résidence de Luxe',
      },
      {
        id: 'evapark-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/m+immoby+COMPRESSE/Eva+Park+02+COMPRESSE.mp4',
        category: 'Résidence de Luxe',
        badgeBg: 'from-cyan-600 to-blue-500',
      } as any,
    ],
  },

  // ── Mondial Media ────────────────────────────────────────────────────────────
  {
    key: 'mondial',
    name: 'Mondial Media',
    sector: 'école audiovisuel',
    igHandle: 'mondial_media',
    badgeBg: 'from-purple-600 to-indigo-500',
    portfolioVideos: [
      {
        id: 'mondial-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/mondial+media+COMPRESSE/01+COMPRESSE.mp4',
        category: 'école audiovisuel',
      },
      {
        id: 'mondial-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/mondial+media+COMPRESSE/02+COMPRESSE.mp4',
        category: 'école audiovisuel',
        badgeBg: 'from-indigo-600 to-violet-500',
      } as any,
    ],
  },
];

// ─── Feedback / Testimonials ─────────────────────────────────────────────────

export const feedbackVideos = [
  {
    id: 'feedback-1',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Ingénieur Fitness',
    role: 'athlete fitness influencer',
    igHandle: 'ingenieur.fitness',
    category: 'Avis Client 🌟',
    title: 'Témoignage Ingénieur Fitness',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/feedback+COMPRESSE/Ingenieur+Fitness+Feed+Back+COMPRESSE.mp4',
    badgeBg: 'from-amber-500 to-orange-500',
  },
  {
    id: 'feedback-2',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Kawtar Samih',
    role: 'Actress . Comedian',
    igHandle: 'kawtarsamihoff',
    category: 'Avis Client 🌟',
    title: 'Témoignage Kawtar Samih',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/feedback+COMPRESSE/Kawtar+Samih+Feed+Back+COMPRESSE.mp4',
    badgeBg: 'from-pink-600 to-rose-400',
  },
  {
    id: 'feedback-3',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Mustapha',
    role: 'CEO of Fitness goals group',
    igHandle: undefined,
    category: 'Avis Client 🌟',
    title: 'Témoignage Mustapha',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/feedback+COMPRESSE/Mustapha+Feed+Back+COMPRESSE.mp4',
    badgeBg: 'from-blue-600 to-indigo-500',
  },
  {
    id: 'feedback-4',
    clientKey: 'feedback' as ClientKey,
    clientName: 'souhail haddade',
    role: '',
    igHandle: 'souhail.haddade',
    category: 'Avis Client 🌟',
    title: 'Témoignage Souhaile Haddad',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/feedback+COMPRESSE/Souhaile+Haddad+Feed+Back+COMPRESSE.mp4',
    badgeBg: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'feedback-5',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Marouan',
    role: 'CEO of Light Deco',
    igHandle: 'light_deco_ma',
    category: 'Avis Client 🌟',
    title: 'Témoignage Marouan — Light Deco',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/compressed/feedback+COMPRESSE/LIGHT+DECO+MARWAN+COMPRESSE.mp4',
    badgeBg: 'from-violet-500 to-purple-600',
  },
];

// ─── Derived: flat portfolio video list for PortfolioCarousel ────────────────
// This flattens all client portfolioVideos into the shape the carousel expects.

export const clientPortfolioVideos = clients
  .filter((c) => c.key !== 'feedback')
  .flatMap((client) =>
    client.portfolioVideos.map((v) => ({
      id: v.id,
      clientKey: client.key,
      clientName: client.name,
      category: v.category ?? client.sector,
      title: v.title ?? client.sector,
      url: v.url,
      badgeBg: (v as any).badgeBg ?? client.badgeBg,
      igHandle: client.igHandle,
    }))
  );
