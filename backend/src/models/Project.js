import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  endpointUrl: {
    type: String,
    required: [true, 'Endpoint URL is required'],
  },
  projectType: {
    type: String,
    enum: ['website', 'api', 'backend', 'health-endpoint'],
    default: 'website',
  },
  monitoringInterval: {
    type: Number,
    enum: [1, 5, 10, 15, 30, 60, 300, 720, 1440, 7200],
    default: 15,
  },
  monitoringEnabled: {
    type: Boolean,
    default: true,
    index: true,
  },
  currentStatus: {
    type: String,
    enum: ['online', 'offline', 'degraded', 'unknown'],
    default: 'unknown',
    index: true,
  },
  lastCheckedAt: {
    type: Date,
  },
  lastSuccessAt: {
    type: Date,
  },
  lastFailureAt: {
    type: Date,
  },
  totalChecks: {
    type: Number,
    default: 0,
  },
  successfulChecks: {
    type: Number,
    default: 0,
  },
  failedChecks: {
    type: Number,
    default: 0,
  },
  consecutiveFailures: {
    type: Number,
    default: 0,
  },
  uptimePercentage: {
    type: Number,
    default: 100,
  },
  averageResponseTime: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);
