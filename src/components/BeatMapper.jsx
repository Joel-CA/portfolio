import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * BeatMapper — Dev tool for recording multi-level beat intervals.
 *
 * Levels:
 *   Level 1 (green)  — Spinning only            (already recorded)
 *   Level 2 (blue)   — Spinning + color changing (record with Space)
 *   Level 3 (magenta) — Spinning + colors + rave  (record with Space)
 *
 * Usage:
 *   1. Navigate to ?dev=beatmapper
 *   2. Select which level you want to record (2 or 3)
 *   3. Click Play to start the song — level 1 intervals shown as reference
 *   4. HOLD Spacebar during sections that should have the selected level
 *   5. Click "Copy JSON" to get the full beat map
 *   6. Paste into public/assets/audio/beatmap.json
 */

const LEVEL_COLORS = {
  level1: { bg: 'rgba(74, 222, 128, 0.35)', border: 'rgba(74, 222, 128, 0.7)', label: '#4ade80', name: 'Spin' },
  level2: { bg: 'rgba(96, 165, 250, 0.4)', border: 'rgba(96, 165, 250, 0.8)', label: '#60a5fa', name: 'Spin + Colors' },
  level3: { bg: 'rgba(232, 121, 249, 0.4)', border: 'rgba(232, 121, 249, 0.8)', label: '#e879f9', name: 'Spin + Colors + Rave' },
}

const BeatMapper = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const currentIntervalStart = useRef(null)
  const animFrameRef = useRef(null)

  // Which level we're recording
  const [activeLevel, setActiveLevel] = useState('level2')

  // All levels of intervals
  const [beatMap, setBeatMap] = useState({ level1: [], level2: [], level3: [] })

  // Load existing beatmap.json on mount
  useEffect(() => {
    fetch('./assets/audio/beatmap.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.level1) {
          setBeatMap(data)
        } else if (Array.isArray(data)) {
          // Legacy flat array → treat as level1
          setBeatMap({ level1: data, level2: [], level3: [] })
        }
      })
      .catch(() => console.warn('No beatmap.json found'))
  }, [])

  // Update current time display via requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [])

  // Key handlers
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault()
      if (!isPlaying || !audioRef.current) return
      currentIntervalStart.current = audioRef.current.currentTime
      setIsRecording(true)
    }
  }, [isPlaying])

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault()
      if (currentIntervalStart.current !== null && audioRef.current) {
        const start = currentIntervalStart.current
        const end = audioRef.current.currentTime
        if (end > start + 0.05) {
          const interval = [
            Math.round(start * 100) / 100,
            Math.round(end * 100) / 100
          ]
          setBeatMap(prev => ({
            ...prev,
            [activeLevel]: [...prev[activeLevel], interval]
          }))
        }
        currentIntervalStart.current = null
      }
      setIsRecording(false)
    }
  }, [activeLevel])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
    }
    // Only clear the active level
    setBeatMap(prev => ({ ...prev, [activeLevel]: [] }))
    setIsRecording(false)
    currentIntervalStart.current = null
  }

  const copyJSON = () => {
    const json = JSON.stringify(beatMap, null, 2)
    navigator.clipboard.writeText(json)
    alert('Full beat map JSON copied to clipboard!')
  }

  const undoLast = () => {
    setBeatMap(prev => ({
      ...prev,
      [activeLevel]: prev[activeLevel].slice(0, -1)
    }))
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const activeLevelColor = LEVEL_COLORS[activeLevel]
  const activeIntervals = beatMap[activeLevel] || []

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        🎵 Beat Mapper — Dev Tool
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Select a level, then hold <kbd style={kbdStyle}>Space</kbd> to mark intervals.
        Level 1 intervals are shown as reference (green).
      </p>

      <audio
        ref={audioRef}
        src="./assets/audio/party-cat.mp3"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Level selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.entries(LEVEL_COLORS).map(([key, val]) => {
          const isActive = activeLevel === key
          const isReadOnly = key === 'level1'
          return (
            <button
              key={key}
              onClick={() => !isReadOnly && setActiveLevel(key)}
              style={{
                ...btnStyle,
                background: isActive ? val.bg : '#1e293b',
                borderColor: isActive ? val.border : '#475569',
                color: isActive ? val.label : '#94a3b8',
                opacity: isReadOnly ? 0.5 : 1,
                cursor: isReadOnly ? 'not-allowed' : 'pointer',
              }}
            >
              {key === 'level1' ? '🔒 ' : ''}{val.name}
              <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', opacity: 0.7 }}>
                ({(beatMap[key] || []).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={togglePlay} style={btnStyle}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={restart} style={btnStyle}>⏮ Restart & Clear {activeLevel}</button>
        <button onClick={undoLast} style={btnStyle} disabled={activeIntervals.length === 0}>
          ↩ Undo Last
        </button>
        <button onClick={copyJSON} style={{ ...btnStyle, background: '#7c3aed' }}>
          📋 Copy Full JSON
        </button>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div style={{
          position: 'relative', height: '48px', background: '#1e293b',
          borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
        }}
          onClick={(e) => {
            if (!audioRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            audioRef.current.currentTime = pct * duration
          }}
        >
          {/* Level 1 (reference, bottom row) */}
          {duration > 0 && beatMap.level1.map(([start, end], i) => (
            <div key={`l1-${i}`} style={{
              position: 'absolute', top: '0', height: '16px',
              left: `${(start / duration) * 100}%`,
              width: `${((end - start) / duration) * 100}%`,
              background: LEVEL_COLORS.level1.bg,
              borderLeft: `1px solid ${LEVEL_COLORS.level1.border}`,
              borderRight: `1px solid ${LEVEL_COLORS.level1.border}`,
            }} />
          ))}

          {/* Level 2 (middle row) */}
          {duration > 0 && beatMap.level2.map(([start, end], i) => (
            <div key={`l2-${i}`} style={{
              position: 'absolute', top: '16px', height: '16px',
              left: `${(start / duration) * 100}%`,
              width: `${((end - start) / duration) * 100}%`,
              background: LEVEL_COLORS.level2.bg,
              borderLeft: `1px solid ${LEVEL_COLORS.level2.border}`,
              borderRight: `1px solid ${LEVEL_COLORS.level2.border}`,
            }} />
          ))}

          {/* Level 3 (bottom row) */}
          {duration > 0 && beatMap.level3.map(([start, end], i) => (
            <div key={`l3-${i}`} style={{
              position: 'absolute', top: '32px', height: '16px',
              left: `${(start / duration) * 100}%`,
              width: `${((end - start) / duration) * 100}%`,
              background: LEVEL_COLORS.level3.bg,
              borderLeft: `1px solid ${LEVEL_COLORS.level3.border}`,
              borderRight: `1px solid ${LEVEL_COLORS.level3.border}`,
            }} />
          ))}

          {/* Current recording interval (live) */}
          {isRecording && currentIntervalStart.current !== null && (
            <div style={{
              position: 'absolute',
              top: activeLevel === 'level2' ? '16px' : '32px',
              height: '16px',
              left: `${(currentIntervalStart.current / duration) * 100}%`,
              width: `${((currentTime - currentIntervalStart.current) / duration) * 100}%`,
              background: 'rgba(250, 204, 21, 0.5)',
              borderLeft: '2px solid rgba(250, 204, 21, 0.8)',
            }} />
          )}

          {/* Playhead */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${progress}%`, width: '2px',
            background: '#e2e8f0', zIndex: 2,
          }} />

          {/* Row labels */}
          <span style={{ position: 'absolute', right: 4, top: 0, fontSize: '0.55rem', color: LEVEL_COLORS.level1.label, opacity: 0.6 }}>L1</span>
          <span style={{ position: 'absolute', right: 4, top: 16, fontSize: '0.55rem', color: LEVEL_COLORS.level2.label, opacity: 0.6 }}>L2</span>
          <span style={{ position: 'absolute', right: 4, top: 32, fontSize: '0.55rem', color: LEVEL_COLORS.level3.label, opacity: 0.6 }}>L3</span>
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem', borderRadius: '999px', marginBottom: '1.5rem',
        fontSize: '0.875rem', fontWeight: 600,
        background: isRecording ? 'rgba(250, 204, 21, 0.15)' : `${activeLevelColor.bg}`,
        color: isRecording ? '#facc15' : activeLevelColor.label,
        border: `1px solid ${isRecording ? 'rgba(250, 204, 21, 0.3)' : activeLevelColor.border}`,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isRecording ? '#facc15' : activeLevelColor.label,
          animation: isRecording ? 'pulse 0.8s ease-in-out infinite' : 'none',
        }} />
        {isRecording
          ? `RECORDING ${activeLevel.toUpperCase()} — hold Space...`
          : `Ready — recording ${activeLevelColor.name} (hold Space)`
        }
      </div>

      {/* Recorded intervals list for active level */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: activeLevelColor.label }}>
          {activeLevelColor.name} Intervals ({activeIntervals.length})
        </h2>
        {activeIntervals.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No intervals recorded yet for this level.</p>
        ) : (
          <div style={{
            maxHeight: '200px', overflowY: 'auto',
            background: '#1e293b', borderRadius: '8px', padding: '0.75rem',
            fontSize: '0.8rem', fontFamily: 'monospace',
          }}>
            {activeIntervals.map(([start, end], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.25rem 0.5rem', borderBottom: '1px solid #334155',
              }}>
                <span style={{ color: activeLevelColor.label }}>#{i + 1}</span>
                <span>{formatTime(start)} → {formatTime(end)}</span>
                <span style={{ color: '#94a3b8' }}>({(end - start).toFixed(2)}s)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON preview */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full JSON Output</h2>
        <pre style={{
          background: '#1e293b', borderRadius: '8px', padding: '1rem',
          fontSize: '0.75rem', overflowX: 'auto', maxHeight: '200px',
          border: '1px solid #334155',
        }}>
          {JSON.stringify(beatMap, null, 2)}
        </pre>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

const formatTime = (t) => {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const ms = Math.floor((t % 1) * 100)
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

const kbdStyle = {
  background: '#334155', border: '1px solid #475569',
  borderRadius: '4px', padding: '2px 6px', fontFamily: 'monospace',
  fontSize: '0.8rem',
}

const btnStyle = {
  background: '#334155', border: '1px solid #475569',
  borderRadius: '8px', padding: '0.5rem 1rem',
  color: '#e2e8f0', cursor: 'pointer', fontSize: '0.875rem',
  fontWeight: 500, transition: 'all 0.2s',
}

export default BeatMapper
