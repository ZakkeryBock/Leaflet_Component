export default {
  editor: {
    label: {
      en: 'Leaflet Map',
    },
    icon: 'fontawesome/solid/map-marked-alt',
  },
  properties: {
    center: {
      label: { en: 'Center Coordinates' },
      type: 'Array',
      defaultValue: [51.505, -0.09],
      bindable: true,
    },
    zoom: {
      label: { en: 'Zoom Level' },
      type: 'Number',
      defaultValue: 13,
      bindable: true,
    },
    markers: {
      label: { en: 'Markers' },
      type: 'Array',
      defaultValue: [],
      bindable: true,
    },
    height: {
      label: { en: 'Height' },
      type: 'Length',
      defaultValue: '400px',
      bindable: true,
    },
    width: {
      label: { en: 'Width' },
      type: 'Length',
      defaultValue: '100%',
      bindable: true,
    },
  },
};