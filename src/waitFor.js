// Public

module.exports = function(fn, timeout, interval) {
  const endTime = Date.now() + (timeout || 2000);
  interval = interval || 50;

  return new Promise(function check(resolve, reject) {
    const result = fn();
    if (result) {
      resolve(result);
    } else if (Date.now() < endTime) {
      setTimeout(check, interval, resolve, reject);
    } else {
      reject(new Error('Timed out!'));
    }
  });
};

// waitFor(() => document.getElementById('lightbox').offsetWidth > 0, 2000, 150)
//   .then(() => {
//     // Polling done, now do something else!
//   })
//   .catch((err) => {
//     // Polling timed out, handle the error!
//   });
