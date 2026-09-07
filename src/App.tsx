import { useState, type ReactNode } from 'react'

type IconName = 'arrow' | 'grid' | 'terminal' | 'spark' | 'menu' | 'close' | 'check' | 'pulse'

function Icon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    terminal: <><path d="m6 8 4 4-4 4" /><path d="M13 16h5" /></>,
    spark: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    pulse: <><path d="M3 12h4l2-6 4 12 2-6h6" /></>,
  }

  return <svg {...common} aria-hidden="true">{paths[name]}</svg>
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api-lip.vercel.app'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [checking, setChecking] = useState(false)
  const [apiState, setApiState] = useState<'idle' | 'online' | 'offline'>('idle')
  const [notice, setNotice] = useState('')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const checkApi = async () => {
    setChecking(true)
    setNotice('')
    try {
      const response = await fetch(`${API_BASE}/health`, { headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error('API unavailable')
      setApiState('online')
      setNotice('API is responding normally.')
    } catch {
      setApiState('offline')
      setNotice('Could not reach the API right now. The sandbox can still be configured separately.')
    } finally {
      setChecking(false)
      window.setTimeout(() => setNotice(''), 4200)
    }
  }

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Primary navigation">
          <button className="wordmark" onClick={() => scrollTo('top')} aria-label="Back to top">
            <span className="mark">/</span><span>api-sandbox</span>
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            <button onClick={() => scrollTo('why')}>Why sandbox</button>
            <button onClick={() => scrollTo('workflow')}>Workflow</button>
            <button onClick={() => scrollTo('next')}>What’s next</button>
            <button className="nav-mobile-cta" onClick={() => scrollTo('next')}>Explore</button>
          </div>
          <div className="nav-actions">
            <button className={`status-chip ${apiState}`} onClick={checkApi} disabled={checking}>
              <span className="status-dot" />
              {checking ? 'Checking' : apiState === 'online' ? 'API online' : apiState === 'offline' ? 'API offline' : 'Check API'}
            </button>
            <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> A focused API playground</div>
            <h1>Build with the API.<br /><em>See what happens.</em></h1>
            <p className="hero-lede">A quiet, fast workspace for exploring My REST API endpoints without the noise of a giant dashboard.</p>
            <div className="hero-actions">
              <button className="button button-light" onClick={() => scrollTo('next')}>
                Enter the sandbox <Icon name="arrow" />
              </button>
              <button className="text-button" onClick={() => scrollTo('workflow')}>See how it works <span>↓</span></button>
            </div>
            <div className="hero-note"><Icon name="check" /> No account. No chat history. Just the tools you need.</div>
          </div>

          <div className="hero-art" aria-label="API request preview">
            <div className="window-card">
              <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>request.preview</span><span className="window-kicker">GET</span></div>
              <div className="request-line"><span className="method">GET</span><span className="url">/api/v1/free/pokemon/pikachu</span></div>
              <div className="code-preview">
                <div><span className="muted">{`{`}</span></div>
                <div className="indent"><span className="key">"success"</span><span className="muted">: </span><span className="value">true</span><span className="muted">,</span></div>
                <div className="indent"><span className="key">"name"</span><span className="muted">: </span><span className="string">"pikachu"</span><span className="muted">,</span></div>
                <div className="indent"><span className="key">"source"</span><span className="muted">: </span><span className="string">"PokeAPI"</span></div>
                <div><span className="muted">{`}`}</span></div>
              </div>
              <div className="response-footer"><span><span className="live-dot" /> 200 OK</span><span>42 ms</span></div>
            </div>
            <div className="float-stat stat-one"><span>21</span><small>curated APIs</small></div>
            <div className="float-stat stat-two"><span>JSON</span><small>clean output</small></div>
          </div>
        </section>

        <section id="why" className="section container">
          <div className="section-intro"><span className="section-number">01</span><div><p className="section-label">Why this exists</p><h2>Less interface.<br />More signal.</h2></div></div>
          <div className="feature-grid">
            <article className="feature-card feature-large"><div className="feature-icon"><Icon name="grid" /></div><span className="feature-index">A / 01</span><h3>One place to explore</h3><p>Move between endpoint groups, parameters and responses from one coherent workspace. No maze of nested pages.</p></article>
            <article className="feature-card"><div className="feature-icon"><Icon name="terminal" /></div><span className="feature-index">A / 02</span><h3>Readable by default</h3><p>Responses are presented as useful data, not a wall of raw browser output.</p></article>
            <article className="feature-card"><div className="feature-icon"><Icon name="spark" /></div><span className="feature-index">A / 03</span><h3>Made for testing</h3><p>Quick requests, clear states and honest errors keep experimentation quick and predictable.</p></article>
          </div>
        </section>

        <section id="workflow" className="section workflow container">
          <div className="section-intro"><span className="section-number">02</span><div><p className="section-label">The workflow</p><h2>Three steps.<br />No ceremony.</h2></div></div>
          <div className="steps">
            <div className="step"><span>01</span><div><h3>Choose</h3><p>Pick an endpoint from the API catalog and add the parameter it needs.</p></div></div>
            <div className="step"><span>02</span><div><h3>Run</h3><p>Send the request directly to the REST API and keep the interaction visible.</p></div></div>
            <div className="step"><span>03</span><div><h3>Inspect</h3><p>Read the structured response, status and timing, then iterate immediately.</p></div></div>
          </div>
        </section>

        <section id="next" className="final-section">
          <div className="final-inner container">
            <div>
              <span className="section-label">03 / Next</span>
              <h2>The landing is ready.<br /><em>The sandbox comes next.</em></h2>
              <p>The actual tester will live on its own route, keeping this landing page fast, calm and separate from the working tools.</p>
            </div>
            <button className="button button-light final-button" onClick={checkApi} disabled={checking}>
              <Icon name="pulse" /> {checking ? 'Checking API…' : 'Check API connection'}
            </button>
          </div>
        </section>
      </main>

      <footer className="footer container"><span>api-sandbox</span><span>My REST API · Vite + React</span></footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}
