'use strict';

module.exports = {
  // an object that defines the schema for configuration
  config: {
    update_cache: false,
    subDir: '',
    globalBower: true,
    caching: {
      type: String,
      enum: ['strict', 'loose', 'none'],
      default: 'none'
    }
  }
};
