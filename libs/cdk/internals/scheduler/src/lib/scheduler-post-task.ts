/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import { ɵglobal } from '@angular/core';
import { PriorityLevel } from './schedulerPriorities';

declare class TaskController {
  // @ts-ignore
  constructor(options?: { priority?: string }): TaskController;
  signal: unknown;
  abort(): void;
}

type PostTaskPriorityLevel = 'user-blocking' | 'user-visible' | 'background';

type CallbackNode = {
  _controller: TaskController;
};

// Capture local references to native APIs, in case a polyfill overrides them.
const perf = window.performance;
const setTimeout = window.setTimeout;

// Use experimental Chrome Scheduler postTask API.
const scheduler = ɵglobal.scheduler;

const getCurrentTime: () => DOMHighResTimeStamp = perf.now.bind(perf);

export const now = getCurrentTime;

// Scheduler periodically yields in case there is other work on the main
// thread, like user events. By default, it yields multiple times per frame.
// It does not attempt to align with frame boundaries, since most tasks don't
// need to be frame aligned; for those that do, use requestAnimationFrame.
const yieldInterval = 5;
let deadline = 0;

let currentPriorityLevel_DEPRECATED = PriorityLevel.NormalPriority;

// Always yield at the end of the frame.
export function shouldYield(): boolean {
  return getCurrentTime() >= deadline;
}

export function requestPaint() {
  // Since we yield every frame regardless, `requestPaint` has no effect.
}

type SchedulerCallback<T> = (didTimeout_DEPRECATED: boolean) =>
  | T
  // May return a continuation
  | SchedulerCallback<T>;

export function scheduleCallback<T>(
  priorityLevel: PriorityLevel,
  callback: SchedulerCallback<T>,
  options?: { delay?: number },
): CallbackNode {
  let postTaskPriority;
  switch (priorityLevel) {
    case PriorityLevel.ImmediatePriority:
    case PriorityLevel.UserBlockingPriority:
      postTaskPriority = 'user-blocking';
      break;
    case PriorityLevel.LowPriority:
    case PriorityLevel.NormalPriority:
      postTaskPriority = 'user-visible';
      break;
    case PriorityLevel.IdlePriority:
      postTaskPriority = 'background';
      break;
    default:
      postTaskPriority = 'user-visible';
      break;
  }

  const controller = new TaskController({ priority: postTaskPriority });
  const postTaskOptions = {
    delay: typeof options === 'object' && options !== null ? options.delay : 0,
    signal: controller.signal,
  };

  const node = {
    _controller: controller,
  };

  scheduler
    .postTask(
      runTask.bind(null, priorityLevel, postTaskPriority, node, callback),
      postTaskOptions,
    )
    .catch(handleAbortError);

  return node;
}

function runTask<T>(
  priorityLevel: PriorityLevel,
  postTaskPriority: PostTaskPriorityLevel,
  node: CallbackNode,
  callback: SchedulerCallback<T>,
) {
  deadline = getCurrentTime() + yieldInterval;
  try {
    currentPriorityLevel_DEPRECATED = priorityLevel;
    const didTimeout_DEPRECATED = false;
    const result = callback(didTimeout_DEPRECATED);
    if (typeof result === 'function') {
      // Assume this is a continuation
      const continuation: SchedulerCallback<T> = (result: any) => result;
      const continuationOptions = {
        signal: node._controller.signal,
      };

      const nextTask = runTask.bind(
        null,
        priorityLevel,
        postTaskPriority,
        node,
        continuation,
      );

      if (scheduler.yield !== undefined) {
        scheduler
          .yield(continuationOptions)
          .then(nextTask)
          .catch(handleAbortError);
      } else {
        scheduler
          .postTask(nextTask, continuationOptions)
          .catch(handleAbortError);
      }
    }
  } catch (error) {
    // We're inside a `postTask` promise. If we don't handle this error, then it
    // will trigger an "Unhandled promise rejection" error. We don't want that,
    // but we do want the default error reporting behavior that normal
    // (non-Promise) tasks get for unhandled errors.
    //
    // So we'll re-throw the error inside a regular browser task.
    setTimeout(() => {
      throw error;
    });
  } finally {
    currentPriorityLevel_DEPRECATED = PriorityLevel.NormalPriority;
  }
}

function handleAbortError(error: any) {
  // Abort errors are an implementation detail. We don't expose the
  // TaskController to the user, nor do we expose the promise that is returned
  // from `postTask`. So we should suppress them, since there's no way for the
  // user to handle them.
}

export function cancelCallback(node: CallbackNode) {
  const controller = node._controller;
  controller.abort();
}

export function runWithPriority<T>(
  priorityLevel: PriorityLevel,
  callback: () => T,
): T {
  const previousPriorityLevel = currentPriorityLevel_DEPRECATED;
  currentPriorityLevel_DEPRECATED = priorityLevel;
  try {
    return callback();
  } finally {
    currentPriorityLevel_DEPRECATED = previousPriorityLevel;
  }
}

export function getCurrentPriorityLevel(): PriorityLevel {
  return currentPriorityLevel_DEPRECATED;
}

export function next<T>(callback: () => T): T {
  let priorityLevel;
  switch (currentPriorityLevel_DEPRECATED) {
    case PriorityLevel.ImmediatePriority:
    case PriorityLevel.UserBlockingPriority:
    case PriorityLevel.NormalPriority:
      // Shift down to normal priority
      priorityLevel = PriorityLevel.NormalPriority;
      break;
    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel_DEPRECATED;
      break;
  }

  const previousPriorityLevel = currentPriorityLevel_DEPRECATED;
  currentPriorityLevel_DEPRECATED = priorityLevel;
  try {
    return callback();
  } finally {
    currentPriorityLevel_DEPRECATED = previousPriorityLevel;
  }
}

export function wrapCallback<T>(callback: () => T): () => T {
  const parentPriorityLevel = currentPriorityLevel_DEPRECATED;
  return () => {
    const previousPriorityLevel = currentPriorityLevel_DEPRECATED;
    currentPriorityLevel_DEPRECATED = parentPriorityLevel;
    try {
      return callback();
    } finally {
      currentPriorityLevel_DEPRECATED = previousPriorityLevel;
    }
  };
}

export function forceFrameRate() {}
