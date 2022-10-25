
module.exports = async function(tasks, opts = {}) {
  tasks = tasks || [];

  return new Promise((resolve) => {
    const maxParallelism = opts.maxParallelism || 10;
    const onError = opts.onError || (() => {});
    let activeWorkers = 0;
    const tasksToConsume = [...tasks];
    const status = {
      succeeded: 0,
      failed: 0,
    };

    if (!tasksToConsume.length) {
      return resolve(status);
    }

    async function consumeTasks() {
      if (activeWorkers >= maxParallelism || !tasksToConsume.length) {
        return;
      }

      try {
        const task = tasksToConsume.shift();
        activeWorkers += 1;

        // Consume as much tasks as available before start executing them
        consumeTasks();

        await task();

        status.succeeded += 1;
      } catch (err) {
        status.failed += 1;
        onError(err);
      } finally {
        activeWorkers -= 1;
      }

      consumeTasks();

      if (!activeWorkers) {
        // Sanity check should never happen
        if (tasksToConsume.length) {
          throw Error('Some tasks left pending');
        }

        resolve(status);
      }
    }

    // Immediately start consuming tasks
    consumeTasks();
  });
};
