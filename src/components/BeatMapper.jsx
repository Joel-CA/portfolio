import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * BeatMapper — Dev tool for recording beat intervals.
 *
 * Usage:
 *   1. Navigate to /beat-mapper
 *   2. Click Play to start the song
 *   3. HOLD Spacebar during "spinning" sections, RELEASE during quiet sections
 *   4. Click "Copy JSON" to get the beat map
 *   5. Paste into public/assets/audio/beatmap.json
 */
const BeatMapper = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false) // is spacebar held?
  const [intervals, setIntervals] = useState([]) // completed intervals
  const currentIntervalStart = useRef(null)
  const animFrameRef = useRef(null)

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
      // Start recording an interval
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
        if (end > start + 0.05) { // ignore tiny accidental taps
          setIntervals(prev => [...prev, [
            Math.round(start * 100) / 100,
            Math.round(end * 100) / 100
          ]])
        }
        currentIntervalStart.current = null
      }
      setIsRecording(false)
    }
  }, [])

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
    setIntervals([])
    setIsRecording(false)
    currentIntervalStart.current = null
  }

  const copyJSON = () => {
    const json = JSON.stringify(intervals, null, 2)
    navigator.clipboard.writeText(json)
    alert('Beat map JSON copied to clipboard!')
  }

  const undoLast = () => {
    setIntervals(prev => prev.slice(0, -1))
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

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
      <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Hold <kbd style={kbdStyle}>Space</kbd> during beat-drop sections. Release during quiet parts.
      </p>

      <audio
        ref={audioRef}
        src="./assets/audio/party-cat.mp3"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={togglePlay} style={btnStyle}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={restart} style={btnStyle}>⏮ Restart & Clear</button>
        <button onClick={undoLast} style={btnStyle} disabled={intervals.length === 0}>
          ↩ Undo Last
        </button>
        <button onClick={copyJSON} style={{ ...btnStyle, background: '#7c3aed' }} disabled={intervals.length === 0}>
          📋 Copy JSON
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div style={{
          position: 'relative', height: '24px', background: '#1e293b',
          borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
        }}
          onClick={(e) => {
            if (!audioRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            audioRef.current.currentTime = pct * duration
          }}
        >
          {/* Recorded intervals as green blocks on the timeline */}
          {intervals.map(([start, end], i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(start / duration) * 100}%`,
              width: `${((end - start) / duration) * 100}%`,
              background: 'rgba(74, 222, 128, 0.4)',
              borderLeft: '1px solid rgba(74, 222, 128, 0.7)',
              borderRight: '1px solid rgba(74, 222, 128, 0.7)',
            }} />
          ))}

          {/* Current recording interval (live) */}
          {isRecording && currentIntervalStart.current !== null && (
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
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
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem', borderRadius: '999px', marginBottom: '1.5rem',
        fontSize: '0.875rem', fontWeight: 600,
        background: isRecording ? 'rgba(250, 204, 21, 0.15)' : 'rgba(100, 116, 139, 0.15)',
        color: isRecording ? '#facc15' : '#94a3b8',
        border: `1px solid ${isRecording ? 'rgba(250, 204, 21, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: isRecording ? '#facc15' : '#64748b',
          animation: isRecording ? 'pulse 0.8s ease-in-out infinite' : 'none',
        }} />
        {isRecording ? 'RECORDING — hold Space...' : 'Ready — hold Space to mark beats'}
      </div>

      {/* Recorded intervals list */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Recorded Intervals ({intervals.length})
        </h2>
        {intervals.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No intervals recorded yet.</p>
        ) : (
          <div style={{
            maxHeight: '300px', overflowY: 'auto',
            background: '#1e293b', borderRadius: '8px', padding: '0.75rem',
            fontSize: '0.8rem', fontFamily: 'monospace',
          }}>
            {intervals.map(([start, end], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.25rem 0.5rem', borderBottom: '1px solid #334155',
              }}>
                <span style={{ color: '#4ade80' }}>#{i + 1}</span>
                <span>{formatTime(start)} → {formatTime(end)}</span>
                <span style={{ color: '#94a3b8' }}>({(end - start).toFixed(2)}s)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON preview */}
      {intervals.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>JSON Output</h2>
          <pre style={{
            background: '#1e293b', borderRadius: '8px', padding: '1rem',
            fontSize: '0.75rem', overflowX: 'auto', maxHeight: '200px',
            border: '1px solid #334155',
          }}>
            {JSON.stringify(intervals, null, 2)}
          </pre>
        </div>
      )}

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
