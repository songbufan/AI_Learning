import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * 底部输入区域背后的 Three.js 3D 装饰：托盘 + 发送区立体块，轻微动画。
 * 画布不接收指针事件，由上层表单交互。
 */
export function InputDock3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 1.15, 7)
    camera.lookAt(0, -0.08, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const dock = new THREE.Group()
    dock.rotation.x = -0.15

    const trayGeo = new THREE.BoxGeometry(5.8, 0.2, 0.74)
    const trayMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8f0e8,
      metalness: 0.18,
      roughness: 0.42,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
    })
    const tray = new THREE.Mesh(trayGeo, trayMat)
    tray.position.y = -0.1
    dock.add(tray)

    const sendGeo = new THREE.BoxGeometry(1.08, 0.3, 0.74)
    const sendMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0x047857,
      emissiveIntensity: 0.18,
    })
    const sendMesh = new THREE.Mesh(sendGeo, sendMat)
    sendMesh.position.set(2.32, 0.02, 0)
    dock.add(sendMesh)

    const rimGeo = new THREE.BoxGeometry(5.6, 0.06, 0.78)
    const rimMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.15,
      roughness: 0.45,
    })
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.position.set(0, 0.1, 0)
    dock.add(rim)

    scene.add(dock)

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    const key = new THREE.DirectionalLight(0xffffff, 0.9)
    key.position.set(5, 9, 6)
    const fill = new THREE.DirectionalLight(0xb8e8d4, 0.35)
    fill.position.set(-5, 4, -3)
    scene.add(ambient, key, fill)

    mount.appendChild(renderer.domElement)

    let rafId = 0
    let lastW = 0
    let lastH = 0

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      const t = performance.now() * 0.001
      dock.rotation.y = Math.sin(t * 0.38) * 0.048
      dock.rotation.z = Math.sin(t * 0.22) * 0.018

      const rect = mount.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      if (w !== lastW || h !== lastH) {
        lastW = w
        lastH = h
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      renderer.render(scene, camera)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      renderer.dispose()
      trayGeo.dispose()
      trayMat.dispose()
      sendGeo.dispose()
      sendMat.dispose()
      rimGeo.dispose()
      rimMat.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="h-full w-full" />
}
