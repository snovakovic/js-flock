/* eslint-disable no-use-before-define */

const { assert } = require('chai');
const delay = require('../../src/delay');
const runJobsInParallel = require('../../src/runJobsInParallel');

describe('Run Jobs in Parallel', () => {
  it('Should finish in next tick if no jobs to run', async() => {
    let allDone = false;
    const jobs = [];
    const runPromise = runJobsInParallel(jobs, {
      maxParallelism: 3,
    }).then(() => allDone = true);

    assert.isFalse(allDone);
    await runPromise;
    assert.isTrue(allDone);
  });

  it('Should treat undefined as no jobs', async() => {
    let allDone = false;
    const runPromise = runJobsInParallel(undefined, {
      maxParallelism: 3,
    }).then(() => allDone = true);

    assert.isFalse(allDone);
    await runPromise;
    assert.isTrue(allDone);
  });

  it('Should consume 2 jobs at the time in parallel', async() => {
    let allDone = false;
    const jobs = [
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
    ];

    runJobsInParallel(jobs.map(f => f.job), {
      maxParallelism: 2,
    }).then(() => allDone = true);

    assert.isFalse(allDone);

    function assertJobStatuses(expectedStatuses) {
      const jobStatuses = jobs.map(j => ({
        executionCount: j.executionCount,
        done: j.isDone,
      }));

      assert.deepEqual(jobStatuses, expectedStatuses);
    }

    // 2 jobs should be executed
    assertJobStatuses([{
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

    // it should execute next job after first job finishes

    jobs[1].resolve();
    await delay(); // Wait for next job to be consumed

    assertJobStatuses([{
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

    jobs[0].resolve();
    jobs[1].resolve(); // should be ignored as this one already resolved
    jobs[2].resolve();

    await delay(); // Wait for next job to be consumed

    assertJobStatuses([{
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

    // Only 1 jobs left pending to be done. No more jobs left to consume
    jobs[3].resolve();
    await delay();

    assertJobStatuses([{
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

    jobs[4].resolve();
    await delay();

    assertJobStatuses([{
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

  it('Should finish executing jobs even if some of them fails', async() => {
    let allDoneResponse;
    const jobs = [
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
    ];

    const reportedErrors = [];

    runJobsInParallel(jobs.map(f => f.job), {
      maxParallelism: 2,
      onError: (err) => reportedErrors.push(err),
    }).then((response) => allDoneResponse = response);

    jobs[0].reject('Error 1');
    jobs[1].resolve();
    await delay(); // Wait for next job to be consumed

    assert.isUndefined(allDoneResponse);

    jobs[2].resolve();
    jobs[3].reject('Error 2');
    await delay(); // Wait for next job to be consumed

    assert.deepEqual(allDoneResponse, {
      success: 2,
      errors: 2,
    });

    assert.deepEqual(reportedErrors, ['Error 1', 'Error 2']);
  });

  it('Should consume all jobs in single run', async() => {
    let allDoneResponse;
    const jobs = [
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
      new FakeJob(),
    ];

    runJobsInParallel(jobs.map(f => f.job), {
      maxParallelism: 20,
    }).then((response) => allDoneResponse = response);

    assert.isUndefined(allDoneResponse);

    jobs[0].resolve();
    jobs[1].resolve();
    jobs[2].resolve();
    jobs[3].resolve();
    jobs[4].resolve();
    await delay(); // Wait for next job to be consumed

    assert.deepEqual(allDoneResponse, {
      success: 5,
      errors: 0,
    });
  });
});

function FakeJob() {
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
    job: () => {
      executionCount++;

      return new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
    },
  };
}
