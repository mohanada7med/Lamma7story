/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BRAND_COLORS = {
  primaryGreen: '#2E7D32',
  secondaryGreen: '#66BB6A',
  soilBrown: '#795548',
  cleanWhite: '#FFFFFF',
  deepForest: '#0E1A12',
  earthOlive: '#1B2E21',
  botanicalGreen: '#2D6A4F',
  leafGreen: '#52B788',
  electricLime: '#39FF14',
  electricGreen: '#00FF66',
  cream: '#FAF6F0',
  sand: '#E9E3D8',
  darkOverlay: 'rgba(14, 26, 18, 0.82)',
  charcoal: '#1A241E',
  amberSoil: '#8D6E63',
  lightGray: '#F5F5F5'
};

export const COLOR_SWATCHES = [
  { name: 'أخضر لَمّاح الأساسي', hex: '#2E7D32' },
  { name: 'أخضر نضِر', hex: '#66BB6A' },
  { name: 'بني التربة', hex: '#795548' },
  { name: 'أخضر الغابة العميقة', hex: '#0E1A12' },
  { name: 'زيتوني حقلي', hex: '#1B2E21' },
  { name: 'أخضر نباتي', hex: '#2D6A4F' },
  { name: 'أخضر الورقة', hex: '#52B788' },
  { name: 'رؤية ليزرية', hex: '#39FF14' },
  { name: 'أبيض ناصع', hex: '#FFFFFF' },
  { name: 'كريمي دافئ', hex: '#FAF6F0' },
  { name: 'رمال الحقل', hex: '#E9E3D8' },
  { name: 'تربة غنية', hex: '#4E342E' },
  { name: 'فحمي تقني', hex: '#141E17' },
  { name: 'أصفر الحصاد', hex: '#F9A825' },
  { name: 'رمادي فاتح', hex: '#E0E0E0' },
  { name: 'أسود فحمي', hex: '#050A07' }
];

export const GRADIENT_PRESETS = [
  {
    name: 'الغابة والتربة',
    angle: 180,
    stops: [
      { offset: 0, color: '#0E1A12' },
      { offset: 0.7, color: '#1B2E21' },
      { offset: 1, color: '#4E342E' }
    ]
  },
  {
    name: 'الرؤية الحاسوبية',
    angle: 135,
    stops: [
      { offset: 0, color: '#0E1A12' },
      { offset: 0.5, color: '#1B2E21' },
      { offset: 1, color: '#2D6A4F' }
    ]
  },
  {
    name: 'أوراق الشجر النضرة',
    angle: 160,
    stops: [
      { offset: 0, color: '#2E7D32' },
      { offset: 1, color: '#1B2E21' }
    ]
  },
  {
    name: 'تربة ونماء',
    angle: 145,
    stops: [
      { offset: 0, color: '#795548' },
      { offset: 0.6, color: '#4E342E' },
      { offset: 1, color: '#0E1A12' }
    ]
  },
  {
    name: 'أبيض مينيمال عصري',
    angle: 180,
    stops: [
      { offset: 0, color: '#FAF6F0' },
      { offset: 1, color: '#E9E3D8' }
    ]
  },
  {
    name: 'إلكترونيات الحقل',
    angle: 180,
    stops: [
      { offset: 0, color: '#0A120D' },
      { offset: 1, color: '#153123' }
    ]
  }
];

export const PRESET_BACKGROUND_IMAGES = [
  {
    id: 'plant_leaf',
    name: 'ورقة نبات مقربة',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1080&q=80',
    category: 'نباتات'
  },
  {
    id: 'agri_field',
    name: 'حقل زراعي شاسع',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1080&q=80',
    category: 'حقول'
  },
  {
    id: 'robotics_circuit',
    name: 'لوحة تحكم إلكترونية',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80',
    category: 'تقنية'
  },
  {
    id: 'ai_code',
    name: 'شاشة برمجة وذكاء اصطناعي',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1080&q=80',
    category: 'تقنية'
  },
  {
    id: 'greenhouse',
    name: 'صوبة زراعية حديثة',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1080&q=80',
    category: 'بيوت محمية'
  },
  {
    id: 'soil_hands',
    name: 'تربة وبذرة نماء',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1080&q=80',
    category: 'تربة'
  }
];

export const BOTANICAL_PATHS: Record<string, { viewBox: string; path: string; label: string }> = {
  leaf_single: {
    viewBox: '0 0 100 100',
    path: 'M50 10 C20 40 20 80 50 90 C80 80 80 40 50 10 Z M50 10 L50 90',
    label: 'ورقة نباتية نقية'
  },
  sprout: {
    viewBox: '0 0 100 100',
    path: 'M50 90 C50 60 50 40 50 30 M50 35 C35 25 20 40 30 55 C40 60 48 50 50 35 Z M50 45 C65 35 80 50 70 65 C60 70 52 60 50 45 Z',
    label: 'برعم نبتة صاعدة'
  },
  branch: {
    viewBox: '0 0 100 100',
    path: 'M20 90 Q40 50 80 15 M40 65 Q25 55 30 45 Q45 50 45 60 M55 45 Q70 35 75 45 Q65 55 58 50 M65 30 Q50 20 55 12 Q70 18 68 28',
    label: 'غصن زراعي'
  },
  seedling: {
    viewBox: '0 0 100 100',
    path: 'M25 85 Q50 75 75 85 M50 78 L50 45 M50 45 C35 30 35 15 50 25 C65 15 65 30 50 45 Z',
    label: 'شتلة وخط التربة'
  },
  wheat: {
    viewBox: '0 0 100 100',
    path: 'M50 95 L50 15 M50 20 C42 15 38 25 50 32 C62 25 58 15 50 20 Z M50 35 C38 30 35 42 50 48 C65 42 62 30 50 35 Z M50 52 C38 48 35 60 50 66 C65 60 62 48 50 52 Z M50 70 C40 66 38 78 50 82 C62 78 60 66 50 70 Z',
    label: 'سنبلة قمح مصرية'
  },
  circuit_leaf: {
    viewBox: '0 0 100 100',
    path: 'M50 10 C25 35 25 75 50 90 C75 75 75 35 50 10 Z M50 25 L50 80 M50 35 L35 45 M35 45 L25 45 M50 50 L65 40 M65 40 L75 40 M50 65 L35 72 M50 70 L65 77',
    label: 'ورقة ذكية مدمجة بشرائح'
  },
  plant_cross: {
    viewBox: '0 0 100 100',
    path: 'M50 15 L50 85 M15 50 L85 50 M35 35 Q50 20 65 35 Q50 50 35 35 Z M35 65 Q50 50 65 65 Q50 80 35 65 Z',
    label: 'مستشعر هندسي نباتي'
  }
};
