require('dotenv').config();

const config = {
  port: process.env.PORT || 4000,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'changeme_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'changeme_refresh_secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || ''
  },
  mapbox: {
    token: process.env.MAPBOX_TOKEN || ''
  }
};

module.exports = config;
