import { useState, Suspense, useCallback, useRef, useEffect, useMemo, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RotateCw, RotateCcw, Box, AlertTriangle } from 'lucide-react'
import { OBJModel, LoadingSpinner, ControlsHint } from './ModelViewer'

// ============================================================
// 🔧 MODEL DATA — Edit this array to add your Kiri Engine scans
// ============================================================
const scans = [
  {
    id: 1,
    title: 'My First Scan',
    description: 'Captured with Kiri Engine',
    objPath: './assets/models/my-scan-1/model.obj',
    mtlPath: './assets/models/my-scan-1/model.mtl',
    thumbnail: './assets/models/my-scan-1/3DModel.jpg',
  },
]

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext
  } catch {
    return false
  }
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.warn('3D Viewer error:', error, info) }
  render() {
    return this.state.hasError ? (this.props.fallback || null) : this.props.children
  }
}

function WebGLFallback({ scan }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl z-10 p-4 text-center">
      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3">
        <AlertTriangle size={20} className="text-amber-400" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200 mb-1">3D Viewer Unavailable</h4>
      <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed mb-2">
        WebGL is required but isn't available.
      </p>
      {scan?.thumbnail && (
        <div className="w-full max-w-[160px] rounded-lg overflow-hidden border border-slate-700 mt-2">
          <img src={scan.thumbnail} alt={scan.title} className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  )
}

/**
 * Animated floating label that hovers above the model with a connector stem.
 * Uses drei's Html so the badge is always screen-facing (billboard).
 */
function FloatingLabel({ position = [0, 1.6, 0], label = 'Cowboy the cat', hidden = false, stemLength = 0.55 }) {
  const groupRef = useRef()

  // Sine-wave float: drifts up and down ~0.12 units at ~0.6 Hz
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2) * 0.12
    }
  })

  // Stem geometry — a thin vertical line from model surface to label
  const stemPoints = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -stemLength, 0)]
    return pts
  }, [stemLength])

  const stemGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(stemPoints)
    return geo
  }, [stemPoints])

  const stemMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#a78bfa', opacity: 0.7, transparent: true })
  }, [])

  return (
    <group ref={groupRef} position={position}>
      {/* Connector stem */}
      <primitive object={new THREE.Line(stemGeometry, stemMaterial)} />

      {/* Dot at attachment point */}
      <mesh position={[0, -stemLength, 0]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.6} />
      </mesh>

      {/* HTML label badge — always faces camera */}
      <Html
        center
        distanceFactor={5}
        style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: 'none' }}
      >
        <div className="floating-label-container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.85), rgba(109,40,217,0.85))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(167,139,250,0.5)',
          borderRadius: '999px',
          padding: '4px 12px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 24px rgba(124,58,237,0.4), 0 0 0 1px rgba(167,139,250,0.15)',
          animation: 'labelPulse 2.5s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '11px', marginRight: '2px' }}>🐱</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#ede9fe',
            letterSpacing: '0.02em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {label}
          </span>
        </div>
        {/* Inject keyframe animation and responsive scaling into the document once */}
        <style>{`
          @keyframes labelPulse {
            0%, 100% { box-shadow: 0 4px 24px rgba(124,58,237,0.4), 0 0 0 1px rgba(167,139,250,0.15); }
            50% { box-shadow: 0 4px 32px rgba(124,58,237,0.7), 0 0 0 2px rgba(167,139,250,0.35); }
          }
          
          /* Scale down the label on mobile screens */
          @media (max-width: 640px) {
            .floating-label-container {
              transform: scale(0.7);
              transform-origin: bottom center;
            }
          }
        `}</style>
      </Html>
    </group>
  )
}

/**
 * Inner scene component that has access to the R3F renderer context.
 * Handles TransformControls + OrbitControls coordination.
 */
function SceneContents({ selectedScan, autoRotate, transformMode, partyMode, audioRef }) {
  const modelRef = useRef()
  const orbitRef = useRef()

  // Disable OrbitControls while dragging the transform gizmo
  const handleTransformStart = useCallback(() => {
    if (orbitRef.current) orbitRef.current.enabled = false
  }, [])
  const handleTransformEnd = useCallback(() => {
    if (orbitRef.current) orbitRef.current.enabled = true
  }, [])

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 5, -3]} intensity={0.6} color="#b0c4ff" />
      <directionalLight position={[0, -3, 5]} intensity={0.3} color="#ffd4a0" />

      <OBJModel
        ref={modelRef}
        key={selectedScan.id}
        objPath={selectedScan.objPath}
        mtlPath={selectedScan.mtlPath}
        autoRotate={autoRotate && !transformMode}
        partyMode={partyMode}
        audioRef={audioRef}
      />

      {/* Floating 3D label */}
      <FloatingLabel
        position={[0.4, 0.9, 0]}
        stemLength={0.75}
        label="Cowboy the cat"
        hidden={!!transformMode}
      />

      {/* TransformControls — only rendered when a mode is active */}
      {transformMode && modelRef.current && (
        <TransformControls
          object={modelRef.current}
          mode={transformMode}
          onMouseDown={handleTransformStart}
          onMouseUp={handleTransformEnd}
        />
      )}

      <gridHelper args={[6, 12, '#2a2f45', '#222738']} position={[0, -1.3, 0]} />

      <OrbitControls
        ref={orbitRef}
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  )
}

const ThreeDViewer = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [partyMode, setPartyMode] = useState(false)
  // null = orbit mode; 'translate' | 'rotate' | 'scale' = transform mode
  const [transformMode, setTransformMode] = useState(null)
  const webGLSupported = isWebGLAvailable()
  const selectedScan = scans[selectedIndex] || null
  const audioRef = useRef(null)

  // Handle party mode audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (partyMode) {
        audioRef.current.volume = 0.5
        audioRef.current.play().catch(e => console.warn('Audio play failed:', e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [partyMode])

  // Maya hotkeys: W=move, E=rotate, R=scale, Q=exit transform mode
  useEffect(() => {
    const handleKey = (e) => {
      // Don't hijack keys when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      switch (e.key.toLowerCase()) {
        case 'w':
          setTransformMode((prev) => prev === 'translate' ? null : 'translate')
          setAutoRotate(false)
          break
        case 'e':
          setTransformMode((prev) => prev === 'rotate' ? null : 'rotate')
          setAutoRotate(false)
          break
        case 'r':
          setTransformMode((prev) => prev === 'scale' ? null : 'scale')
          setAutoRotate(false)
          break
        case 'q':
        case 'escape':
          setTransformMode(null)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (scans.length === 0) {
    return (
      <div className="card-base p-6 text-center w-full">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary-700/20 flex items-center justify-center">
          <Box size={24} className="text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Models Coming Soon</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          3D photogrammetry scans will be showcased here.
        </p>
      </div>
    )
  }

  return (
    <div className="card-base overflow-hidden w-full">
      {/* 3D Canvas */}
      <div className="relative aspect-video sm:aspect-[21/9] bg-gradient-to-b from-slate-800 to-slate-900">
        {!webGLSupported ? (
          <WebGLFallback scan={selectedScan} />
        ) : (
          <WebGLErrorBoundary fallback={<WebGLFallback scan={selectedScan} />}>
            <Suspense fallback={<LoadingSpinner />}>
              {selectedScan && (
                <Canvas
                  camera={{ position: [0, 1, 4], fov: 45 }}
                  gl={{ antialias: true, preserveDrawingBuffer: true }}
                  dpr={[1, 1.5]}
                  style={{ borderRadius: 'inherit' }}
                  onCreated={({ scene }) => {
                    scene.background = new THREE.Color('#1a1e2e')
                  }}
                >
                  <SceneContents
                    selectedScan={selectedScan}
                    autoRotate={autoRotate}
                    transformMode={transformMode}
                    partyMode={partyMode}
                    audioRef={audioRef}
                  />
                </Canvas>
              )}
            </Suspense>
          </WebGLErrorBoundary>
        )}

        {webGLSupported && <ControlsHint transformMode={transformMode} />}

        {/* Transform mode indicator badges */}
        {webGLSupported && (
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            {[
              { key: 'W', label: 'Move', mode: 'translate' },
              { key: 'E', label: 'Rotate', mode: 'rotate' },
              { key: 'R', label: 'Scale', mode: 'scale' },
            ].map(({ key, label, mode }) => (
              <button
                key={mode}
                onClick={() => {
                  setTransformMode((prev) => prev === mode ? null : mode)
                  if (mode !== null) setAutoRotate(false)
                }}
                className={`text-xs font-semibold px-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-200 ${
                  transformMode === mode
                    ? 'bg-primary-600/70 border-primary-400/80 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
                title={`${key} — ${label}`}
              >
                <span className="opacity-60 mr-0.5">{key}</span> {label}
              </button>
            ))}
            {transformMode && (
              <button
                onClick={() => setTransformMode(null)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border backdrop-blur-sm bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                title="Q — Exit transform"
              >
                <span className="opacity-60 mr-0.5">Q</span> Exit
              </button>
            )}
          </div>
        )}

        {/* Auto-rotate and Party toggle buttons */}
        {webGLSupported && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={() => {
                setPartyMode((prev) => !prev)
                if (!partyMode) {
                  setAutoRotate(true)
                  setTransformMode(null)
                }
              }}
              className={`p-2 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                partyMode
                  ? 'bg-fuchsia-600/80 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/30 scale-110 animate-pulse'
                  : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:scale-105'
              }`}
              title={partyMode ? 'Stop Party Mode' : 'Start Party Mode'}
            >
              <span className="text-sm">🎉</span>
            </button>

            <button
              onClick={() => {
                setAutoRotate((prev) => !prev)
                if (!autoRotate) setTransformMode(null)
                if (partyMode) setPartyMode(false)
              }}
              className={`p-2 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                autoRotate && !transformMode
                  ? 'bg-primary-700/30 border-primary-500/50 text-primary-400 shadow-lg shadow-primary-500/10'
                  : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
              title={autoRotate ? 'Stop auto-rotate' : 'Start auto-rotate'}
            >
              {autoRotate && !transformMode ? <RotateCw size={16} /> : <RotateCcw size={16} />}
            </button>
          </div>
        )}
      </div>

      {/* Hidden audio player for party mode */}
      <audio ref={audioRef} src="./assets/audio/party-cat.mp3" onEnded={() => setPartyMode(false)} />
    </div>
  )
}

export default ThreeDViewer
