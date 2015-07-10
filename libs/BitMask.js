function BitMask(value) {
  this.base = value.length;
  if (value)
    this.value = parseInt(value);
}

BitMask.prototype.checkBit = function(position) {
  if (position > this.base)
    return false;
  return !!(((this.base - position)) & this.value);
};

BitMask.prototype.bitMask = function() {
  return this.value.toString();
};

module.exports = BitMask;
