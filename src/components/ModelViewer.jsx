import { useRef, useEffect, useMemo, useState, forwardRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import * as THREE from 'three'

/**
 * Inner component that loads and renders the OBJ model with MTL materials.
 * Automatically centers and scales the model to fit the viewport.
 */
// forwardRef so TransformControls in the parent can attach to the group node
const OBJModel = forwardRef(function OBJModel({ objPath, mtlPath, autoRotate, partyMode, audioRef }, ref) {
  const groupRef = useRef()

  // Expose the internal group via the forwarded ref
  useEffect(() => {
    if (ref) ref.current = groupRef.current
  })

  // Derive the base path (directory) from the MTL path so texture references resolve
  const basePath = mtlPath.substring(0, mtlPath.lastIndexOf('/') + 1)

  // Load materials first, setting the resource path to the model's directory
  const materials = useLoader(MTLLoader, mtlPath, (loader) => {
    loader.setResourcePath(basePath)
  })

  // Load the OBJ with materials applied
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })

  // Clone the object so React strict mode doesn't cause issues
  const scene = useMemo(() => {
    const cloned = obj.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((mat) => {
            mat.side = THREE.DoubleSide
            if (mat.map) {
              mat.map.colorSpace = THREE.SRGBColorSpace
              mat.map.anisotropy = 16
            }
          })
        }
      }
    })

    return cloned
  }, [obj])

  // Bake center-of-mass into the geometry vertices so the group origin IS the pivot.
  // Using geometry.translate() rather than offsetting group.position ensures
  // TransformControls and auto-rotation both pivot around the true center.
  useEffect(() => {
    if (!groupRef.current) return

    // Step 1: compute world-space bounding box of the fully-assembled model
    const box = new THREE.Box3().setFromObject(groupRef.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // Step 2: bake the centering offset into every mesh's geometry vertices
    // This shifts the geometry so (0,0,0) is the bounding-box center
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.geometry.translate(-center.x, -center.y, -center.z)
      }
    })

    // Step 3: reset group position/rotation to identity (clean pivot)
    groupRef.current.position.set(0, 0, 0)

    // Step 4: uniform scale so the longest axis fits ~2.5 units
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 2.5 / maxDim
      groupRef.current.scale.setScalar(scale)
    }
  }, [scene])

  // Load the beat map once on mount
  const [beatMap, setBeatMap] = useState([])
  useEffect(() => {
    fetch('./assets/audio/beatmap.json')
      .then(res => res.json())
      .then(data => setBeatMap(data))
      .catch(() => console.warn('No beatmap.json found — party mode will animate continuously'))
  }, [])

  // Smoothed amplitude for lerping animation on/off
  const smoothAmplitude = useRef(0)

  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (partyMode) {
      let target = 0

      if (audioRef?.current && beatMap.length > 0) {
        const t = audioRef.current.currentTime
        // Check if the current playback time falls within any beat interval
        const inBeat = beatMap.some(([start, end]) => t >= start && t <= end)
        target = inBeat ? 1.5 : 0
      } else {
        // No beat map loaded — animate at full intensity as fallback
        target = 1
      }

      if (target > 0) {
        // In a beat — ramp up quickly
        smoothAmplitude.current = THREE.MathUtils.lerp(smoothAmplitude.current, target, 0.4)

        const amp = smoothAmplitude.current
        const time = _.clock.elapsedTime

        // 1. Spin rapidly
        groupRef.current.rotation.y += delta * 14 * amp

        // 2. Bounce rhythmically
        groupRef.current.position.y = Math.abs(Math.sin(time * 12)) * 0.3 * amp

        // 3. Cycle colors
        groupRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material]
            mats.forEach((mat) => {
              if (!mat.userData.originalColor) {
                mat.userData.originalColor = mat.color.clone()
              }
              mat.color.setHSL(((time * 0.5) + (amp * 0.15)) % 1, 1, 0.6)
            })
          }
        })
      } else {
        // Beat ended — INSTANT snap back
        smoothAmplitude.current = 0
        groupRef.current.position.y = 0
        groupRef.current.rotation.y = 0 // face camera

        // Instantly restore original colors
        groupRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material]
            mats.forEach((mat) => {
              if (mat.userData.originalColor) {
                mat.color.copy(mat.userData.originalColor)
                delete mat.userData.originalColor
              }
            })
          }
        })
      }
    } else {
      // Restore normal state
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1)

      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((mat) => {
            if (mat.userData.originalColor) {
              mat.color.copy(mat.userData.originalColor)
              delete mat.userData.originalColor // Only restore once
            }
          })
        }
      })

      // Normal auto-rotate (disabled while a transform gizmo is active)
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.3
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
})

/**
 * Loading spinner component rendered as an HTML overlay
 */
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-xl z-10">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin"
        />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent border-b-primary-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      <p className="text-slate-400 text-sm mt-4 font-medium">Loading 3D model…</p>
    </div>
  )
}

/**
 * Controls hint overlay
 */
function ControlsHint({ transformMode }) {
  const modeLabel = transformMode === 'translate'
    ? '⬛ Move (W)'
    : transformMode === 'rotate'
      ? '↻ Rotate (E)'
      : transformMode === 'scale'
        ? '⤢ Scale (R)'
        : null

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-1.5">
      {modeLabel && (
        <div className="bg-primary-700/80 backdrop-blur-sm text-primary-200 text-xs px-3 py-1 rounded-full border border-primary-500/50 font-medium">
          {modeLabel}
        </div>
      )}
      <div className="bg-slate-950/70 backdrop-blur-sm text-slate-400 text-xs px-4 py-2 rounded-full border border-slate-700/50 whitespace-nowrap">
        {transformMode ? (
          <>
            Drag gizmo to transform
            <span className="hidden sm:inline"> &middot; Q to exit</span>
          </>
        ) : (
          <>
            Drag to orbit
            <span className="hidden sm:inline"> &middot; Scroll to zoom &middot; W/E/R to transform</span>
          </>
        )}
      </div>
    </div>
  )
}

export { OBJModel, LoadingSpinner, ControlsHint }
