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
export const HERO_VIDEO_URL = 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/hero+video.mp4';

// ─── BTS / Coulisses (global, not per-client) ─────────────────────────────────

export const btsVideos: BTSVideo[] = [
  {
    id: 'bts-1',
    title: 'Backstage Tournage Studio #01',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/1.MP4',
    tag: 'Coulisses Plateaux',
  },
  {
    id: 'bts-2',
    title: 'Coulisses Production Cinema #02',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/2.mp4',
    tag: 'Direction Technique',
  },
  {
    id: 'bts-3',
    title: 'Iron Gym Shoot - Backstage Live',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/iron+gym.mp4',
    tag: 'On-Set Action',
  },
  {
    id: 'bts-4',
    title: 'Session Suhail Hadad - Directing BTS',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/suhail+hadad.mp4',
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
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/rein+abayas/rein+1.mp4',
        category: 'Mode & Couture',
      },
      {
        id: 'rein-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/rein+abayas/rein+2.mp4',
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
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/atlas+dental/AQPYdvtgPDs7Dm66xEvCUQFGuJM9RL6UQEtdOFx18DckwU86OThG_5BeUvZwc_KRVJQMp7cmf_X_D8dox0tPQtpmbVn3kKSW.mp4',
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
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/fitness+gols/Weight+Loss+Challenge+3.mp4',
        category: 'Coaching & Transformation',
      },
      {
        id: 'fitness-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/fitness+gols/XTREM+4+CHALLENG+modife+1.mp4',
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
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/iron+gym/igon+gym+Exercise+1.mp4',
        category: 'Musculation & Fitness',
      },
      {
        id: 'iron-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/iron+gym/igon+gym+Exercise+4.mp4',
        category: 'Musculation & Fitness',
        badgeBg: 'from-rose-600 to-pink-500',
      } as any,
    ],
  },

  // ── M Immoby ──────────────────────────────────────────────────────────────────
  {
    key: 'immoby',
    name: 'M Immoby',
    sector: 'Immobilier de Luxe',
    igHandle: 'immoby.ma',
    badgeBg: 'from-emerald-500 to-teal-400',
    portfolioVideos: [
      {
        id: 'immoby-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/AQOBKxV1B6WureFzOBhCOeS05uHuHwrsNSJPZ6ZO22tddEoCb9pCkI_EBl2qsRFhGaskbKLVnl0Nyp8VlYWehFlI8_G4z_yy.mp4',
        category: 'Immobilier de Luxe',
      },
    ],
  },

  // ── Eva Park ──────────────────────────────────────────────────────────────────
  {
    key: 'evapark',
    name: 'Eva Park',
    sector: 'Résidence de Luxe',
    igHandle: 'evapark.marrakech', // Add their IG handle here when available
    badgeBg: 'from-teal-500 to-cyan-500',
    portfolioVideos: [
      {
        id: 'evapark-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/reel+eva+park+01.mp4',
        category: 'Résidence de Luxe',
      },
      {
        id: 'evapark-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/reel+eva+park+02.mp4',
        category: 'Résidence de Luxe',
        badgeBg: 'from-cyan-600 to-blue-500',
      } as any,
    ],
  },

  // ── Mondial Media ────────────────────────────────────────────────────────────
  {
    key: 'mondial',
    name: 'Mondial Media',
    sector: 'Production Média',
    igHandle: 'mondial_media',
    badgeBg: 'from-purple-600 to-indigo-500',
    portfolioVideos: [
      {
        id: 'mondial-1',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/mondial+media/01.mp4',
        category: 'Agence & Production Média',
      },
      {
        id: 'mondial-2',
        url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/mondial+media/Mondial+Media+5+modife.mp4',
        category: 'Agence & Production Média',
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
    category: 'Avis Client 🌟',
    title: 'Témoignage Ingénieur Fitness',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/ingenieur+fitness+feed+back.mp4',
    badgeBg: 'from-amber-500 to-orange-500',
  },
  {
    id: 'feedback-2',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Kawtar Samih',
    category: 'Avis Client 🌟',
    title: 'Témoignage Kawtar Samih',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/kawtar+samih+feed+back.mp4',
    badgeBg: 'from-pink-600 to-rose-400',
  },
  {
    id: 'feedback-3',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Mustapha',
    category: 'Avis Client 🌟',
    title: 'Témoignage Mustapha',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/mustapha+feed+back.mp4',
    badgeBg: 'from-blue-600 to-indigo-500',
  },
  {
    id: 'feedback-4',
    clientKey: 'feedback' as ClientKey,
    clientName: 'Souhaile Haddad',
    category: 'Avis Client 🌟',
    title: 'Témoignage Souhaile Haddad',
    url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/souhaile+haddad+feed+back.mp4',
    badgeBg: 'from-emerald-500 to-teal-600',
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
