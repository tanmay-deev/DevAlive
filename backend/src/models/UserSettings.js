import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  notificationEmail: {
    type: String,
    default: ''
  },
  dailyReportEnabled: {
    type: Boolean,
    default: false
  },
  downtimeAlerts: {
    type: Boolean,
    default: true
  },
  recoveryAlerts: {
    type: Boolean,
    default: true
  },
  defaultMonitoringInterval: {
    type: Number,
    default: 15
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
}, {
  timestamps: true
});

export default mongoose.model('UserSettings', userSettingsSchema);
