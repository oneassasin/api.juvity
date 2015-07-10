function BitMask(value) {
  this.base = value.length;
  this.value = value;
}

BitMask.prototype.checkBit = function(position) {
  if (position > this.base)
    return false;
  return (this.value[position] == '1');
};

BitMask.prototype.bitMask = function() {
  return this.value.toString();
};

module.exports = BitMask;
