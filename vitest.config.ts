import { defineConfig } from 'vitest/config';

/**
 * Wired into the Angular unit-test builder via `runnerConfig` in angular.json.
 *
 * Each spec boots its own jsdom environment. Letting Vitest spawn a worker per file
 * exhausts this machine's memory and the run dies with `ENOMEM`/"JavaScript heap out
 * of memory" before reporting a single result. Running the files serially in one
 * forked worker keeps peak memory flat, at the cost of some wall-clock time.
 *
 * Note: these are top-level options. `test.poolOptions` was removed in Vitest 4.
 */
export default defineConfig({
  test: {
    // `threads` rather than `forks`: a worker thread shares the parent process's
    // address space, so it needs far less Windows commit charge than spawning a
    // fresh Node process per spec file.
    pool: 'threads',
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
  },
});
