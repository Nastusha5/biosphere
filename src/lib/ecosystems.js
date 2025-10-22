import desertData from './ecosystems/desert';
import savannahData from './ecosystems/savannah';
import oceanData from './ecosystems/ocean';
import tropicalForestsData from './ecosystems/tropical-forests';
import swampData from './ecosystems/swamp';
import agroecosystemData from './ecosystems/agroecosystem';

export const ECOSYSTEMS = {
  desert: {
    id: 'desert',
    name: 'Пустеля',
    icon: '/progress/desert.png',
    ...desertData,
  },
  savannah: {
    id: 'savannah',
    name: 'Савана',
    icon: '/progress/savannah.png',
    ...savannahData,
  },
  ocean: {
    id: 'ocean',
    name: 'Океан',
    icon: '/progress/ocean.png',
    ...oceanData,
  },
  'tropical-forests': {
    id: 'tropical-forests',
    name: 'Тропічні ліси',
    icon: '/progress/tropical-forests.png',
    ...tropicalForestsData,
  },
  swamp: {
    id: 'swamp',
    name: 'Болото',
    icon: '/progress/swamp.png',
    ...swampData,
  },
  agroecosystem: {
    id: 'agroecosystem',
    name: 'Агроекосистема',
    icon: '/progress/agroecosystem.png',
    ...agroecosystemData,
  },
};
