// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
if (typeof(console) === 'undefined') {
  var console = {}
  console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () {
  };
}

/* use a function for the exact format desired... */
function ISODateString(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  return d.getUTCFullYear() + '-'
          + pad(d.getUTCMonth() + 1) + '-'
          + pad(d.getUTCDate()) + 'T'
          + pad(d.getUTCHours()) + ':'
          + pad(d.getUTCMinutes()) + ':'
          + pad(d.getUTCSeconds()) + 'Z'
}
