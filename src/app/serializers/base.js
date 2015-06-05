import _ from 'lodash';

// TODO: would be nice to have a _private field
// in the constructor where the final data is
// right now the final data is potentially in several different places
// a singular FINAL_DATA var that gets built by the serializer
// might make this easier to reason about.

class BaseSerialzer {
  constructor(data = {}) {
    this.data       = data;
    this.isArray    = _.isArray(this.data);
    this.fields     = '*';
  }

  serialize() {
    if (this.isArray) {
      return this._serializeArray();
    } else {
      return this._serializeObject();
    }
  }

  _serializeObject(item = null) {
    let workableData = (item) ? item : this.data;
    if (this.fields !== "*") {
      return this._serializeBySchema(workableData);
    } else {
      return workableData;
    }
  }

  _serializeArray() {
    var serializedData = [];
    _.each(this.data, (item) => {
      serializedData.push(this._serializeObject(item));
    });
    return serializedData;
  }

  _serializeBySchema(data) {
    let fields      = this.fields
    let dataObject  = _.pick(data, fields);

    let existingKeys  = _.keys(data);
    let virtualKeys   = _.difference(fields, existingKeys);

    if (virtualKeys.length) {
      virtualKeys.forEach((key) => {
        if (this[key] && typeof this[key] === 'function') {
          dataObject[key] = this[key].call(this, dataObject);
        }
      });
    }

    return dataObject;

  }
}

export default BaseSerialzer;