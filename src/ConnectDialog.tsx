import { useEffect, useRef, useState, type FormEvent } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const TOPICS = ['Collaboration', 'Partnership', 'Investment', 'Field research', 'Media / interview', 'Just saying hello']
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? ''

export default function ConnectDialog({ email, open, onClose }: { email: string; open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTopic(TOPICS[0])
      setStatus(current => current === 'sent' ? 'idle' : current)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    nameRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([tabindex="-1"]), select, textarea, a[href]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
      trigger?.focus()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (status === 'sent') dialogRef.current?.querySelector<HTMLButtonElement>('.connect-success button')?.focus()
    if (status === 'idle') nameRef.current?.focus()
  }, [open, status])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!open) return null

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'sending') return
    if (honey) {
      setStatus('sent')
      return
    }
    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('error')
      setError('The contact form is not configured yet.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      const body = new FormData()
      body.append('access_key', WEB3FORMS_ACCESS_KEY)
      body.append('subject', `${topic} — ${name.trim()} via portfolio`)
      body.append('from_name', 'Fasal VIMAAN Portfolio')
      body.append('name', name.trim())
      body.append('email', senderEmail.trim())
      body.append('phone', phone.trim())
      body.append('topic', topic)
      body.append('message', message.trim())
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/json' },
        body,
      })
      const data = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string }
      if (!response.ok || data.success !== true) throw new Error(data.message || 'The message could not be sent.')
      setStatus('sent')
      setName('')
      setSenderEmail('')
      setPhone('')
      setMessage('')
    } catch (caught) {
      setStatus('error')
      setError(caught instanceof Error ? caught.message : 'The message could not be sent.')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const field = document.createElement('textarea')
      field.value = email
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
  }

  return (
    <div className="connect-backdrop" onClick={onClose}>
      <div
        className="connect-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-title"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className="connect-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="connect-success" role="status">
            <span className="connect-success-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2 id="connect-title" className="connect-title">Message sent</h2>
            <p className="connect-sub">Thank you for reaching out. Abhishek will get back to you by email or phone soon.</p>
            <div className="connect-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
              <button type="button" className="btn btn-outline" onClick={() => setStatus('idle')}>Send another</button>
            </div>
          </div>
        ) : (
          <>
            <p className="eyebrow">Let’s connect</p>
            <h2 id="connect-title" className="connect-title">Write to Abhishek</h2>
            <p className="connect-sub">Share your details and message — it’s sent directly from this page.</p>

            <form className="connect-form" onSubmit={onSubmit}>
              <div className="connect-row">
                <label className="connect-field">
                  <span>Your name *</span>
                  <input ref={nameRef} value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Priya Sharma" autoComplete="name" required maxLength={80} />
                </label>
                <label className="connect-field">
                  <span>Topic</span>
                  <select value={topic} onChange={event => setTopic(event.target.value)}>
                    {TOPICS.map(option => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <div className="connect-row">
                <label className="connect-field">
                  <span>Email *</span>
                  <input type="email" value={senderEmail} onChange={event => setSenderEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required maxLength={120} />
                </label>
                <label className="connect-field">
                  <span>Phone number *</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={event => setPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                    pattern="[+]?[0-9][0-9 \-\(\)]{6,18}"
                    title="Enter a valid phone number, e.g. +91 98765 43210"
                  />
                </label>
              </div>
              <label className="connect-field">
                <span>Message *</span>
                <textarea value={message} onChange={event => setMessage(event.target.value)} rows={4} placeholder="Hi Abhishek, I’d love to talk about…" required maxLength={3000} />
              </label>
              <input className="connect-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" value={honey} onChange={event => setHoney(event.target.value)} aria-hidden="true" />

              {status === 'error' && (
                <p className="connect-error" role="alert">
                  {error} Please try again, or write to <a href={`mailto:${email}`}>{email}</a>.
                </p>
              )}

              <div className="connect-actions">
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </div>
              <p className="connect-privacy">Sending shares your details with Abhishek through Web3Forms.</p>
            </form>

            <div className="connect-copy">
              <span>Prefer email?</span>
              <button type="button" className={`connect-copy-btn ${copied ? 'is-copied' : ''}`} onClick={copyEmail}>
                {copied ? 'Copied ✓' : `Copy ${email}`}
              </button>
            </div>
          </>
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied' : status === 'sending' ? 'Sending message' : ''}
        </span>
      </div>
    </div>
  )
}
