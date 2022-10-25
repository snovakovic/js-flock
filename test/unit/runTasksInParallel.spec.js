/* eslint-disable no-use-before-define */

const { assert } = require('chai');
const delay = require('../../src/delay');
const runTasksInParallel = require('../../src/runTasksInParallel');

describe('Run Tasks in Parallel', () => {
  it('Should finish in next tick if no tasks to run', async() => {
    let allDone = false;
    const tasks = [];
    const runPromise = runTasksInParallel(tasks, {
      maxParallelism: 3,
    }).then(() => allDone = true);

    assert.isFalse(allDone);
    await runPromise;
    assert.isTrue(allDone);
  });

  it('Should treat undefined as no tasks', async() => {
    let allDone = false;
    const runPromise = runTasksInParallel(undefined, {
      maxParallelism: 3,
    }).then(() => allDone = true);

    assert.isFalse(allDone);
    await runPromise;
    assert.isTrue(allDone);
  });

  it('Should consume 2 tasks at the time in parallel', async() => {
    let allDone = false;
    const tasks = [
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
    ];

    runTasksInParallel(tasks.map(f => f.task), {
      maxParallelism: 2,
    }).then(() => allDone = true);

    assert.isFalse(allDone);

    function assertTaskStatuses(expectedStatuses) {
      const taskStatuses = tasks.map(j => ({
        executionCount: j.executionCount,
        done: j.isDone,
      }));

      assert.deepEqual(taskStatuses, expectedStatuses);
    }

    // 2 tasks should be executed
    assertTaskStatuses([{
      executionCount: 1,
      done: false,
    }, {
      executionCount: 1,
      done: false,
    }, {
      executionCount: 0,
      done: false,
    }, {
      executionCount: 0,
      done: false,
    }, {
      executionCount: 0,
      done: false,
    }]);

    assert.isFalse(allDone);

    // it should execute next task after first task finishes

    tasks[1].resolve();
    await delay(); // Wait for next task to be consumed

    assertTaskStatuses([{
      executionCount: 1,
      done: false,
    }, {
      executionCount: 1,
      done: true, // <= NOTE
    }, {
      executionCount: 1, // <= NOTE
      done: false,
    }, {
      executionCount: 0,
      done: false,
    }, {
      executionCount: 0,
      done: false,
    }]);

    tasks[0].resolve();
    tasks[1].resolve(); // should be ignored as this one already resolved
    tasks[2].resolve();

    await delay(); // Wait for next task to be consumed

    assertTaskStatuses([{
      executionCount: 1,
      done: true, // <= NOTE
    }, {
      executionCount: 1,
      done: true, //
    }, {
      executionCount: 1,
      done: true, // <= NOTE
    }, {
      executionCount: 1, // <= NOTE
      done: false,
    }, {
      executionCount: 1, // <= NOTE
      done: false,
    }]);

    // Only 1 tasks left pending to be done. No more tasks left to consume
    tasks[3].resolve();
    await delay();

    assertTaskStatuses([{
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true, // <= NOTE
    }, {
      executionCount: 1,
      done: false,
    }]);

    assert.isFalse(allDone);

    tasks[4].resolve();
    await delay();

    assertTaskStatuses([{
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true,
    }, {
      executionCount: 1,
      done: true, // <= NOTE
    }]);

    assert.isTrue(allDone);
  });

  it('Should finish executing tasks even if some of them fails', async() => {
    let allDoneResponse;
    const tasks = [
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
    ];

    const reportedErrors = [];

    runTasksInParallel(tasks.map(f => f.task), {
      maxParallelism: 2,
      onError: (err) => reportedErrors.push(err),
    }).then((response) => allDoneResponse = response);

    tasks[0].reject('Error 1');
    tasks[1].resolve();
    await delay(); // Wait for next task to be consumed

    assert.isUndefined(allDoneResponse);

    tasks[2].resolve();
    tasks[3].reject('Error 2');
    await delay(); // Wait for next task to be consumed

    assert.deepEqual(allDoneResponse, {
      succeeded: 2,
      failed: 2,
    });

    assert.deepEqual(reportedErrors, ['Error 1', 'Error 2']);
  });

  it('Should consume all tasks in single run', async() => {
    let allDoneResponse;
    const tasks = [
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
      new FakeTask(),
    ];

    runTasksInParallel(tasks.map(f => f.task), {
      maxParallelism: 20,
    }).then((response) => allDoneResponse = response);

    assert.isUndefined(allDoneResponse);

    tasks[0].resolve();
    tasks[1].resolve();
    tasks[2].resolve();
    tasks[3].resolve();
    tasks[4].resolve();
    await delay(); // Wait for next task to be consumed

    assert.deepEqual(allDoneResponse, {
      succeeded: 5,
      failed: 0,
    });
  });
});

function FakeTask() {
  let executionCount = 0;
  let done = false;
  let resolve;
  let reject;

  return {
    get executionCount() { return executionCount; },
    get isDone() { return done; },
    resolve: () => {
      done = true;
      resolve();
    },
    reject: (reason) => {
      done = true;
      reject(reason);
    },
    task: () => {
      executionCount++;

      return new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
    },
  };
}
