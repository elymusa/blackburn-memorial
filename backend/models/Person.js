const mongoose = require('mongoose');

// We define a sub-schema for the photos. This helps keep the main schema clean.
const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    // A default placeholder image
    default: '/images/placeholder.png'
  },
  description: {
    type: String,
    // A default description
    default: 'Details about the photo.'
  }
}, { _id: false }); // We don't need a separate _id for the photo sub-documents

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    required: true
  },
  // By setting a default to an empty object, Mongoose will apply the
  // defaults from the photoSchema.
  photoTop: {
    type: photoSchema,
    default: () => ({})
  },
  photoBottom: {
    type: photoSchema,
    default: () => ({})
  }
});

module.exports = mongoose.model('Person', personSchema);