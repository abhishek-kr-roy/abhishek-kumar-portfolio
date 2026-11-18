import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import ConnectDialog from './ConnectDialog'
import GallerySection, { FEATURED_MEDIA, HAS_EVENT_MEDIA } from './Gallery'
import FieldFootprint, { FIELD_DATA } from './FieldMap'

/* ─── Data ────────────────────────────────────────────────────────────────── */

const EMAIL = 'abhishek@fasalvimaan.com'
const MAILTO = `mailto:${EMAIL}`
const SITE_URL = 'https://fasalvimaan.com'
const SITE_LABEL = 'fasalvimaan.com'
const BASE_LOCATION = 'Delhi, India'
const WHATSAPP_URL = 'https://wa.me/919315441937'
const PHONE_LABEL = '+91 93154 41937'
const LINKEDIN_URL = 'https://www.linkedin.com/in/abhishek-kumar-br851215/'

const NAV_LINKS = [
  { label: 'Story', href: 'about' },
  { label: 'Problem', href: 'problem' },
  { label: 'Platform', href: 'platform' },
  { label: 'Field', href: 'field' },
  { label: 'Build', href: 'technology' },
  { label: 'Showcases', href: 'showcases' },
  { label: 'Journey', href: 'milestones' },
  { label: 'Media', href: 'media' },
  { label: 'Contact', href: 'contact' },
]

const NAV_IDS = NAV_LINKS.map(link => link.href)

const PROBLEMS = [
  {
    label: 'No connection to buyers',
    desc: 'I kept seeing a gap between farmers with produce and buyers outside their immediate local network. The two sides could have demand and supply without an easy way to discover each other.',
    icon: 'link',
    color: '#2E6B32',
    tint: 'rgba(46, 107, 50, 0.09)',
  },
  {
    label: 'Weight cuts',
    desc: 'I observed deductions during produce transactions — described locally through charges such as labour, handling or collection. The amount varied by crop and situation.',
    icon: 'scale',
    color: '#7A4B2A',
    tint: 'rgba(122, 75, 42, 0.09)',
  },
  {
    label: 'No price awareness',
    desc: 'Current mandi prices were not always easy to access when farmers were deciding where to sell, making comparison and negotiation harder.',
    icon: 'chart',
    color: '#C8830E',
    tint: 'rgba(245, 166, 35, 0.12)',
  },
  {
    label: 'Limited awareness & support',
    desc: 'I kept hearing about schemes, subsidies and farming methods that many farmers around me were not familiar with. Awareness and on-ground access did not always match what existed on paper.',
    icon: 'book',
    color: '#4F8748',
    tint: 'rgba(111, 167, 69, 0.11)',
  },
  {
    label: 'Small landholdings',
    desc: 'Small holdings can mean small individual volumes. That made me think seriously about aggregation when trying to connect farmers with larger demand.',
    icon: 'land',
    color: '#8C6E1F',
    tint: 'rgba(200, 168, 75, 0.13)',
  },
  {
    label: 'Payment uncertainty',
    desc: 'In conversations, I heard about payments being delayed for months — in some cases much longer. These are field observations, not a claim about every farmer or market.',
    icon: 'clock',
    color: '#2E6B32',
    tint: 'rgba(46, 107, 50, 0.09)',
  },
] as const

const MODULES = [
  {
    num: '01',
    name: 'Fasal Bazaar',
    tagline: 'The marketplace',
    desc: 'Farmers list crops. Buyers discover supply by crop, location and quantity. Buyers can post demand; eligible farmers get notified and show interest. The core digital connection layer.',
    color: '#2E6B32',
    tint: 'rgba(46, 107, 50, 0.09)',
    features: [
      'Crop listings from farmers',
      'Buyer demand posted openly',
      'Location, quantity and availability discovery',
      'Farmer groups for larger supply',
    ],
    previewTitle: 'Supply near you',
    previewRows: [
      { label: 'Paddy · 40 quintal', value: 'Listed' },
      { label: 'Buyer demand · Patna', value: 'Open' },
      { label: 'Farmers grouped', value: '12' },
    ],
    previewCta: 'List your crop',
  },
  {
    num: '02',
    name: 'Mandi Bhav',
    tagline: 'Market price intelligence',
    desc: 'APMC mandi prices surfaced directly to farmers so they can make informed selling decisions — not just accept whatever the local channel offers.',
    color: '#6FA745',
    tint: 'rgba(111, 167, 69, 0.11)',
    features: [
      'APMC mandi price updates',
      'Crop-wise price comparison',
      'Better-informed selling decisions',
      'Less dependence on guesswork',
    ],
    previewTitle: 'Today’s mandi prices',
    previewRows: [
      { label: 'Paddy', value: '₹2,180 / qtl' },
      { label: 'Wheat', value: '₹2,450 / qtl' },
      { label: 'Maize', value: '₹2,050 / qtl' },
    ],
    previewCta: 'Compare prices',
  },
  {
    num: '03',
    name: 'Kisan Paathshala',
    tagline: 'Agricultural learning',
    desc: 'Video and text content on farming techniques, intercropping, hydroponics, polyhouse farming and multi-layer farming — in languages farmers actually understand.',
    color: '#F5A623',
    tint: 'rgba(245, 166, 35, 0.12)',
    features: [
      'Video-first learning',
      'Regional-language content',
      'Modern and alternative methods',
      'Practical, field-level explanations',
    ],
    previewTitle: 'Learn new methods',
    previewRows: [
      { label: 'Polyhouse farming', value: 'Video' },
      { label: 'Intercropping', value: 'Video' },
      { label: 'Multi-layer farming', value: 'Guide' },
    ],
    previewCta: 'Start learning',
  },
  {
    num: '04',
    name: 'Kisan Yojana',
    tagline: 'Government schemes',
    desc: 'Information about agricultural subsidies and government schemes — because having a scheme exist is not the same as farmers knowing how to access it.',
    color: '#7A4B2A',
    tint: 'rgba(122, 75, 42, 0.09)',
    features: [
      'Subsidy and scheme information',
      'Eligibility explained simply',
      'Guidance on the application path',
      'Awareness that reaches the ground',
    ],
    previewTitle: 'Schemes for you',
    previewRows: [
      { label: 'Subsidy schemes', value: '12 listed' },
      { label: 'Eligibility check', value: 'Open' },
      { label: 'Application guide', value: 'Read' },
    ],
    previewCta: 'View schemes',
  },
]

const PRINCIPLES = [
  {
    title: 'Android-first',
    desc: 'Designed for the phones farmers already carry — simple screens, few steps.',
  },
  {
    title: 'Location-based discovery',
    desc: 'Buyers find supply near them. Farmers see demand that is actually reachable.',
  },
  {
    title: 'Open buyer demand',
    desc: 'Buyers post what they need; eligible farmers get notified and respond.',
  },
  {
    title: 'Regional languages',
    desc: 'Prices, schemes and learning in the language farmers actually speak.',
  },
]

const SHOWCASES = [
  {
    mark: 'YUKTI',
    name: 'YUKTI Innovation Challenge',
    meta: '2025 · Regional Meet',
    status: 'Selected for the Regional Meet',
    color: '#6FA745',
    summary: (
      <>
        Fasal VIMAAN was selected through the <strong>YUKTI Innovation Challenge</strong>. I cleared the first stage
        and was selected for the <mark className="mark">Regional Meet</mark> — the subsequent round of the challenge.
      </>
    ),
    points: [
      'Cleared the first stage of the challenge',
      'Selected for the Regional Meet round',
      'Presented and evaluated within an innovation ecosystem',
      'Awaiting further announcements on the next selection',
    ],
    stats: [
      { value: 'Stage 2', label: 'Regional Meet' },
      { value: '2025', label: 'Year' },
    ],
  },
  {
    mark: 'DSYF',
    name: 'Delhi Startup Yuva Festival 2026',
    meta: '14 January 2026 · New Delhi',
    status: 'Top 100 → Top 60 · Dedicated stall',
    color: '#F5A623',
    summary: (
      <>
        Under the <strong>Campus to Market</strong> initiative, Fasal VIMAAN was first selected in the{' '}
        <strong>top 100 startups</strong> — each of the 100 received <mark className="mark">₹1 lakh in support</mark>.
        We were then shortlisted into the <strong>top 60</strong>, who got a{' '}
        <mark className="mark">dedicated stall</mark> at the festival to showcase their product.
      </>
    ),
    points: [
      'Selected in the top 100 under Campus to Market — ₹1 lakh support',
      'Shortlisted into the top 60 for the festival showcase',
      'Dedicated stall provided by the organisers — prototype shown live',
      'Showcased to Delhi CM Rekha Gupta and the Delhi Education Minister',
      'Visitors from farming families said they would use it',
    ],
    stats: [
      { value: 'Top 100', label: '₹1 lakh support each' },
      { value: 'Top 60', label: 'Dedicated showcase stall' },
    ],
  },
]

const SHOWCASE_PATH = ['IIC · JIMS Vasant Kunj', 'YUKTI Regional Meet', 'Top 100 · ₹1 lakh support', 'Top 60 · DSYF stall']

const BUILD_STATUS = [
  { label: 'Prototype', status: 'Complete', color: '#6FA745' },
  { label: 'Farmer app', status: 'In development', color: '#C8A84B' },
  { label: 'Buyer discovery', status: 'In development', color: '#C8A84B' },
  { label: 'Field pilots', status: 'Next', color: '#8A9E82' },
]

const MILESTONES = [
  {
    date: '2020',
    title: 'The question',
    tag: 'Origin',
    desc: 'My interest in building useful things had been there for years. The farm eventually gave that instinct a real problem to work on: growing the crop was one thing; finding a fair, practical way to sell it was another.',
  },
  {
    date: '2021–2024',
    title: 'From a big idea to a focused problem',
    tag: 'Discovery',
    desc: 'For the first couple of years, I kept thinking about execution — weighing, quality, transport, logistics, payments and buyer coordination. I was trying to solve the whole chain at once. It sounded ambitious, but it was not a realistic model to build. The longer I worked through it, the clearer the root problem became: the missing connection between supply and demand.',
  },
  {
    date: '2024–2026',
    title: 'Field research — 1,000+ conversations',
    tag: 'Research',
    desc: 'Visited districts across Bihar and travelled to Uttar Pradesh, Himachal Pradesh and Odisha. I spoke with farmers, traders and buyers to understand how crops are sold, what information is available, and where the friction actually appears in day-to-day transactions.',
  },
  {
    date: '2025–2026',
    title: 'Startup Coordinator — IIC, JIMS Vasant Kunj',
    tag: 'College',
    desc: 'While building Fasal VIMAAN, I worked as Startup Coordinator at the Institution’s Innovation Council (IIC), JIMS Vasant Kunj. It gave me exposure to pitching, mentors, validation, events and the process of taking an early idea beyond my own laptop.',
  },
  {
    date: '2025',
    title: 'YUKTI Innovation Challenge — Regional Meet',
    tag: 'Milestone',
    desc: 'Fasal VIMAAN was selected through the YUKTI Innovation Challenge. I cleared the first stage and was selected for the Regional Meet, where the project was presented and evaluated outside the college environment.',
  },
  {
    date: '14 Jan 2026',
    title: 'Campus to Market — Top 100, then Top 60 at DSYF',
    tag: 'Public',
    desc: 'Selected in the top 100 startups under the Campus to Market initiative — all 100 received ₹1 lakh in support. Fasal VIMAAN was then shortlisted into the top 60, who were given dedicated stalls at the Delhi Startup Yuva Festival. I showcased the prototype live and introduced it to Delhi CM Rekha Gupta and the Delhi Education Minister.',
  },
]

/* ─── Hooks ───────────────────────────────────────────────────────────────── */

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-42% 0px -52% 0px' }
    )
    ids.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

function useCountUp(target: number, trigger: boolean, duration = 1700) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [trigger, target, duration])
  return count
}

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return { ref, seen }
}

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

/* ─── Icons ───────────────────────────────────────────────────────────────── */

type IconProps = { className?: string }

function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  )
}

function PinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function SproutIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.2 2.6-5.6 6-5.6 0 3.2-2.6 5.6-6 5.6z" />
      <path d="M12 16c-3 0-5.4-2.1-5.4-5 3 0 5.4 2.1 5.4 5z" />
      <path d="M7.5 21h9" />
    </svg>
  )
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l2.4 6.1L21 11l-6.6 1.9L12 19l-2.4-6.1L3 11l6.6-1.9L12 3z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.3 3a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6ZM3.5 9H7v12H3.5V9Zm6 0H13v1.6c.5-.9 1.6-1.9 3.4-1.9 3.7 0 4.1 2.4 4.1 5.4V21H17v-6.1c0-1.5 0-3.1-1.9-3.1s-2.1 1.5-2.1 3V21H9.5V9Z" />
    </svg>
  )
}

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function ProblemIcon({ kind }: { kind: string }) {
  const common = { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'link':
      return <svg {...common}><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" /></svg>
    case 'scale':
      return <svg {...common}><path d="M12 4v16M7 20h10M5 8h14" /><path d="M5 8l-3 6h6L5 8zM19 8l-3 6h6l-3-6z" /></svg>
    case 'chart':
      return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="M7 15l3-4 3 2 4-6" /></svg>
    case 'book':
      return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" /></svg>
    case 'land':
      return <svg {...common}><path d="M3 19h18M5 19V9l7-4 7 4v10" /><path d="M9 19v-5h6v5" /></svg>
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
  }
}

function ExternalIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}

function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.5 3.9 5.5 3.9 9s-1.3 6.5-3.9 9c-2.6-2.5-3.9-5.5-3.9-9S9.4 5.5 12 3z" />
    </svg>
  )
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.15 1.59 5.96L0 24l6.28-1.65a11.95 11.95 0 0 0 5.77 1.47h.01c6.59 0 11.94-5.35 11.94-11.94a11.86 11.86 0 0 0-3.48-8.4ZM12.06 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.38a9.85 9.85 0 0 1-1.52-5.23C2.17 6.47 6.59 2.05 12.06 2.05a9.83 9.83 0 0 1 7.02 2.9 9.81 9.81 0 0 1 2.9 7.02c0 5.44-4.44 9.83-9.92 9.83Zm5.44-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48-.88-.78-1.47-1.74-1.65-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.59-.9-2.18-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.1 4.49.71.3 1.27.48 1.7.62.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.57-.35Z" />
    </svg>
  )
}

function SiteLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a className={className} href={SITE_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

/* ─── Shared UI ───────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: ReactNode
  lead: ReactNode
}) {
  return (
    <div className="section-head reveal" data-reveal>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-lead">{lead}</p>
    </div>
  )
}

/* ─── Navigation ──────────────────────────────────────────────────────────── */

function Nav({ active, onConnect }: { active: string; onConnect: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      setScrolled(window.scrollY > 24)
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
      <div className="shell nav-inner">
        <button type="button" className="brand" onClick={() => scrollToId('hero')} aria-label="Abhishek Kumar — back to top">
          <img className="brand-mark" src="/assets/profile.jpg" alt="Abhishek Kumar" width={52} height={52} />
          <span>
            <span className="brand-name">Abhishek Kumar</span>
            <span className="brand-role">Fasal VIMAAN</span>
          </span>
        </button>

        <div className={`nav-links ${paused ? 'is-paused' : ''}`}>
          <div
            className="nav-window"
            onPointerDown={event => { if (event.pointerType === 'touch') setPaused(true) }}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.scrollLeft = 0 }}
          >
            <div className="nav-track">
              {[false, true].map(duplicate => (
                <div className="nav-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
                  {NAV_LINKS.map(link => (
                    <button
                      type="button"
                      key={link.href}
                      className={`nav-link ${active === link.href ? 'active' : ''}`}
                      aria-current={!duplicate && active === link.href ? 'location' : undefined}
                      tabIndex={duplicate ? -1 : undefined}
                      onClick={() => scrollToId(link.href)}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="nav-motion-toggle"
            aria-label={paused ? 'Resume moving navigation' : 'Pause moving navigation'}
            aria-pressed={paused}
            onClick={() => setPaused(value => !value)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {paused ? <path d="M7 4l14 8-14 8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
            </svg>
          </button>
        </div>

        <button type="button" className="btn btn-primary btn-sm nav-cta" onClick={onConnect}>
          Connect <ArrowRight className="arrow" />
        </button>
      </div>
      <div className="nav-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
    </nav>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */

function HeroHighlights() {
  const [paused, setPaused] = useState(false)
  const highlights = [
    { text: 'Campus to Market · Top 100 · ₹1 lakh support', icon: <CheckIcon />, gold: true },
    { text: 'YUKTI Regional Meet', icon: <StarIcon />, gold: false },
    { text: 'DSYF 2026 · Top 60 · Dedicated stall', icon: <PinIcon size={13} />, gold: false },
  ]

  return (
    <div className={`hero-highlights rise rise-3 ${paused ? 'is-paused' : ''}`} role="group" aria-label="Startup highlights">
      <div className="highlight-window">
        <div className="highlight-track">
          {[false, true].map(duplicate => (
            <div className="highlight-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {highlights.map(highlight => (
                <button
                  type="button"
                  className={`chip ${highlight.gold ? 'chip--gold' : ''}`}
                  key={highlight.text}
                  tabIndex={duplicate ? -1 : undefined}
                  onClick={() => scrollToId('showcases')}
                >
                  {highlight.icon} {highlight.text}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="highlight-toggle"
        aria-label={paused ? 'Resume scrolling highlights' : 'Pause scrolling highlights'}
        aria-pressed={paused}
        onClick={() => setPaused(value => !value)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M7 4l14 8-14 8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
        </svg>
      </button>
    </div>
  )
}

function Hero({ onConnect }: { onConnect: () => void }) {
  return (
    <header id="hero" className="hero" style={{ '--hero-photo': `url("${FEATURED_MEDIA.field}")` } as CSSProperties}>
      <div className="shell">
        <div className="hero-grid">
          <div className="hero-heading">
            <h1 className="hero-name rise rise-2">
              Abhishek <em>Kumar</em>
            </h1>
            <HeroHighlights />
            <p className="hero-role rise rise-3">
              Building a fairer way for farmers and buyers to <mark className="mark">find each other.</mark>
            </p>
          </div>

          <div className="hero-bio rise rise-4">
            <p className="hero-copy">
              I’m a <strong>BCA graduate from JIMS Vasant Kunj, New Delhi</strong>, and the founder of{' '}
              <SiteLink className="text-link">Fasal VIMAAN</SiteLink> — a digital platform built around one simple
              question: <mark className="mark">how can farmers and genuine buyers find each other more easily?</mark>
            </p>
            <p className="hero-copy">
              Currently <strong>operating from Delhi</strong>, with field research across Bihar, Uttar Pradesh,
              Himachal Pradesh and Odisha. Fasal VIMAAN reached the <strong>YUKTI Regional Meet</strong>, was selected
              in the <strong>top 100 of Campus to Market</strong> with{' '}
              <strong className="accent-text">₹1 lakh in support</strong>, and made the{' '}
              <strong>top 60</strong> with a dedicated stall at the <strong>Delhi Startup Yuva Festival 2026</strong>.
            </p>
          </div>

          <div className="hero-portrait rise rise-3">
            <figure className="portrait-frame">
              <img
                className="portrait-img"
                src="/assets/profile.jpg"
                alt="Portrait of Abhishek Kumar, founder of Fasal VIMAAN"
                loading="eager"
                fetchPriority="high"
                width={268}
                height={338}
              />
              <figcaption className="portrait-caption"><strong>Abhishek Kumar</strong><span>Founder, Fasal VIMAAN</span></figcaption>
            </figure>
            <div className="hero-actions">
              <SiteLink className="btn btn-primary">
                Visit {SITE_LABEL} <ExternalIcon className="arrow" />
              </SiteLink>
              <button type="button" className="btn btn-outline" onClick={onConnect}>
                <MailIcon /> Let’s connect
              </button>
            </div>
            <div className="hero-socials">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} /> WhatsApp</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"><LinkedInIcon size={17} /> LinkedIn</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'clamp(2rem, 4vw, 2.75rem)' }}>
          <StatsBand />
        </div>
      </div>
    </header>
  )
}

function CMVisitFeature() {
  return (
    <section className="cm-visit-section" aria-labelledby="cm-visit-title">
      <div className="shell">
        <article className="cm-visit-feature reveal" data-reveal>
          <figure className="cm-visit-photo">
            <img src={FEATURED_MEDIA.cmVisit} alt="Presenting Fasal VIMAAN to Delhi Chief Minister Rekha Gupta at our DSYF stall" loading="lazy" decoding="async" width={1600} height={1200} />
            <figcaption>Delhi Startup Yuva Festival · New Delhi · 2026</figcaption>
          </figure>
          <div className="cm-visit-copy">
            <p className="eyebrow">A moment from DSYF</p>
            <h2 id="cm-visit-title">Delhi CM Rekha Gupta <em>at our stall.</em></h2>
            <p>I had the opportunity to present Fasal VIMAAN to Delhi Chief Minister Rekha Gupta when she visited our stall at DSYF 2026. She appreciated our work.</p>
            <p>After the field visits and early prototypes, it meant a lot to share the idea in person.</p>
            <a href="#showcases" className="text-link">More from DSYF & YUKTI <ArrowRight /></a>
          </div>
        </article>
      </div>
    </section>
  )
}

function StatsBand() {
  const { ref, seen } = useInView<HTMLDivElement>()
  const conversations = useCountUp(1000, seen, 2000)
  const states = useCountUp(4, seen, 1100)
  const districts = useCountUp(11, seen, 1400)
  const years = useCountUp(3, seen, 900)

  const stats = [
    { value: conversations, suffix: '+', label: 'Farmer conversations' },
    { value: states, suffix: '', label: 'States visited' },
    { value: districts, suffix: '', label: 'Districts visited' },
    { value: years, suffix: '+', label: 'Years of iteration' },
  ]

  return (
    <div className="stat-band" ref={ref}>
      {stats.map(stat => (
        <div className="stat-item" key={stat.label}>
          <div className="stat-value">
            {stat.value.toLocaleString('en-IN')}
            {stat.suffix}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Story ───────────────────────────────────────────────────────────────── */

const STORY = [
  {
    num: '01',
    kicker: 'Before the startup',
    title: 'A builder’s instinct, long before agriculture.',
    body: (
      <p>
        Long before I knew what an agritech startup looked like, I was already interested in building things around
        everyday problems. In <strong>Classes 11 and 12</strong>, I imagined a platform that could connect people in
        cities with groceries and everyday essentials. I had no money, no network, and I was too young to understand
        how hard execution would be. But the instinct was already there:{' '}
        <mark className="mark">see a problem, imagine a system, and ask what it would take to make it real.</mark>
      </p>
    ),
  },
  {
    num: '02',
    kicker: 'School days · Classes 11–12',
    title: 'The first idea was about connection.',
    body: (
      <p>
        At <strong>Sumermal Jain Public School, New Delhi</strong>, I was a commerce student who kept thinking about
        what could be built. The first idea was not about agriculture. It was about connecting sellers and buyers in
        crowded cities — the same underlying curiosity, just pointed at a different problem.
      </p>
    ),
  },
  {
    num: '03',
    kicker: 'The first version',
    title: 'Too much, too soon.',
    body: (
      <p>
        When I started thinking seriously about agriculture, I made the same mistake at a much bigger scale. For the
        first couple of years, I was continuously thinking about <strong>execution</strong> and trying to handle
        everything myself — weighing, quality checks, transport, logistics, payments, buyer coordination and more. On
        paper it looked complete. In reality, it was an ambitious daydream: too many moving parts, too much
        responsibility, and no clear reason why one small startup should own the entire chain.
      </p>
    ),
  },
  {
    num: '04',
    kicker: 'The turning point',
    title: 'The smallest problem technology could genuinely solve.',
    body: (
      <p>
        It took years of thinking, testing the idea, talking to people and questioning every assumption before I
        narrowed it down. I stopped asking, “How do I run the entire agricultural supply chain?” and started asking,{' '}
        <mark className="mark">“What is the smallest problem here that technology can genuinely solve?”</mark> That
        brought me to the connection itself — helping farmers make their available crop discoverable to buyers, and
        helping buyers discover relevant supply.
      </p>
    ),
  },
]

function StorySection() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="about-grid">
          <aside className="about-aside reveal" data-reveal>
            <Eyebrow>The story · before Fasal VIMAAN</Eyebrow>
            <h2 className="section-title">
              It started<br />
              with a <em>farm.</em>
            </h2>
            <div className="quote-card">
              <p>“If farmers can grow the crop, why is selling it still so difficult?”</p>
              <span>The question that started it all</span>
            </div>
            <figure className="about-photo">
              <img src={FEATURED_MEDIA.conversation} alt="Abhishek listening to two farmers beside a village road" loading="lazy" decoding="async" width={1600} height={1200} />
              <figcaption>Listening before building · farmer conversations</figcaption>
            </figure>
          </aside>

          <div className="story-list">
            {STORY.map((block, index) => (
              <div className={`story-block reveal reveal-delay-${(index % 3) + 1}`} data-reveal key={block.num}>
                <span className="story-num">{block.num}</span>
                <div>
                  <div className="story-kicker">{block.kicker}</div>
                  <h3>{block.title}</h3>
                  {block.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Problem ─────────────────────────────────────────────────────────────── */

function ProblemSection() {
  return (
    <section id="problem" className="section section--tint">
      <div className="shell">
        <SectionHead
          eyebrow="The problems · what I kept seeing"
          title={<>These were the problems that kept <em>coming back.</em></>}
          lead={
            <>
              The more I listened, the more the pattern became visible. Different places, different people — but many
              of the same frictions around selling, information, volume and access.
            </>
          }
        />

        <div className="problem-grid">
          {PROBLEMS.map((problem, index) => (
            <article
              key={problem.label}
              className={`problem-card reveal reveal-delay-${(index % 3) + 1}`}
              data-reveal
              style={{ '--card-accent': problem.color, '--icon-bg': problem.tint } as CSSProperties}
            >
              <div className="problem-card-head">
                <span className="problem-icon"><ProblemIcon kind={problem.icon} /></span>
                <span className="problem-num">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{problem.label}</h3>
              <p>{problem.desc}</p>
            </article>
          ))}
        </div>

        <div className="split-band reveal" data-reveal>
          <figure className="split-band-media">
            <img src="/assets/farm-02.jpg" alt="A field meeting with farmers seated together in Bihar" loading="lazy" />
            <figcaption>Listening before building · field conversation</figcaption>
          </figure>
          <div className="split-copy">
            <Eyebrow>Not a report. A starting point.</Eyebrow>
            <h3>“No connection. Weight cuts. No price awareness. Limited support. Small landholdings.”</h3>
            <p>These observations shaped the questions I carried into later field visits and product decisions.</p>
            <div className="scope-chips">
              {['Weighing', 'Quality checks', 'Transport', 'Logistics', 'Payments', 'Buyer coordination'].map(item => (
                <span className="scope-chip" key={item}>{item}</span>
              ))}
              <span className="scope-chip scope-chip--active">The connection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Platform ────────────────────────────────────────────────────────────── */

function PlatformSection() {
  const [active, setActive] = useState(0)
  const activeModule = MODULES[active]
  const moduleVars = {
    '--module-color': activeModule.color,
    '--module-tint': activeModule.tint,
  } as CSSProperties

  return (
    <section id="platform" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="The platform · four modules"
          title={<>Fasal VIMAAN — what we <em>built.</em></>}
          lead={
            <>
              A digital agricultural marketplace connecting farmers with buyers — plus the tools and information they
              need to make better decisions.
            </>
          }
        />

        <div className="module-tabs" role="group" aria-label="Platform modules">
          {MODULES.map((item, index) => (
            <button
              type="button"
              key={item.num}
              className={`module-tab ${active === index ? 'active' : ''}`}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              <span className="tab-num">{item.num}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="module-panel" key={active} style={moduleVars}>
          <div className="module-copy">
            <span className="module-index">Module {activeModule.num}</span>
            <h3>{activeModule.name}</h3>
            <div className="module-tagline">{activeModule.tagline}</div>
            <p>{activeModule.desc}</p>
            <ul className="module-features">
              {activeModule.features.map(feature => (
                <li key={feature}>
                  <span className="feature-dot" aria-hidden="true"><CheckIcon size={11} /></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="module-visual">
            <div className="phone-preview" aria-label={`Concept preview of ${activeModule.name}`}>
              <div className="phone-top">
                <span>Fasal VIMAAN</span>
                <span className="phone-dot" aria-hidden="true" />
              </div>
              <div className="phone-title">{activeModule.previewTitle}</div>
              {activeModule.previewRows.map(row => (
                <div className="phone-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
              <div className="phone-cta">{activeModule.previewCta}</div>
              <div className="phone-foot">Concept preview · module {activeModule.num}</div>
            </div>
          </div>
        </div>

        <div className="site-cta reveal" data-reveal>
          <span className="site-cta-icon" aria-hidden="true"><GlobeIcon size={20} /></span>
          <div className="site-cta-copy">
            <strong>See Fasal VIMAAN on the web</strong>
            <span>Product updates, modules and how to get involved — all at {SITE_LABEL}.</span>
          </div>
          <SiteLink className="btn btn-primary">
            Visit {SITE_LABEL} <ExternalIcon className="arrow" />
          </SiteLink>
        </div>
      </div>
    </section>
  )
}

/* ─── Field ───────────────────────────────────────────────────────────────── */

function FieldSection() {
  return (
    <section id="field" className="section section--tint">
      <div className="shell">
        <SectionHead
          eyebrow="Field visits · learning on the ground"
          title={<>You understand a problem differently when you stand <em>where it happens.</em></>}
          lead={
            <>
              I wanted the startup to be shaped by actual conversations rather than assumptions from a laptop. So I
              travelled, sat with farmers, listened to how crops are sold, and tried to understand what changes from
              one place to another.
            </>
          }
        />

        <div className="field-story">
          <div className="field-copy reveal" data-reveal>
            <p>
              The field visits did not give me one universal answer. They gave me something more useful:{' '}
              <mark className="mark">a clearer view of the repeated problems</mark>, the differences between markets,
              and the questions the product still needs to answer.
            </p>
            <p>
              Between 2024 and 2026, I personally visited{' '}
              <strong>Khagaria, Begusarai, Bhagalpur and Darbhanga in Bihar</strong>, and travelled to{' '}
              <strong>Kanpur and Bijnor</strong> in Uttar Pradesh, <strong>Mandi and Kangra</strong> in Himachal
              Pradesh, and <strong>Bhubaneswar, Khordha and Puri</strong> in Odisha — speaking with farmers, traders
              and buyers along the way. <strong className="accent-text">1,000+ conversations</strong> later, the
              pattern was clear.
            </p>
            <div className="field-note">
              <SproutIcon size={17} />
              <p>A problem worth building for has to be understood where it is lived.</p>
            </div>
          </div>

          <div className="field-collage reveal reveal-delay-2" data-reveal>
            <figure className="field-photo field-photo--main">
              <img src={FEATURED_MEDIA.field} alt="Abhishek with two farmers after a village conversation" loading="lazy" decoding="async" width={1600} height={1200} />
              <figcaption>The people behind the problem</figcaption>
            </figure>
            <figure className="field-photo field-photo--sub">
              <img src="/assets/farm-04.jpg" alt="Farmers reviewing documents during a field discussion" loading="lazy" />
              <figcaption>From observation to conversation</figcaption>
            </figure>
          </div>
        </div>

        <div className="subhead">
          <div>
            <Eyebrow>Where I went</Eyebrow>
            <h3>States, districts, conversations.</h3>
          </div>
          <span className="subhead-meta">2024–2026 · 1,000+ conversations</span>
        </div>

        <FieldFootprint />
      </div>
    </section>
  )
}

/* ─── Technology ──────────────────────────────────────────────────────────── */

function TechnologySection() {
  return (
    <section id="technology" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="Technology · the tool, not the purpose"
          title={<>I built a team. We built the <em>prototype.</em></>}
          lead={
            <>
              Technology itself isn’t the problem being solved. It’s the mechanism. The actual problem is: how do you
              create a useful connection between people who produce agricultural commodities and people who need them?
            </>
          }
        />

        <div className="tech-grid">
          <div className="tech-copy reveal" data-reveal>
            <p>
              I didn’t build this alone. <mark className="mark">I built a team.</mark> Together, we designed,
              developed and built the prototype — something people could actually open, navigate and use. It was
              showcased publicly at the <strong>Delhi Startup Yuva Festival 2026</strong>.
            </p>
            <p>
              <span className="highlight">Fasal VIMAAN is moving from prototype toward the full platform.</span>
            </p>

            <p className="principles-title">What the product is built around</p>
            <div className="principle-grid">
              {PRINCIPLES.map((item, index) => (
                <div className="principle-card" key={item.title}>
                  <span className="principle-num">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="build-card reveal reveal-delay-2" data-reveal>
            <p className="build-eyebrow">Current stage</p>
            <h3>Prototype built.<br />Platform in progress.</h3>
            <div className="build-list">
              {BUILD_STATUS.map(item => (
                <div className="build-item" key={item.label}>
                  <span>{item.label}</span>
                  <span className="build-status" style={{ '--status-color': item.color } as CSSProperties}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="team-note">
              <strong>Not a solo build.</strong> A small team came together around the idea — and the next phase is
              about turning a working prototype into a platform farmers can actually rely on.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ─── Showcases ───────────────────────────────────────────────────────────── */

function ShowcasesSection() {
  return (
    <section id="showcases" className="section section--tint showcases-section">
      <div className="shell">
        <SectionHead
          eyebrow="Showcases · recognition so far"
          title={<>From a campus idea to a <em>public stage.</em></>}
          lead={
            <>
              Two moments where Fasal VIMAAN moved beyond my own laptop — evaluated in an innovation challenge, then
              shown live to visitors, founders and government representatives in Delhi.
            </>
          }
        />

        <ol className="showcase-path reveal" data-reveal aria-label="Path to recognition">
          {SHOWCASE_PATH.map((step, index) => (
            <li key={step} className={index === SHOWCASE_PATH.length - 1 ? 'is-final' : undefined}>
              <span className="showcase-path-num">{String(index + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="showcase-grid">
          {SHOWCASES.map((item, index) => (
            <article
              key={item.mark}
              className={`showcase-card reveal reveal-delay-${index + 1}`}
              data-reveal
              style={{ '--showcase-color': item.color } as CSSProperties}
            >
              <figure className="showcase-photo">
                <img
                  src={index === 0 ? FEATURED_MEDIA.yukti : FEATURED_MEDIA.dsyf}
                  alt={index === 0 ? 'The Fasal VIMAAN team presenting at the YUKTI Regional Meet' : 'The Fasal VIMAAN team demonstrating the prototype to visitors at their DSYF stall'}
                  loading="lazy"
                  decoding="async"
                  width={1600}
                  height={1200}
                />
                <figcaption>{index === 0 ? 'Presenting the idea · YUKTI Regional Meet' : 'From prototype to public showcase · DSYF 2026'}</figcaption>
              </figure>
              <header className="showcase-head">
                <div>
                  <span className="showcase-meta">{item.meta}</span>
                  <h3>{item.name}</h3>
                </div>
                <span className="showcase-mark" aria-hidden="true">{item.mark}</span>
              </header>

              <div className="showcase-body">
                <span className="showcase-status">
                  <CheckIcon size={13} /> {item.status}
                </span>
                <p className="showcase-summary">{item.summary}</p>

                <div className="showcase-stats">
                  {item.stats.map(stat => (
                    <div className="showcase-stat" key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="showcase-points">
                  {item.points.map(point => (
                    <li key={point}>
                      <span className="feature-dot" aria-hidden="true"><CheckIcon size={11} /></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="showcase-proof reveal" data-reveal>
          <figure className="proof-photo">
            <img src={FEATURED_MEDIA.certificate} alt="The Fasal VIMAAN team holding the Campus to Market certificate" loading="lazy" decoding="async" width={1600} height={1200} />
            <figcaption><strong>Campus to Market</strong><span>Top 100 selection · ₹1 lakh support</span></figcaption>
          </figure>
          <figure className="proof-photo proof-photo--portrait">
            <img src={FEATURED_MEDIA.stall} alt="The dedicated Fasal VIMAAN stall at Delhi Startup Yuva Festival 2026" loading="lazy" decoding="async" width={1200} height={1600} />
            <figcaption><strong>A place on the showcase floor</strong><span>Top 60 · dedicated DSYF stall</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ─── Milestones ──────────────────────────────────────────────────────────── */

function MilestonesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="milestones" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="Milestones · the journey so far"
          title={<>From a farm question to a public <em>showcase.</em></>}
          lead={
            <>
              Different stages, the same thread: observe closely, narrow the problem, listen in the field, then build
              something people can respond to.
            </>
          }
        />

        <div className="journey-grid">
          <div className="timeline">
            {MILESTONES.map((item, index) => (
              <div className={`timeline-item ${openIndex === index ? 'open' : ''}`} key={`${item.date}-${item.title}`}>
                <span className="timeline-dot" aria-hidden="true" />
                <button
                  type="button"
                  className="timeline-card"
                  onClick={() => setOpenIndex(current => (current === index ? null : index))}
                  aria-expanded={openIndex === index}
                  aria-controls={`milestone-panel-${index}`}
                >
                  <span className="timeline-meta">
                    <span className="timeline-date">{item.date}</span>
                    <span className="timeline-tag">{item.tag}</span>
                  </span>
                  <span className="timeline-title">
                    <span>{item.title}</span>
                    <span className="timeline-plus" aria-hidden="true">+</span>
                  </span>
                </button>
                <div className="timeline-body" id={`milestone-panel-${index}`} aria-hidden={openIndex !== index}>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="featured-card lesson-card reveal reveal-delay-2" data-reveal>
            <p className="eyebrow">The biggest lesson</p>
            <h3>The first version of an idea is rarely the final version.</h3>
            <div className="lesson-shift">
              <div className="lesson-q lesson-q--old">
                <span>From</span>
                <p>“How do I fix agricultural supply chains?”</p>
              </div>
              <span className="lesson-arrow" aria-hidden="true">↓</span>
              <div className="lesson-q lesson-q--new">
                <span>To</span>
                <p>“How do I improve farmer–buyer connections?”</p>
              </div>
            </div>
            <p className="lesson-note">
              Trying to control every part of the chain — quality, weighing, logistics, transport, payment — would have
              made the company operationally heavy. Narrowing the problem made it buildable.
            </p>
            <div className="featured-footer">
              <span>Observe · narrow · listen · build</span>
              <span className="status-dot" aria-hidden="true" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ─── Media ───────────────────────────────────────────────────────────────── */

function MediaSection() {
  return (
    <section id="media" className="section section--tint">
      <div className="shell">
        <SectionHead
          eyebrow="Photos & videos"
          title={<>Field visits, meetings <em>and showcases.</em></>}
          lead="Photos and clips I’ve collected along the way — from farmer meetings to YUKTI and DSYF."
        />
        <GallerySection />
        {!HAS_EVENT_MEDIA && (
          <div className="archive-note">
            <StarIcon size={17} />
            <span>
              <strong>Archive note.</strong> Event photos and clips from the YUKTI Innovation Challenge and the Delhi
              Startup Yuva Festival 2026 will be added here.
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Contact & footer ────────────────────────────────────────────────────── */

function ContactSection({ onConnect }: { onConnect: () => void }) {
  return (
    <section id="contact" className="contact-section" style={{ '--contact-photo': `url("${FEATURED_MEDIA.conversation}")` } as CSSProperties}>
      <div className="shell contact-inner">
        <div className="contact-head">
          <div className="reveal" data-reveal>
            <Eyebrow>Let’s connect</Eyebrow>
            <h2>
              Have something<br />
              <em>in mind?</em>
            </h2>
            <p className="contact-lead">
              A partnership, a field insight, or a question about Fasal VIMAAN — I’d be happy to hear from you.
              Message me on WhatsApp, connect on LinkedIn, or send a note below.
            </p>
          </div>
          <div className="contact-side reveal reveal-delay-2" data-reveal>
            <span className="label">Build with me</span>
            <p>
              Tell me what you’re working on and how we could work together. The form sends your message to my email.
            </p>
            <button type="button" className="btn btn-gold" onClick={onConnect}>
              <MailIcon /> Send a message <ArrowRight className="arrow" />
            </button>
            <span className="contact-status">
              <span className="status-dot" aria-hidden="true" />
              Operating from {BASE_LOCATION} · Open to collaborations
            </span>
          </div>
        </div>

        <div className="contact-grid">
          <button type="button" className="contact-card" onClick={onConnect}>
            <span className="icon"><MailIcon /></span>
            <span className="label">Email</span>
            <strong>{EMAIL} <ArrowRight className="arrow" /></strong>
            <small>Send a message straight from this page.</small>
          </button>
          <SiteLink className="contact-card">
            <span className="icon"><GlobeIcon /></span>
            <span className="label">Website</span>
            <strong>{SITE_LABEL} <ExternalIcon className="arrow" size={15} /></strong>
            <small>The Fasal VIMAAN platform, modules and updates.</small>
          </SiteLink>
          <a className="contact-card" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <span className="icon"><WhatsAppIcon size={18} /></span>
            <span className="label">WhatsApp</span>
            <strong>{PHONE_LABEL} <ExternalIcon className="arrow" size={15} /></strong>
            <small>Message me directly on WhatsApp.</small>
          </a>
          <a className="contact-card" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <span className="icon"><LinkedInIcon size={18} /></span>
            <span className="label">LinkedIn</span>
            <strong>Abhishek Kumar <ExternalIcon className="arrow" size={15} /></strong>
            <small>Connect with me on LinkedIn.</small>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <img className="brand-mark" src="/assets/profile.jpg" alt="Abhishek Kumar" width={52} height={52} />
              <span>
                <span className="footer-brand-name">Abhishek Kumar</span>
                <span className="footer-brand-role">Founder · Fasal VIMAAN</span>
              </span>
            </div>
            <p>
              Agriculture × technology. Building a digital connection between farmers and buyers across India — one
              conversation at a time.
            </p>
            <a className="footer-mail" href={MAILTO}>
              <MailIcon /> {EMAIL}
            </a>
            <SiteLink className="footer-site">
              <GlobeIcon size={15} /> {SITE_LABEL} <ExternalIcon size={12} />
            </SiteLink>
            <span className="footer-status">
              <span className="status-dot" aria-hidden="true" />
              Building in progress
            </span>
          </div>

          <div>
            <h4 className="footer-col-title">Explore</h4>
            <div className="footer-links">
              {NAV_LINKS.map(link => (
                <a className="footer-link" href={`#${link.href}`} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Field footprint</h4>
            <div className="footer-footprint">
              {FIELD_DATA.map(state => (
                <div className="footer-state" key={state.name}>
                  <div className="footer-state-head">
                    <span>{state.name}</span>
                    <span className="footer-state-count">{state.districts.length}</span>
                  </div>
                  <div className="footer-districts">
                    {state.districts.map(district => (
                      <span className="footer-district" key={district.name}>{district.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-col--contact">
            <h4 className="footer-col-title">Contact</h4>
            <div className="footer-contact">
              <a href={MAILTO}>
                <MailIcon /> {EMAIL}
              </a>
              <SiteLink>
                <GlobeIcon /> {SITE_LABEL}
              </SiteLink>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> {PHONE_LABEL}
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon size={16} /> Connect on LinkedIn
              </a>
              <span className="line">
                <PinIcon /> Operating from {BASE_LOCATION}
              </span>
              <span className="line">
                <ClockIcon /> 2024–2026 · 1,000+ conversations
              </span>
            </div>
            <div className="footer-note">
              Open to conversations around agriculture, product, technology, research, field work and partnerships.
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Abhishek Kumar · Fasal VIMAAN · All rights reserved</span>
          <div className="footer-bottom-meta">
            <span>{BASE_LOCATION}</span>
            <span aria-hidden="true">·</span>
            <SiteLink className="footer-bottom-link">{SITE_LABEL}</SiteLink>
            <button type="button" className="back-top" onClick={() => scrollToId('hero')}>
              Back to top
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ─────────────────────────────────────────────────────────────────── */

export default function App() {
  const active = useScrollSpy(NAV_IDS)
  const [connectOpen, setConnectOpen] = useState(false)
  const openConnect = useCallback(() => setConnectOpen(true), [])
  const closeConnect = useCallback(() => setConnectOpen(false), [])
  useRevealOnScroll()

  return (
    <div>
      <Nav active={active} onConnect={openConnect} />

      <main>
        <Hero onConnect={openConnect} />
        <CMVisitFeature />
        <StorySection />
        <ProblemSection />
        <PlatformSection />
        <FieldSection />
        <TechnologySection />
        <ShowcasesSection />
        <MilestonesSection />
        <MediaSection />
        <ContactSection onConnect={openConnect} />
      </main>

      <Footer />
      <a className="whatsapp-float" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Message Abhishek on WhatsApp" title="Message me on WhatsApp">
        <WhatsAppIcon size={26} />
        <span>WhatsApp <small>Message me directly</small></span>
      </a>
      <ConnectDialog email={EMAIL} open={connectOpen} onClose={closeConnect} />
    </div>
  )
}
