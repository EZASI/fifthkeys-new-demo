/**
 * FifthKeys Platform - Database Schema
 * 
 * This file defines the MongoDB schemas for the FifthKeys platform.
 * MongoDB is used for flexible schema data like user profiles, guest data,
 * and other data that may evolve over time.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema - For platform users (hotel staff, managers, admins)
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hotel Schema - For hotel properties
const HotelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  category: {
    type: String,
    enum: ['luxury', 'boutique', 'business', 'resort', 'other'],
    default: 'other'
  },
  roomCount: {
    type: Number,
    required: true
  },
  facilities: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Guest Schema - For GuestDNA module
const GuestSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  nationality: {
    type: String
  },
  language: {
    type: String
  },
  preferences: {
    roomType: String,
    bedType: String,
    floorPreference: String,
    dietaryRestrictions: [String],
    specialRequests: [String],
    amenities: [String]
  },
  stayHistory: [{
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    roomNumber: String,
    rateCode: String,
    totalSpend: Number,
    feedback: {
      rating: Number,
      comments: String
    }
  }],
  spendingProfile: {
    averageRoomRate: Number,
    averageFoodBeverage: Number,
    averageSpa: Number,
    averageRetail: Number,
    totalLifetimeValue: Number
  },
  behaviorTags: [String],
  sentimentScore: Number,
  loyaltyTier: {
    type: String,
    enum: ['none', 'silver', 'gold', 'platinum'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Revenue Data Schema - For RevenuePulse module
const RevenueDataSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  roomRevenue: {
    type: Number,
    default: 0
  },
  foodBeverageRevenue: {
    type: Number,
    default: 0
  },
  spaRevenue: {
    type: Number,
    default: 0
  },
  retailRevenue: {
    type: Number,
    default: 0
  },
  otherRevenue: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  occupancyRate: {
    type: Number,
    default: 0
  },
  adr: { // Average Daily Rate
    type: Number,
    default: 0
  },
  revPAR: { // Revenue Per Available Room
    type: Number,
    default: 0
  },
  marketSegment: {
    business: Number,
    leisure: Number,
    group: Number,
    other: Number
  },
  channelDistribution: {
    direct: Number,
    ota: Number,
    gds: Number,
    wholesale: Number,
    other: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Market Data Schema - For RevenuePulse module
const MarketDataSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  competitorRates: [{
    competitorName: String,
    roomType: String,
    rate: Number
  }],
  events: [{
    name: String,
    type: String,
    startDate: Date,
    endDate: Date,
    expectedImpact: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  weatherForecast: {
    temperature: Number,
    condition: String,
    expectedImpact: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  },
  seasonalityFactor: {
    type: Number,
    default: 1
  },
  demandIndicator: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Digital Twin Schema - For HotelTwin module
const DigitalTwinSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  modelVersion: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  modelData: {
    type: Object,
    required: true
  },
  spaces: [{
    name: String,
    type: String,
    floor: Number,
    area: Number,
    capacity: Number,
    coordinates: {
      x: Number,
      y: Number,
      z: Number
    },
    dimensions: {
      width: Number,
      length: Number,
      height: Number
    }
  }],
  assets: [{
    name: String,
    type: String,
    location: {
      spaceId: String,
      coordinates: {
        x: Number,
        y: Number,
        z: Number
      }
    },
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'offline'],
      default: 'operational'
    },
    lastMaintenance: Date,
    nextMaintenance: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// IoT Sensor Data Schema - For HotelTwin module
const SensorDataSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  sensorId: {
    type: String,
    required: true
  },
  sensorType: {
    type: String,
    enum: ['occupancy', 'temperature', 'energy', 'water', 'air_quality', 'noise', 'other'],
    required: true
  },
  location: {
    spaceId: String,
    coordinates: {
      x: Number,
      y: Number,
      z: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// AI Interaction Schema - For GuestDNA module
const AIInteractionSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  guestId: {
    type: Schema.Types.ObjectId,
    ref: 'Guest'
  },
  sessionId: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['chat', 'email', 'sms', 'voice', 'in_app', 'other'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  userInput: {
    type: String
  },
  aiResponse: {
    type: String
  },
  intent: {
    type: String
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1
  },
  actionTaken: {
    type: String
  },
  successful: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export models
module.exports = {
  User: mongoose.model('User', UserSchema),
  Hotel: mongoose.model('Hotel', HotelSchema),
  Guest: mongoose.model('Guest', GuestSchema),
  RevenueData: mongoose.model('RevenueData', RevenueDataSchema),
  MarketData: mongoose.model('MarketData', MarketDataSchema),
  DigitalTwin: mongoose.model('DigitalTwin', DigitalTwinSchema),
  SensorData: mongoose.model('SensorData', SensorDataSchema),
  AIInteraction: mongoose.model('AIInteraction', AIInteractionSchema)
};
