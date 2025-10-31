<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// Load Leaflet from CDN when not available via npm
function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    // if already available, resolve immediately
    if ((window as any).L) return resolve((window as any).L)

    const cssHref = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    const scriptSrc = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

    // add CSS
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssHref
      document.head.appendChild(link)
    }

    // add script
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script')
      script.src = scriptSrc
      script.async = true
      script.onload = () => {
        if ((window as any).L) resolve((window as any).L)
        else reject(new Error('Leaflet failed to load'))
      }
      script.onerror = () => reject(new Error('Failed to load Leaflet script'))
      document.body.appendChild(script)
    } else {
      // already in DOM but not initialized yet
      const tryL = () => {
        if ((window as any).L) resolve((window as any).L)
        else setTimeout(tryL, 50)
      }
      tryL()
    }
  })
}

const props = defineProps<{
  stations: any[]
  routes: any[]
  editMode: boolean
  creatingRoute: boolean
}>()

const emit = defineEmits<{
  (e: 'map-click', latlng: { lat:number; lng:number }): void
  (e: 'station-drag', payload: { id:number; lat:number; lng:number }): void
  (e: 'station-click', station:any): void
  (e: 'add-to-route', station:any): void
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: any = null
let markers: Map<number, any> = new Map()
let polylines: any[] = []
let L: any = null

function buildIcon(color = '#e74c3c') {
  return L.divIcon({
    className: 'station-marker',
    html: `<div style="background:${color}; width:18px; height:18px; border-radius:50%; border:3px solid white;"></div>`,
    iconSize: [24,24]
  })
}

// keep references to event handlers so we can remove them
let focusHandler: any = null
let fitHandler: any = null

onMounted(async () => {
  try {
    L = (window as any).L || await loadLeaflet()
  } catch (e) {
    console.error('Leaflet load error', e)
    return
  }

  map = L.map(mapContainer.value as HTMLElement).setView([-14.2350, -51.9253], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

  map.on('click', (e:any) => {
    if (props.editMode || props.creatingRoute) emit('map-click', e.latlng)
  })

  // robust focus handler: wait until map is ready before calling setView
  focusHandler = (ev:any) => {
    const s = ev.detail
    if (!s) return
    const trySet = () => {
      if (!map) return setTimeout(trySet, 50)
      try {
        // ensure pane exists before setView
        if (map.getSize && map._panes) {
          map.setView([s.latitude, s.longitude], 10)
        } else {
          setTimeout(trySet, 50)
        }
      } catch (err) {
        console.warn('Failed to setView (retry):', err)
        setTimeout(trySet, 100)
      }
    }
    trySet()
  }

  fitHandler = (ev:any) => {
    const r = ev.detail
    if (!r || !r.estacoes || r.estacoes.length === 0) return
    const tryFit = () => {
      if (!map) return setTimeout(tryFit, 50)
      try {
        const coords = r.estacoes.map((e:any) => [e.latitude, e.longitude])
        if (coords.length) map.fitBounds(coords as any)
      } catch (err) {
        console.warn('Failed to fitBounds (retry):', err)
        setTimeout(tryFit, 100)
      }
    }
    tryFit()
  }

  window.addEventListener('focus-station', focusHandler)
  window.addEventListener('fit-route', fitHandler)
})

onBeforeUnmount(() => {
  if (map) map.remove()
  if (focusHandler) window.removeEventListener('focus-station', focusHandler)
  if (fitHandler) window.removeEventListener('fit-route', fitHandler)
})

function clearMarkers() {
  markers.forEach(m => m.remove())
  markers.clear()
}

function clearPolylines() {
  polylines.forEach(l => l.remove())
  polylines = []
}

watch(() => props.stations, (newStations) => {
  if (!map || !L) return
  clearMarkers()
  newStations.forEach(st => {
    const marker = L.marker([st.latitude, st.longitude], { draggable: Boolean(props.editMode), icon: buildIcon() }).addTo(map as any)
    marker.on('click', () => {
      emit('station-click', st)
      if (props.creatingRoute) emit('add-to-route', st)
    })
    marker.on('dragend', (e:any) => {
      const latlng = e.target.getLatLng()
      emit('station-drag', { id: st.id, lat: latlng.lat, lng: latlng.lng })
    })
    markers.set(st.id, marker)
  })
}, { deep: true, immediate: true })

watch(() => props.routes, (newRoutes) => {
  if (!map || !L) return
  clearPolylines()
  newRoutes.forEach(r => {
    const coords = (r.estacoes || []).map((e:any) => [e.latitude, e.longitude])
    if (coords.length > 1) {
      const line = L.polyline(coords as any, { color: '#333', weight:6, opacity:0.8, dashArray: '10,10' }).addTo(map as any)
      polylines.push(line)
      const shadow = L.polyline(coords as any, { color:'#e74c3c', weight:8, opacity:0.3 }).addTo(map as any)
      polylines.push(shadow)
    }
  })
}, { deep: true, immediate: true })
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container { width:70%; height:50vh; border-radius:12px; box-shadow:0 2px 16px rgba(0,0,0,0.06); position:relative; z-index:0; margin: auto; }
/* ensure leaflet popups and controls appear above map but below modals */
.leaflet-container .leaflet-control { z-index: 400 !important; }

@media (max-width: 768px) {
  .map-container { width:100%; height:45vh; }
}
</style>