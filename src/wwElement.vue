<template>
  <div ref="mapContainer" class="leaflet-map-container" :style="containerStyle"></div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      map: null,
      markerInstances: [],
      leafletLoaded: false,
    };
  },
  computed: {
    containerStyle() {
      return {
        height: this.content.height || '400px',
        width: this.content.width || '100%',
      };
    },
  },
  mounted() {
    console.log('Component mounted, content:', this.content);
    this.initMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  watch: {
    'content.center': {
      handler(newCenter) {
        if (this.map && newCenter) {
          this.map.setView(newCenter, this.content.zoom || 13);
        }
      },
      deep: true,
    },
    'content.zoom'(newZoom) {
      if (this.map) {
        this.map.setZoom(newZoom);
      }
    },
    'content.markers': {
      handler() {
        this.updateMarkers();
      },
      deep: true,
    },
  },
  methods: {
    async initMap() {
      try {
        console.log('Loading Leaflet...');
        await this.loadLeaflet();
        console.log('Leaflet loaded, window.L:', window.L);
        
        if (!this.$refs.mapContainer) {
          console.error('Map container ref not found');
          return;
        }
        
        console.log('Map container found:', this.$refs.mapContainer);

        const center = this.content.center || [51.505, -0.09];
        const zoom = this.content.zoom || 13;
        
        console.log('Creating map with center:', center, 'zoom:', zoom);

        this.map = L.map(this.$refs.mapContainer, {
          scrollWheelZoom: this.content.scrollWheelZoom !== false,
          dragging: this.content.dragging !== false,
        }).setView(center, zoom);
        
        console.log('Map created:', this.map);

        const tileLayer = this.content.tileLayer || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = this.content.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        L.tileLayer(tileLayer, {
          attribution: attribution,
          maxZoom: 19,
        }).addTo(this.map);
        
        console.log('Tile layer added');

        this.updateMarkers();
        console.log('Map initialization complete');
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
    async loadLeaflet() {
      if (this.leafletLoaded || window.L) {
        console.log('Leaflet already loaded');
        this.leafletLoaded = true;
        return;
      }

      console.log('Loading Leaflet CSS...');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      console.log('Loading Leaflet JS...');
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
          console.log('Leaflet JS loaded successfully');
          this.leafletLoaded = true;
          resolve();
        };
        script.onerror = (error) => {
          console.error('Failed to load Leaflet JS:', error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    },
    updateMarkers() {
      if (!this.map) return;

      this.markerInstances.forEach(marker => marker.remove());
      this.markerInstances = [];

      const markers = this.content.markers || [];
      
      markers.forEach(markerData => {
        if (!markerData.lat || !markerData.lng) return;
        
        const marker = L.marker([markerData.lat, markerData.lng]);
        
        if (markerData.popup) {
          marker.bindPopup(markerData.popup);
        }
        
        marker.addTo(this.map);
        this.markerInstances.push(marker);
      });
    },
  },
};
</script>

<style scoped>
.leaflet-map-container {
  position: relative;
  z-index: 0;
  background-color: #e0e0e0;
  min-height: 300px;
}
</style>