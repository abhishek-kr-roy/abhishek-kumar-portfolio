import { useMemo, type CSSProperties } from 'react'

export type District = {
  name: string
  note: string
}

export type StateData = {
  name: string
  short: string
  note: string
  color: string
  districts: District[]
}

export const FIELD_DATA: StateData[] = [
  {
    name: 'Bihar',
    short: 'Bihar',
    note: 'Where the journey began · origin state',
    color: '#2E6B32',
    districts: [
      { name: 'Khagaria', note: 'Origin · grandfather’s farm' },
      { name: 'Begusarai', note: 'North of the Ganga' },
      { name: 'Bhagalpur', note: 'Eastern Bihar · Ganga belt' },
      { name: 'Darbhanga', note: 'Mithila region' },
    ],
  },
  {
    name: 'Uttar Pradesh',
    short: 'Uttar Pradesh',
    note: 'Field conversations · large farmer base',
    color: '#6FA745',
    districts: [
      { name: 'Kanpur', note: 'Central UP' },
      { name: 'Bijnor', note: 'Western UP' },
    ],
  },
  {
    name: 'Himachal Pradesh',
    short: 'Himachal Pradesh',
    note: 'Horticulture and hill farming',
    color: '#C8A84B',
    districts: [
      { name: 'Mandi', note: 'Central Himachal' },
      { name: 'Kangra', note: 'Kangra valley' },
    ],
  },
  {
    name: 'Odisha',
    short: 'Odisha',
    note: 'Coastal agriculture · field visits',
    color: '#7A4B2A',
    districts: [
      { name: 'Bhubaneswar', note: 'State capital' },
      { name: 'Khordha', note: 'Around Bhubaneswar' },
      { name: 'Puri', note: 'Coastal Odisha' },
    ],
  },
]

const PIN_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

function PlaceRibbon() {
  const places = useMemo(
    () =>
      FIELD_DATA.flatMap(state =>
        state.districts.map(district => ({
          key: `${state.name}-${district.name}`,
          place: district.name,
          state: state.short,
          color: state.color,
        }))
      ),
    []
  )

  return (
    <div className="ribbon" aria-label="Places visited across Bihar, Uttar Pradesh, Himachal Pradesh and Odisha">
      <div className="ribbon-track">
        {[...places, ...places].map((place, index) => (
          <span className="ribbon-item" key={`${place.key}-${index}`}>
            <span className="dot" style={{ background: place.color }} aria-hidden="true" />
            {place.place}
            <small>{place.state}</small>
            <span className="ribbon-sep" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FieldFootprint() {
  return (
    <>
      <PlaceRibbon />

      <div className="state-grid">
        {FIELD_DATA.map((state, index) => (
          <article
            key={state.name}
            className={`state-card reveal reveal-delay-${(index % 3) + 1}`}
            data-reveal
            style={{ '--state-color': state.color } as CSSProperties}
          >
            <div className="state-head">
              <h4 className="state-name">
                {state.name}
                {state.name === 'Bihar' && <span className="origin-badge">Origin</span>}
              </h4>
              <span className="state-count">
                {state.districts.length} {state.districts.length === 1 ? 'place' : 'districts'}
              </span>
            </div>
            <p className="state-note">{state.note}</p>
            <div className="district-list">
              {state.districts.map(district => (
                <div className="district-row" key={district.name}>
                  <span className="district-pin" aria-hidden="true" />
                  <span className="district-name">{district.name}</span>
                  <span className="district-note">{district.note}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="field-footnote reveal" data-reveal>
        <span aria-hidden="true">{PIN_ICON}</span>
        <span>
          <strong>4 states · 11 districts visited.</strong> The route changed, the crops changed and the people
          changed — but the field kept bringing me back to the same job: listen first, then build.
        </span>
      </div>
    </>
  )
}
