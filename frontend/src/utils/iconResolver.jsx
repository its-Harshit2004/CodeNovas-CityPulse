import React from 'react';
import {
  Droplets, CloudRain, Car, Siren, TriangleAlert, Wind, Flame, Construction,
  TrafficCone, CloudFog, Factory, Zap, Activity, MapPin, ShieldAlert,
  Calendar, Ambulance, Waves, Thermometer, AlertTriangle, LayoutDashboard,
  LineChart, AlertCircle
} from 'lucide-react';

const iconMap = {
  'droplets': Droplets,
  'cloud-rain': CloudRain,
  'cloud_rain': CloudRain,
  'car': Car,
  'siren': Siren,
  'triangle-alert': TriangleAlert,
  'triangle_alert': TriangleAlert,
  'alert-triangle': AlertTriangle,
  'alert_triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'alert_circle': AlertCircle,
  'wind': Wind,
  'flame': Flame,
  'construction': Construction,
  'traffic-cone': TrafficCone,
  'traffic_cone': TrafficCone,
  'cloud-fog': CloudFog,
  'cloud_fog': CloudFog,
  'factory': Factory,
  'zap': Zap,
  'activity': Activity,
  'map-pin': MapPin,
  'map_pin': MapPin,
  'shield-alert': ShieldAlert,
  'shield_alert': ShieldAlert,
  'calendar': Calendar,
  'ambulance': Ambulance,
  'waves': Waves,
  'thermometer': Thermometer,
  'layout-dashboard': LayoutDashboard,
  'layout_dashboard': LayoutDashboard,
  'line-chart': LineChart,
  'line_chart': LineChart
};

export const resolveIcon = (name, type = 'signal') => {
  if (!name) return type === 'event' ? MapPin : Activity;
  if (typeof name !== 'string') {
    // Already a component (function or object with $$typeof)
    if (typeof name === 'function' || (typeof name === 'object' && name.$$typeof)) {
      return name;
    }
    return type === 'event' ? MapPin : Activity;
  }
  
  const normalized = name.toLowerCase();
  return iconMap[normalized] || (type === 'event' ? MapPin : Activity);
};

export const DynamicIcon = ({ name, type = 'signal', ...props }) => {
  const IconComponent = resolveIcon(name, type);
  return <IconComponent {...props} />;
};
