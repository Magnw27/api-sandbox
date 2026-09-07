import { useEffect, useMemo, useState } from 'react'
import './sandbox.css'

type CatalogItem = { id: string; category: string; auth: boolean; description: string }

type Field = { key: string; label: string; placeholder: string; defaultValue?: string }

type Endpoint = CatalogItem & { method: 'GET'; path: string; fields: Field[] }

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api-lip.vercel.app'

const endpoints: Endpoint[] = [
  { id: 'health', category: 'system', auth: false, description: 'Check API health and uptime.', method: 'GET', path: '/health', fields: [] },
  { id: 'api', category: 'system', auth: false, description: 'List API groups and examples.', method: 'GET', path: '/api', fields: [] },
  { id: 'catalog', category: 'free', auth: false, description: 'Browse every free integration.', method: 'GET', path: '/api/v1/free/catalog', fields: [] },
  { id: 'pokemon', category: 'games', auth: false, description: 'Look up a Pokémon by name.', method: 'GET', path: '/api/v1/free/pokemon/:name', fields: [{ key: 'name', label: 'name', placeholder: 'pikachu', defaultValue: 'pikachu' }] },
  { id: 'country', category: 'geo', auth: false, description: 'Look up a country by ISO code.', method: 'GET', path: '/api/v1/free/country/:code', fields: [{ key: 'code', label: 'code', placeholder: 'ID', defaultValue: 'ID' }] },
  { id: 'book', category: 'books', auth: false, description: 'Search Open Library.', method: 'GET', path: '/api/v1/free/book/search', fields: [{ key: 'q', label: 'q', placeholder: 'javascript', defaultValue: 'javascript' }] },
  { id: 'fx', category: 'finance', auth: false, description: 'Get an ECB exchange-rate reference.', method: 'GET', path: '/api/v1/free/fx', fields: [{ key: 'from', label: 'from', placeholder: 'USD', defaultValue: 'USD' }, { key: 'to', label: 'to', placeholder: 'IDR', defaultValue: 'IDR' }] },
  { id: 'words', category: 'words', auth: false, description: 'Find related words with Datamuse.', method: 'GET', path: '/api/v1/free/words', fields: [{ key: 'q', label: 'q', placeholder: 'developer', defaultValue: 'developer' }] },
  { id: 'universities', category: 'education', auth: false, description: 'Search universities by name or country.', method: 'GET', path: '/api/v1/free/universities', fields: [{ key: 'name', label: 'name', placeholder: 'Oxford' }, { key: 'country', label: 'country', placeholder: 'Indonesia' }] },
  { id: 'trivia', category: 'games', auth: false, description: 'Generate multiple-choice trivia.', method: 'GET', path: '/api/v1/free/trivia', fields: [{ key: 'amount', label: 'amount', placeholder: '10', defaultValue: '10' }] },
  { id: 'weather', category: 'weather', auth: false, description: 'Get current and forecast weather.', method: 'GET', path: '/api/v1/weather', fields: [{ key: 'lat', label: 'lat', placeholder: '-7.8166', defaultValue: '-7.8166' }, { key: 'lon', label: 'lon', placeholder: '112.0116', defaultValue: '112.0116' }, { key: 'forecast_days', label: 'forecast_days', placeholder: '3', defaultValue: '3' }] },
  { id: 'jokes', category: 'content', auth: false, description: 'Return a random joke.', method: 'GET', path: '/api/v1/jokes/random', fields: [] },
  { id: 'quote', category: 'content', auth: false, description: 'Return a random quote.', method: 'GET', path: '/api/v1/content/quote', fields: [] },
  { id: 'uuid', category: 'utility', auth: false, description: 'Generate a UUID.', method: 'GET', path: '/api/v1/utility/uuid', fields: [] },
  { id: 'hash', category: 'utility', auth: false, description: 'Create a SHA-256 hash.', method: 'GET', path: '/api/v1/utility/hash', fields: [{ key: 'text', label: 'text', placeholder: 'hello world' }] },
  { id: 'base64', category: 'utility', auth: false, description: 'Encode text as base64.', method: 'GET', path: '/api/v1/utility/base64/encode', fields: [{ key: 'text', label: 'text', placeholder: 'hello world' }] },
  { id: 'dog', category: 'animals', auth: false, description: 'Get a random dog image.', method: 'GET', path: '/api/v1/free/dog/random', fields: [] },
  { id: 'cat', category: 'animals', auth: false, description: 'Get a random cat fact.', method: 'GET', path: '/api/v1/free/cat/fact', fields: [] },
  { id: 'meal', category: 'food', auth: false, description: 'Get a random meal recipe.', method: 'GET', path: '/api/v1/free/meal/random', fields: [] },
  { id: 'ip', category: 'network', auth: false, description: 'Return the public IP.', method: 'GET', path: '/api/v1/free/ip', fields: [] },
  { id: 'random-user', category: 'people', auth: false, description: 'Generate a fictional user profile.', method: 'GET', path: '/api/v1/free/random-user', fields: [] },
  { id: 'anime', category: 'anime', auth: false, description: 'Search anime through Jikan.', method: 'GET', path: '/api/v1/free/anime/search', fields: [{ key: 'q', label: 'q', placeholder: 'Naruto', defaultValue: 'Naruto' }] },
  { id: 'holidays', category: 'calendar', auth: false, description: 'List public holidays for a country.', method: 'GET', path: '/api/v1/free/holidays/:country/:year', fields: [{ key: 'country', label: 'country', placeholder: 'ID', defaultValue: 'ID' }, { key: 'year', label: 'year', placeholder: '2026', defaultValue: '2026' }] },
  { id: 'sun', category: 'astronomy', auth: false, description: 'Get sunrise and sunset times.', method: 'GET', path: '/api/v1/free/sun', fields: [{ key: 'lat', label: 'lat', placeholder: '-7.8166', defaultValue: '-7.8166' }, { key: 'lon', label: 'lon', placeholder: '112.0116', defaultValue: '112.0116' }] },
  { id: 'wiki', category: 'knowledge', auth: false, description: 'Search Wikipedia.', method: 'GET', path: '/api/v1/free/wiki/search', fields: [{ key: 'q', label: 'q', placeholder: 'JavaScript', defaultValue: 'JavaScript' }] },
  { id: 'github', category: 'developer', auth: false, description: 'Inspect a public GitHub repository.', method: 'GET', path: '/api/v1/free/github/repo/:owner/:repo', fields: [{ key: 'owner', label: 'owner', placeholder: 'Magnw27', defaultValue: 'Magnw27' }, { key: 'repo', label: 'repo', placeholder: 'api-sandbox', defaultValue: 'api-sandbox' }] },
  { id: 'random-quote', category: 'content', auth: false, description: 'Get a random quotation from Quotable.', method: 'GET', path: '/api/v1/free/quote', fields: [] },
]

function pretty(value: unknown) {
  try { return JSON.stringify(value, null, 2) } catch { return String(value) }
}

export default function Sandbox() {
  const [selected, setSelected] = useState(endpoints[3])
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(endpoints[3].fields.map((f) => [f.key, f.defaultValue ?? ''])))
  const [search, setSearch] = useState('')
  const [response, setResponse] = useState<unknown>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => endpoints.filter((e) => `${e.id} ${e.category} ${e.description}`.toLowerCase().includes(search.toLowerCase())), [search])

  useEffect(() => {
    setValues(Object.fromEntries(selected.fields.map((f) => [f.key, f.defaultValue ?? ''])))
    setResponse(null); setStatus(null); setElapsed(null); setError('')
  }, [selected])

  const buildUrl = () => {
    let path = selected.path
    for (const field of selected.fields) {
      if (path.includes(`:${field.key}`)) path = path.replace(`:${field.key}`, encodeURIComponent(values[field.key] ?? ''))
    }
    const params = new URLSearchParams()
    for (const field of selected.fields) if (!path.includes(`:${field.key}`) && values[field.key]) params.set(field.key, values[field.key])
    return `${API_BASE}${path}${params.toString() ? `?${params.toString()}` : ''}`
  }

  const run = async () => {
    setLoading(true); setError(''); setResponse(null); setStatus(null); setElapsed(null); setCopied(false)
    const started = performance.now()
    try {
      const res = await fetch(buildUrl(), { headers: { Accept: 'application/json' } })
      const text = await res.text()
      let data: unknown
      try { data = JSON.parse(text) } catch { data = text }
      setStatus(res.status); setElapsed(Math.round(performance.now() - started)); setResponse(data)
      if (!res.ok) setError(`Request returned HTTP ${res.status}.`)
    } catch (err) {
      setElapsed(Math.round(performance.now() - started)); setError(err instanceof Error ? err.message : 'Network request failed.')
    } finally { setLoading(false) }
  }

  const copyResponse = async () => {
    if (response === null) return
    await navigator.clipboard?.writeText(pretty(response))
    setCopied(true); window.setTimeout(() => setCopied(false), 1600)
  }

  const reset = () => setValues(Object.fromEntries(selected.fields.map((f) => [f.key, f.defaultValue ?? ''])))

  return (
    <div className="sandbox-shell">
      <header className="sandbox-topbar">
        <button className="sandbox-brand" onClick={() => { window.location.href = '/' }} aria-label="Back to landing"><span className="sandbox-mark">/</span><span>api-sandbox</span><b>/ x</b></button>
        <div className="sandbox-top-actions"><span className="sandbox-api-label">{API_BASE.replace(/^https?:\/\//, '')}</span><button className="ghost-btn" onClick={() => window.location.href = '/'}>Landing</button></div>
      </header>

      <div className="sandbox-layout">
        <aside className="endpoint-sidebar">
          <div className="side-head"><div><span className="mono-label">EXPLORER</span><h1>Endpoints</h1></div><span className="count-pill">{endpoints.length}</span></div>
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search endpoints..." /></label>
          <div className="endpoint-list">
            {filtered.map((endpoint) => <button key={endpoint.id} className={`endpoint-item ${selected.id === endpoint.id ? 'active' : ''}`} onClick={() => setSelected(endpoint)}><span className="method-mini">GET</span><span><strong>{endpoint.id}</strong><small>{endpoint.category}</small></span></button>)}
            {!filtered.length && <div className="empty-side">No endpoints found.</div>}
          </div>
        </aside>

        <main className="sandbox-main">
          <div className="sandbox-heading"><div><span className="mono-label">REQUEST BUILDER</span><h2>{selected.id}</h2><p>{selected.description}</p></div><span className="live-badge">GET · NO AUTH</span></div>

          <section className="request-card">
            <div className="request-url"><span>GET</span><code>{buildUrl().replace(API_BASE, '')}</code><button onClick={run} disabled={loading}>{loading ? 'Sending…' : 'Send request'}</button></div>
            {selected.fields.length > 0 ? <div className="field-grid">{selected.fields.map((field) => <label key={field.key}><span>{field.label}</span><input value={values[field.key] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} placeholder={field.placeholder} /></label>)}</div> : <div className="no-params">This endpoint needs no parameters. It is ready to run.</div>}
            <div className="request-actions"><button className="run-btn" onClick={run} disabled={loading}>{loading ? 'Running request…' : 'Run GET'}</button><button className="reset-btn" onClick={reset}>Reset</button></div>
          </section>

          <section className="response-card">
            <div className="response-head"><div><span className="mono-label">RESPONSE</span><strong>{status ? `${status} ${status >= 200 && status < 300 ? 'OK' : 'ERROR'}` : 'Waiting for request'}</strong></div><div className="response-meta">{elapsed !== null ? `${elapsed} ms` : '—'}<button onClick={copyResponse} disabled={response === null}>{copied ? 'Copied' : 'Copy JSON'}</button></div></div>
            {error && <div className="error-line">{error}</div>}
            <pre className="json-view">{response === null ? <span className="placeholder">Run an endpoint to inspect its JSON response.</span> : pretty(response)}</pre>
          </section>

          <div className="sandbox-footnote"><span>api-sandbox-x</span><span>Requests go through your My REST API instance.</span></div>
        </main>
      </div>
    </div>
  )
}
