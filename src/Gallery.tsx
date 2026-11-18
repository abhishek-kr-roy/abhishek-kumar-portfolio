import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type GalleryCategory = 'conversations' | 'visits' | 'yukti' | 'dsyf' | 'clips'
type FilterId = 'all' | GalleryCategory

type GalleryItem = {
  src: string
  type: 'image' | 'video'
  alt: string
  caption: string
  kicker: string
  category: GalleryCategory
  poster?: string
  aspectRatio?: number
  duration?: number
}

const CORE_PHOTOS: GalleryItem[] = [
  {
    src: '/assets/farm-01.jpg',
    type: 'image',
    alt: 'A farmer group standing together during a field meeting in Bihar.',
    caption: 'Farmer group after a field meeting in Bihar.',
    kicker: 'Field visit · group meeting',
    category: 'visits',
  },
  {
    src: '/assets/farm-02.jpg',
    type: 'image',
    alt: 'Farmers sitting together in a circle, discussing farming and selling.',
    caption: 'A group discussion with farmers.',
    kicker: 'Farmer conversation',
    category: 'conversations',
  },
  {
    src: '/assets/farm-03.jpg',
    type: 'image',
    alt: 'A group of farmers gathered indoors during a field discussion.',
    caption: 'An indoor farmer meeting.',
    kicker: 'Farmer conversation',
    category: 'conversations',
  },
  {
    src: '/assets/farm-04.jpg',
    type: 'image',
    alt: 'A field discussion with farmers seated on the floor, reviewing documents.',
    caption: 'Reviewing documents during a farmer meeting.',
    kicker: 'Farmer conversation',
    category: 'conversations',
  },
  {
    src: '/assets/farm-05.jpg',
    type: 'image',
    alt: 'Farmers sitting in a circle during a community meeting.',
    caption: 'Farmers gathered for a community meeting.',
    kicker: 'Farmer conversation',
    category: 'conversations',
  },
  {
    src: '/assets/farm-06.jpg',
    type: 'image',
    alt: 'Farmers holding documents and standing together after a meeting.',
    caption: 'Farmer group after a village meeting.',
    kicker: 'Field visit · group meeting',
    category: 'visits',
  },
  {
    src: '/assets/farm-07.jpg',
    type: 'image',
    alt: 'A wider view of a farmer group meeting in a village.',
    caption: 'A village farmer meeting in Bihar.',
    kicker: 'Field visit · community',
    category: 'visits',
  },
]

const FOLDERS: Record<string, { category: GalleryCategory; kicker: string }> = {
  'field-visits': { category: 'visits', kicker: 'Field visit' },
  'farmer-conversations': { category: 'conversations', kicker: 'Farmer conversation' },
  yukti: { category: 'yukti', kicker: 'YUKTI Innovation Challenge' },
  dsyf: { category: 'dsyf', kicker: 'Delhi Startup Yuva Festival 2026' },
  clips: { category: 'clips', kicker: 'Clip' },
}

const MEDIA_FILES = import.meta.glob(
  ['./assets/media/*/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF,gif,GIF,mp4,MP4,webm,WEBM,mov,MOV,m4v,M4V}', '!./assets/media/posters/*'],
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>

const POSTERS = import.meta.glob('./assets/media/posters/*.jpg', { eager: true, import: 'default', query: '?url' }) as Record<string, string>

export const FEATURED_MEDIA = {
  conversation: MEDIA_FILES['./assets/media/farmer-conversations/01-roadside-farmer-conversation.jpg'],
  field: MEDIA_FILES['./assets/media/farmer-conversations/04-with-farmers-after-the-conversation.jpg'],
  yukti: MEDIA_FILES['./assets/media/yukti/02-yukti-team-presentation.jpg'],
  dsyf: MEDIA_FILES['./assets/media/dsyf/03-dsyf-stall-with-visitors.jpg'],
  cmVisit: MEDIA_FILES['./assets/media/dsyf/07-dsyf-presenting-fasal-vimaan.jpg'],
  certificate: MEDIA_FILES['./assets/media/dsyf/02-campus-to-market-team-certificate.jpg'],
  stall: MEDIA_FILES['./assets/media/dsyf/05-fasal-vimaan-dedicated-stall.jpg'],
}

const VIDEO_DETAILS: Record<string, { aspectRatio: number; duration: number }> = {
  '09-dsyf-live-stall-demo.mp4': { aspectRatio: 9 / 16, duration: 20.8 },
  '05-community-farmer-meeting-highlights.mp4': { aspectRatio: 256 / 135, duration: 15 },
  '06-it-started-at-a-seed-promotion-meeting.mp4': { aspectRatio: 9 / 16, duration: 33.8 },
  '04-village-farmer-conversation.mp4': { aspectRatio: 9 / 16, duration: 19.2 },
  '05-beyond-what-we-see-hill-farm-visit.mp4': { aspectRatio: 9 / 16, duration: 26.5 },
}

const PORTRAIT_RATIOS: Record<string, number> = {
  '04-dsyf-live-prototype-demo.jpg': 1186 / 1599,
  '05-fasal-vimaan-dedicated-stall.jpg': 3 / 4,
  '06-dsyf-phone-demo-at-stall.jpg': 3 / 4,
  '01-farmer-group-in-the-field.jpg': 610 / 1084,
  '02-dairy-farming-in-the-village.jpg': 610 / 1084,
  '03-recording-farmer-stories-in-the-field.jpg': 610 / 1084,
  '01-abhishek-at-gl-bajaj-regional-meet.jpg': 3 / 4,
  '03-presenting-the-problem-at-yukti.jpg': 9 / 16,
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i

function captionFromFile(file: string) {
  const base = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[\s._-]*/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
  const caption = base ? base.charAt(0).toUpperCase() + base.slice(1) : ''
  return caption.replace(/\bdsyf\b/gi, 'DSYF').replace(/\byukti\b/gi, 'YUKTI').replace(/\bgl bajaj\b/gi, 'GL Bajaj').replace(/\bfasal vimaan\b/gi, 'Fasal VIMAAN')
}

const UPLOADED: GalleryItem[] = Object.keys(MEDIA_FILES)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .flatMap(path => {
    const [, folder, file] = path.match(/media\/([^/]+)\/([^/]+)$/) ?? []
    const meta = FOLDERS[folder]
    if (!meta) return []
    const type = VIDEO_EXT.test(file) ? 'video' : 'image'
    const caption = file === '07-dsyf-presenting-fasal-vimaan.jpg'
      ? 'Delhi CM Rekha Gupta visiting our Fasal VIMAAN stall'
      : captionFromFile(file) || meta.kicker
    return [{
      src: MEDIA_FILES[path], type, alt: caption, caption, kicker: meta.kicker, category: meta.category,
      poster: POSTERS[`./assets/media/posters/${file.replace(/\.[^.]+$/, '.jpg')}`],
      aspectRatio: VIDEO_DETAILS[file]?.aspectRatio ?? PORTRAIT_RATIOS[file] ?? (file === '01-campus-to-market-award-ceremony.jpg' ? 16 / 9 : 4 / 3),
      duration: VIDEO_DETAILS[file]?.duration,
    }]
  })

export const GALLERY_ITEMS: GalleryItem[] = [...UPLOADED, ...CORE_PHOTOS]

export const HAS_EVENT_MEDIA = UPLOADED.some(item => item.category === 'yukti' || item.category === 'dsyf')

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'conversations', label: 'Farmer conversations' },
  { id: 'visits', label: 'Field visits' },
  { id: 'yukti', label: 'YUKTI' },
  { id: 'dsyf', label: 'DSYF 2026' },
  { id: 'clips', label: 'Clips' },
]

const matches = (item: GalleryItem, filter: FilterId) =>
  filter === 'all' || (filter === 'clips' ? item.type === 'video' : item.category === filter)

const VISIBLE_FILTERS = FILTERS.filter(f => GALLERY_ITEMS.some(item => matches(item, f.id)))

function ZoomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = items[index]
  const viewerRef = useRef<HTMLDivElement>(null)

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'Tab') {
        const controls = viewerRef.current?.querySelectorAll<HTMLElement>('button, video[controls]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    viewerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => {
      document.body.style.overflow = previous
      trigger?.focus()
    }
  }, [])

  if (!item) return null

  return (
    <div ref={viewerRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer" onClick={onClose}>
      <button type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close viewer">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <figure className="lightbox-figure" onClick={event => event.stopPropagation()}>
        {item.type === 'video' ? (
          <div className="lightbox-stage" style={{ '--media-ratio': item.aspectRatio ?? 9 / 16, '--poster-image': item.poster ? `url("${item.poster}")` : 'none' } as CSSProperties}>
            <video key={item.src} className="lightbox-media" src={item.src} poster={item.poster} controls autoPlay playsInline aria-label={item.caption} />
          </div>
        ) : (
          <img className="lightbox-media" src={item.src} alt={item.alt} />
        )}
        <figcaption className="lightbox-caption">{item.caption}</figcaption>
        <span className="lightbox-counter">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </figure>

      {items.length > 1 && (
        <>
          <button type="button" className="lightbox-btn lightbox-nav lightbox-nav--prev" onClick={event => { event.stopPropagation(); onPrev() }} aria-label="Previous">
            <Chevron direction="left" />
          </button>
          <button type="button" className="lightbox-btn lightbox-nav lightbox-nav--next" onClick={event => { event.stopPropagation(); onNext() }} aria-label="Next">
            <Chevron direction="right" />
          </button>
        </>
      )}
    </div>
  )
}

function MediaTile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const [imageRatio, setImageRatio] = useState(item.aspectRatio ?? 4 / 3)
  const isVideo = item.type === 'video'
  const ratio = isVideo ? item.aspectRatio ?? 9 / 16 : imageRatio
  const duration = item.duration === undefined ? '' : `0:${String(Math.round(item.duration)).padStart(2, '0')}`

  return (
    <button
      type="button"
      className={`gallery-item ${isVideo ? 'gallery-item--video' : ''} ${ratio < 1 ? 'gallery-item--portrait' : 'gallery-item--landscape'}`}
      onClick={onOpen}
      aria-label={`${isVideo ? 'Play clip' : 'Open photo'}: ${item.caption}`}
    >
      <span className="media-preview" style={{ aspectRatio: ratio, '--poster-image': isVideo && item.poster ? `url("${item.poster}")` : 'none' } as CSSProperties}>
        {isVideo && !item.poster ? (
          <video src={`${item.src}#t=0.5`} muted playsInline preload="metadata" aria-hidden="true" />
        ) : (
          <img src={isVideo ? item.poster : item.src} alt={isVideo ? '' : item.alt} loading="lazy" decoding="async" onLoad={isVideo ? undefined : event => setImageRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)} />
        )}
        {isVideo ? (
          <>
            <span className="gallery-play" aria-hidden="true"><PlayIcon /></span>
            <span className="media-badge">{ratio < 1 ? '9:16' : 'Highlights'}{duration && ` · ${duration}`}</span>
          </>
        ) : (
          <span className="gallery-zoom" aria-hidden="true"><ZoomIcon /></span>
        )}
      </span>
      <span className="gallery-copy">
        <span className="gallery-kicker">{item.kicker}</span>
        <span className="gallery-caption">{item.caption}</span>
      </span>
    </button>
  )
}

export default function GallerySection() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredItems = useMemo(() => GALLERY_ITEMS.filter(item => matches(item, filter)), [filter])
  const videos = filteredItems.filter(item => item.type === 'video').sort((a, b) => (a.aspectRatio ?? 1) - (b.aspectRatio ?? 1))
  const photos = filteredItems.filter(item => item.type === 'image').sort((a, b) => Number(b.src === FEATURED_MEDIA.cmVisit) - Number(a.src === FEATURED_MEDIA.cmVisit))
  const items = [...videos, ...photos]
  const videoCount = videos.length
  const photoCount = photos.length

  useEffect(() => {
    setLightboxIndex(null)
  }, [filter])

  return (
    <div>
      <div className="gallery-toolbar">
        {VISIBLE_FILTERS.map(item => (
          <button
            key={item.id}
            type="button"
            className={`filter-btn ${filter === item.id ? 'active' : ''}`}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
          >
            {item.label}
          </button>
        ))}
        <span className="gallery-count">
          {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
          {videoCount > 0 && ` · ${videoCount} ${videoCount === 1 ? 'clip' : 'clips'}`}
        </span>
      </div>

      {videoCount > 0 && (
        <div className="gallery-clips">
          <div className="gallery-subhead">
            <h3>Clips from field visits & DSYF</h3>
          </div>
          <div className="clips-grid">
            {videos.map(item => <MediaTile key={item.src} item={item} onOpen={() => setLightboxIndex(items.indexOf(item))} />)}
          </div>
        </div>
      )}

      {photoCount > 0 && (
        <div>
          <div className="gallery-subhead">
            <h3>Photo archive</h3>
          </div>
          <div className="gallery-grid" key={filter}>
            {photos.map(item => <MediaTile key={item.src} item={item} onOpen={() => setLightboxIndex(items.indexOf(item))} />)}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(current => (current === null ? null : (current - 1 + items.length) % items.length))}
          onNext={() => setLightboxIndex(current => (current === null ? null : (current + 1) % items.length))}
        />
      )}
    </div>
  )
}
