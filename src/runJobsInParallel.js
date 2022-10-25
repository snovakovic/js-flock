
module.exports = async function(jobs, opts = {}) {
  jobs = jobs || [];
  return new Promise((resolve) => {
    const maxParallelism = opts.maxParallelism || 10;
    const onError = opts.onError || (() => {});
    let activeWorkers = 0;
    const jobsToConsume = [...jobs];
    const status = {
      success: 0,
      errors: 0,
    };

    if (!jobsToConsume.length) {
      return resolve(status);
    }

    async function consumeJobs() {
      if (activeWorkers >= maxParallelism || !jobsToConsume.length) {
        return;
      }

      try {
        const job = jobsToConsume.shift();
        activeWorkers += 1;

        // Consume as much jobs as available before start executing them
        consumeJobs();

        await job();

        status.success += 1;
      } catch (err) {
        status.errors += 1;
        onError(err);
      } finally {
        activeWorkers -= 1;
      }

      consumeJobs();

      if (!activeWorkers) {
        // Sanity check should never happen
        if (jobsToConsume.length) {
          throw Error('Some jobs left pending');
        }

        resolve(status);
      }
    }

    // Immediately start consuming jobs
    consumeJobs();
  });
};
