import mongoose from 'mongoose';

const siteSettingsSchema = mongoose.Schema(
  {
    siteAccessEnabled: {
      type: Boolean,
      required: true,
      default: true
    },
    registrationEnabled: {
      type: Boolean,
      required: true,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      required: true,
      default: false
    },
    maintenanceMessage: {
      type: String,
      default: 'The site is currently under maintenance. Please check back later.'
    },
    siteAccessPassword: {
      type: String,
      default: 'demo123' // Default password for initial setup
    },
    allowedEmails: {
      type: [String],
      default: []
    },
    allowedDomains: {
      type: [String],
      default: []
    },
    // Homepage section visibility controls
    homepageSettings: {
      hero: {
        type: Boolean,
        default: true
      },
      features: {
        type: Boolean,
        default: true
      },
      marketplacePreview: {
        type: Boolean,
        default: true
      },
      blockchainSection: {
        type: Boolean,
        default: false // Hidden by default as requested
      },
      ctaSection: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

// Only one instance of site settings should exist
siteSettingsSchema.statics.findSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = await this.create({
      siteAccessEnabled: true,
      registrationEnabled: true,
      maintenanceMode: false,
      siteAccessPassword: 'demo123',
      homepageSettings: {
        hero: true,
        features: true,
        marketplacePreview: true,
        blockchainSection: false,
        ctaSection: true
      }
    });

    // Set the password in the environment for immediate use
    if (globalThis.process) {
      globalThis.process.env.SITE_ACCESS_PASSWORD = settings.siteAccessPassword;
    }
  }
  
  // Force site access to be enabled
  if (!settings.siteAccessEnabled) {
    settings.siteAccessEnabled = true;
    await settings.save();
  }
  
  // Ensure homepageSettings exists for backward compatibility
  if (!settings.homepageSettings) {
    settings.homepageSettings = {
      hero: true,
      features: true,
      marketplacePreview: true,
      blockchainSection: false,
      ctaSection: true
    };
    await settings.save();
  }
  
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings; 