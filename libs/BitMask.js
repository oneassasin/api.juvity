function BitMask(value) {
  this.base = value.length;
  if (value)
    this.value = parseInt(value);
}

BitMask.prototype.checkBit = function(position) {
  if (position > this.base)
    return false;
  return !!((1 << (this.base - position)) & this.value);
};

BitMask.prototype.bitMask = function() {
  return this.value.toString(2);
};

module.exports = BitMask;
