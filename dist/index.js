/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!(function(global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol =
	    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument
	        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
	        : Promise.resolve(value).then(function(unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration. If the Promise is rejected, however, the
	            // result for this iteration will be rejected with the same
	            // reason. Note that rejections of yielded Promises are not
	            // thrown back into the generator function, as is the case
	            // when an awaited Promise is rejected. This difference in
	            // behavior between yield and await is important, because it
	            // allows the consumer to decide what to do with the yielded
	            // rejection (swallow it and continue, manually .throw it back
	            // into the generator, abandon iteration, whatever). With
	            // await, by contrast, there is no opportunity to examine the
	            // rejection reason outside the generator function, so the
	            // only option is to throw it from the await expression, and
	            // let the generator function handle the exception.
	            result.value = unwrapped;
	            return result;
	          });
	    }

	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : new Promise(function (resolve) {
	          resolve(callInvokeWithMethodAndArg());
	        });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }

	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _AutoComplete = __webpack_require__(4);

	var _AutoComplete2 = _interopRequireDefault(_AutoComplete);

	var _AjaxSource = __webpack_require__(18);

	var _AjaxSource2 = _interopRequireDefault(_AjaxSource);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _ArraySource = __webpack_require__(19);

	var _ArraySource2 = _interopRequireDefault(_ArraySource);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * ES7 AutoComplete
	 *
	 * @author Jackson Veroneze <jackson@inovadora.com.br>
	 * @author Ladislau Perrony <ladislau.perrony@inovadora.com.br>
	 * @author Mario Mendonça <mario@inovadora.com.br>
	 * @author Mateus Calza <mateus@inovadora.com.br>
	 * @author Patrick Nascimento <patrick@inovadora.com.br>
	 * @license MIT
	 * @version 1.0.0
	 */

	var autocomplete = function autocomplete(options) {
	  return new _AutoComplete2.default(options);
	};
	autocomplete.ajax = function (url) {
	  return new _AjaxSource2.default(url);
	};
	autocomplete.select = function (select) {
	  return new _SelectSource2.default(select);
	};
	autocomplete.array = function (array) {
	  return new _ArraySource2.default(array);
	};
	autocomplete.byId = function (id) {
	  return document.getElementById(id);
	};

	if (typeof window !== 'undefined') {
	  window.autocomplete = autocomplete;
	}

	exports.default = autocomplete;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _PresentText = __webpack_require__(6);

	var _PresentText2 = _interopRequireDefault(_PresentText);

	var _Icon = __webpack_require__(11);

	var _Icon2 = _interopRequireDefault(_Icon);

	var _Panel = __webpack_require__(12);

	var _Panel2 = _interopRequireDefault(_Panel);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _debounce = __webpack_require__(16);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _dom = __webpack_require__(9);

	var _events = __webpack_require__(10);

	var _keys = __webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var keysThatOpen = [_keys.ENTER, _keys.SPACE];
	var ignoredKeysOnSearch = [_keys.SHIFT, _keys.TAB];

	var AutoComplete = function () {
	    function AutoComplete(_ref) {
	        var hiddenInput = _ref.hiddenInput;
	        var textInput = _ref.textInput;
	        var source = _ref.source;
	        var _ref$style = _ref.style;
	        var style = _ref$style === undefined ? {} : _ref$style;
	        var _ref$searchOnFocus = _ref.searchOnFocus;
	        var searchOnFocus = _ref$searchOnFocus === undefined ? false : _ref$searchOnFocus;
	        var _ref$debounceTime = _ref.debounceTime;
	        var debounceTime = _ref$debounceTime === undefined ? 600 : _ref$debounceTime;
	        var _ref$queryParam = _ref.queryParam;
	        var queryParam = _ref$queryParam === undefined ? 'q' : _ref$queryParam;
	        var _ref$clearOnType = _ref.clearOnType;
	        var clearOnType = _ref$clearOnType === undefined ? false : _ref$clearOnType;
	        var _ref$autoFind = _ref.autoFind;
	        var autoFind = _ref$autoFind === undefined ? false : _ref$autoFind;
	        var _ref$autoSelectWhenOn = _ref.autoSelectWhenOneResult;
	        var autoSelectWhenOneResult = _ref$autoSelectWhenOn === undefined ? true : _ref$autoSelectWhenOn;

	        _classCallCheck(this, AutoComplete);

	        // Environment
	        this.finding = false;
	        this.open = false;
	        this.typing = false;
	        this.ignoreFocus = false;
	        this.ignoreFocusOut = false;
	        this.ignoreSearchBlur = false;
	        this.valueOnOpen = undefined;

	        // Initial
	        this.queryParam = queryParam;
	        this.clearOnType = clearOnType;
	        this.autoFind = autoFind;
	        this.autoSelectWhenOneResult = autoSelectWhenOneResult;

	        // Set data source
	        this.source = source || new _SelectSource2.default(input);

	        // Set style props
	        this.style = (0, _extend2.default)({
	            hiddenInput: 'ac-hidden-input',
	            textInput: 'ac-text-input',
	            panel: 'ac-panel',
	            listWrapper: 'ac-list-wrapper',
	            searchInput: 'ac-search-input',
	            searchInputWrapper: 'ac-search-input-wrapper',
	            presentText: 'ac-present-text',
	            presentInnerText: 'ac-present-inner-text',
	            presentCropText: 'ac-present-crop-text',
	            errorView: 'ac-error-view',
	            errorViewWrapper: 'ac-error-view-wrapper',
	            wrapper: 'ac-wrapper',
	            openWrapper: 'ac-wrapper ac-open-wrapper',
	            rightIcon: 'fa fa-search ac-icon',
	            loadingRightIcon: 'fa fa-spinner ac-icon ac-loading-icon'
	        }, style);

	        // Set AutoComplete's elements
	        this.elements = {
	            hiddenInput: hiddenInput,
	            textInput: textInput,
	            wrapper: (0, _dom.div)({
	                className: this.style.wrapper
	            })
	        };

	        // Debouncing find
	        this.debouncedFind = (0, _debounce2.default)(this.find.bind(this), debounceTime);

	        // Set relative components
	        this.components = {
	            presentText: new _PresentText2.default({ style: this.style }),
	            icon: new _Icon2.default({ style: this.style }),
	            panel: new _Panel2.default({ style: this.style }, { onSelect: this.select.bind(this) }, this)
	        };

	        // Prepare elements
	        this.prepareElements();
	        this.prepareEvents();
	    }

	    _createClass(AutoComplete, [{
	        key: 'prepareElements',
	        value: function prepareElements() {
	            // Turn wrapper focusable
	            this.elements.wrapper.setAttribute('tabindex', '0');
	            // Store hiddenInput value
	            this.value = this.elements.hiddenInput.value;
	            // Store textInput value (content)
	            this.content = this.elements.textInput.value;
	            // Add wrapper after hiddenInput
	            this.elements.textInput.parentNode.insertBefore(this.elements.wrapper, this.elements.textInput.nextSibling);
	            // Remove old inputs
	            this.elements.hiddenInput.parentNode.removeChild(this.elements.hiddenInput);
	            this.elements.textInput.parentNode.removeChild(this.elements.textInput);
	            // Prepare hiddenInput
	            this.elements.hiddenInput.type = 'hidden';
	            this.elements.hiddenInput.className = this.style.hiddenInput;
	            // Prepare hiddenInput
	            this.elements.textInput.type = 'hidden';
	            this.elements.textInput.className = this.style.textInput;
	            // Set initial text
	            this.components.presentText.text(this.content);
	            // Append wrapper's children
	            this.elements.wrapper.appendChild(this.elements.hiddenInput);
	            this.elements.wrapper.appendChild(this.elements.textInput);
	            this.elements.wrapper.appendChild(this.components.presentText.element);
	            this.elements.wrapper.appendChild(this.components.icon.element);
	            this.elements.wrapper.appendChild(this.components.panel.element);
	        }
	    }, {
	        key: 'prepareEvents',
	        value: function prepareEvents() {
	            var _context;

	            (_context = this.components.presentText.element, _events.on).call(_context, 'click', this.iconOrTextClick.bind(this));
	            (_context = this.components.icon.element, _events.on).call(_context, 'click', this.iconOrTextClick.bind(this));
	            (_context = this.elements.wrapper, _events.on).call(_context, 'keyup', this.keyUp.bind(this));
	            (_context = this.elements.wrapper, _events.on).call(_context, 'focus', this.wrapperFocus.bind(this));
	            (_context = this.elements.wrapper, _events.on).call(_context, 'focusout', this.wrapperFocusout.bind(this));
	            (_context = this.elements.wrapper, _events.on).call(_context, 'mousedown', this.wrapperMouseDown.bind(this));
	            (_context = this.elements.wrapper, _events.on).call(_context, 'keydown', this.wrapperKeyDown.bind(this));
	            (_context = this.components.panel.components.searchInput.elements.input, _events.on).call(_context, 'blur', this.searchBlur.bind(this));
	        }
	    }, {
	        key: 'keyUp',
	        value: function keyUp(event) {
	            console.log(event.keyCode);

	            if (event.keyCode === _keys.ESC) {
	                this.closePanel();
	                this.ignoreFocus = true;
	                this.elements.wrapper.focus();
	            } else if (event.target === this.elements.wrapper && keysThatOpen.indexOf(event.keyCode) != -1) {
	                this.togglePanel();
	            } else if (ignoredKeysOnSearch.indexOf(event.keyCode) == -1) {
	                if (!this.typing) {
	                    //console.log('Start typing');
	                    this.typing = true;
	                    if (this.clearOnType) {
	                        this.select({
	                            content: null,
	                            value: null
	                        });
	                    }
	                    this.components.panel.clear();
	                }
	                this.debouncedFind();
	            }
	        }
	    }, {
	        key: 'iconOrTextClick',
	        value: function iconOrTextClick(event) {
	            if (document.activeElement === this.elements.wrapper) {
	                //this.togglePanel();
	            }
	        }
	    }, {
	        key: 'wrapperFocus',
	        value: function wrapperFocus(event) {
	            if (!event.isTrigger && !this.ignoreFocus) {
	                this.openPanel();
	            } else {
	                //console.log('not opening the panel on', { 'event.isTrigger': event.isTrigger, 'this.ignoreFocus': this.ignoreFocus });
	            }
	            this.ignoreFocus = false;
	        }
	    }, {
	        key: 'wrapperFocusout',
	        value: function wrapperFocusout(event) {
	            if (!this.ignoreFocusOut) {
	                var _context3;

	                console.log('real-focusout');
	                if (this.value !== this.valueOnOpen) {
	                    var _context2;

	                    this.valueOnOpen = this.value;
	                    (_context2 = this.elements.hiddenInput, _events.trigger).call(_context2, 'change');
	                    (_context2 = this.elements.textInput, _events.trigger).call(_context2, 'change');
	                }
	                (_context3 = this.elements.hiddenInput, _events.trigger).call(_context3, 'blur');
	                (_context3 = this.elements.textInput, _events.trigger).call(_context3, 'blur');
	                this.closePanel();
	            } else {
	                //console.log('focusout ignored');
	            }
	            this.ignoreFocusOut = false;
	        }
	    }, {
	        key: 'wrapperMouseDown',
	        value: function wrapperMouseDown(event) {
	            this.ignoreSearchBlur = true;

	            // If already is focused (or your children) and panel is not open
	            if (!this.open && document.activeElement === this.elements.wrapper) {
	                this.openPanel();
	            } else if (this.open && document.activeElement === this.elements.wrapper) {
	                //console.log('ignore focusout');
	                this.ignoreFocusOut = true;
	                //console.log('wrapper is focused, focusing on search...');
	                this.components.panel.components.searchInput.elements.input.focus();
	                this.ignoreFocus = true;
	            } else if (document.activeElement === this.components.panel.components.searchInput.elements.input) {
	                //console.log('focus-ignored because panel is open and active element is search input');
	                this.ignoreFocus = true;
	                //console.log('ignore focusout');
	                this.ignoreFocusOut = true;
	            } else {
	                //console.log('focus-NOT-ignored', document.activeElement, this.components.panel.components.searchInput.elements.input);
	            }
	        }
	    }, {
	        key: 'wrapperKeyDown',
	        value: function wrapperKeyDown(event) {
	            //this.ignoreFocusOut = true;
	        }
	    }, {
	        key: 'searchBlur',
	        value: function searchBlur() {/*
	                                      if(!this.ignoreSearchBlur) {
	                                      console.log('search-blur');
	                                      this.closePanel();
	                                      }
	                                      this.ignoreSearchBlur = false; */
	        }
	    }, {
	        key: 'select',
	        value: function select(_ref2) {
	            var content = _ref2.content;
	            var value = _ref2.value;

	            this.value = value;
	            this.content = content;

	            this.elements.hiddenInput.value = value || '';
	            this.elements.textInput.value = content || '';
	            this.components.panel.components.searchInput.value('');
	            this.components.presentText.text(content || ' ');
	        }
	    }, {
	        key: 'find',
	        value: function () {
	            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	                var query, results;
	                return regeneratorRuntime.wrap(function _callee$(_context4) {
	                    while (1) {
	                        switch (_context4.prev = _context4.next) {
	                            case 0:
	                                if (this.finding) {
	                                    console.log('Let`s abort!');
	                                    this.source.abort();
	                                    this.findingEnd();
	                                }
	                                this.findingStart();
	                                query = this.components.panel.components.searchInput.value();
	                                results = { data: [] };
	                                _context4.prev = 4;
	                                _context4.next = 7;
	                                return this.source.find(_defineProperty({}, this.queryParam, query));

	                            case 7:
	                                results = _context4.sent;

	                                this.components.panel.show(results);
	                                _context4.next = 14;
	                                break;

	                            case 11:
	                                _context4.prev = 11;
	                                _context4.t0 = _context4['catch'](4);

	                                this.components.panel.error(_context4.t0);

	                            case 14:
	                                _context4.prev = 14;

	                                if (this.autoSelectWhenOneResult && results && results.data && results.data.length == 1) {
	                                    this.select({
	                                        content: results.data[0].content,
	                                        value: results.data[0].value
	                                    });
	                                } else if (!this.open && (!this.autoFind || results && results.data && results.data.length > 1)) {
	                                    !this.open && this.openPanel();
	                                }
	                                this.findingEnd();
	                                return _context4.finish(14);

	                            case 18:
	                            case 'end':
	                                return _context4.stop();
	                        }
	                    }
	                }, _callee, this, [[4, 11, 14, 18]]);
	            }));

	            function find() {
	                return ref.apply(this, arguments);
	            }

	            return find;
	        }()
	    }, {
	        key: 'findingStart',
	        value: function findingStart() {
	            // Set flag
	            this.typing = false;
	            this.finding = true;
	            // Start spin
	            this.components.icon.loadingStart();
	        }
	    }, {
	        key: 'findingEnd',
	        value: function findingEnd() {
	            // Set flag
	            this.finding = false;
	            // Stop spin
	            this.components.icon.loadingStop();
	        }
	    }, {
	        key: 'openPanel',
	        value: function openPanel() {
	            //console.log('open-panel');
	            //console.trace();
	            this.open = true;
	            this.valueOnOpen = this.value;
	            this.elements.wrapper.className = this.style.openWrapper;
	            this.components.panel.element.style.display = 'inline-block';
	            //console.log('ignore focus out');
	            this.ignoreFocusOut = true;
	            this.components.panel.components.searchInput.elements.input.focus();
	            this.components.panel.components.searchInput.elements.input.setSelectionRange(0, this.components.panel.components.searchInput.elements.input.value.length);

	            if (this.autoFind) {
	                this.debouncedFind();
	            }
	        }
	    }, {
	        key: 'closePanel',
	        value: function closePanel() {
	            //console.log('close-panel');
	            this.open = false;
	            this.elements.wrapper.className = this.style.wrapper;
	            this.components.panel.element.style.display = 'none';
	        }
	    }, {
	        key: 'togglePanel',
	        value: function togglePanel() {
	            if (!this.open) {
	                this.openPanel();
	            } else {
	                this.closePanel();
	            }
	        }
	    }]);

	    return AutoComplete;
	}();

	exports.default = AutoComplete;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _dom = __webpack_require__(9);

	var _events = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PresentText = function () {
	    function PresentText(_ref) {
	        var _ref$style = _ref.style;
	        var presentText = _ref$style.presentText;
	        var presentInnerText = _ref$style.presentInnerText;
	        var presentCropText = _ref$style.presentCropText;

	        _classCallCheck(this, PresentText);

	        this.elements = {};

	        this.elements.inner = (0, _dom.div)({
	            className: presentInnerText
	        });

	        this.elements.crop = (0, _dom.div)({
	            className: presentCropText
	        }, this.elements.inner);

	        this.element = (0, _dom.div)({
	            className: presentText
	        }, this.elements.crop);
	    }

	    _createClass(PresentText, [{
	        key: 'text',
	        value: function text(_text) {
	            this.elements.inner.innerText = _text;
	        }
	    }]);

	    return PresentText;
	}();

	exports.default = PresentText;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Source = __webpack_require__(8);

	var _Source2 = _interopRequireDefault(_Source);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SelectSource = function () {
	    function SelectSource() {
	        _classCallCheck(this, SelectSource);
	    }

	    _createClass(SelectSource, [{
	        key: 'find',
	        value: function () {
	            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
	                var value = _ref.value;
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                return _context.abrupt('return', []);

	                            case 1:
	                            case 'end':
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));

	            function find(_x) {
	                return ref.apply(this, arguments);
	            }

	            return find;
	        }()
	    }]);

	    return SelectSource;
	}();

	exports.default = SelectSource;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Source = function () {
	    function Source() {
	        _classCallCheck(this, Source);
	    }

	    _createClass(Source, [{
	        key: 'find',
	        value: function () {
	            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
	                var value = _ref.value;
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                throw new Error('Source class is abstract!');

	                            case 1:
	                            case 'end':
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));

	            function find(_x) {
	                return ref.apply(this, arguments);
	            }

	            return find;
	        }()
	    }, {
	        key: 'abort',
	        value: function abort() {}
	    }]);

	    return Source;
	}();

	exports.default = Source;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.elem = elem;
	exports.input = input;
	exports.div = div;
	exports.ul = ul;
	exports.li = li;
	exports.strong = strong;
	exports.a = a;
	exports.i = i;
	exports.span = span;

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function elem(tag, props) {
	    var domElem = document.createElement(tag);
	    (0, _extend2.default)(domElem, props);

	    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        children[_key - 2] = arguments[_key];
	    }

	    children.forEach(function (child) {
	        domElem.appendChild(child);
	    });
	    return domElem;
	};

	function input(props) {
	    return elem('input', props);
	};

	function div(props) {
	    for (var _len2 = arguments.length, children = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        children[_key2 - 1] = arguments[_key2];
	    }

	    return elem.apply(undefined, ['div', props].concat(children));
	};

	function ul(props) {
	    for (var _len3 = arguments.length, children = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	        children[_key3 - 1] = arguments[_key3];
	    }

	    return elem.apply(undefined, ['ul', props].concat(children));
	};

	function li(props) {
	    for (var _len4 = arguments.length, children = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	        children[_key4 - 1] = arguments[_key4];
	    }

	    return elem.apply(undefined, ['li', props].concat(children));
	};

	function strong(props) {
	    for (var _len5 = arguments.length, children = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
	        children[_key5 - 1] = arguments[_key5];
	    }

	    return elem.apply(undefined, ['strong', props].concat(children));
	};

	function a(props) {
	    for (var _len6 = arguments.length, children = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
	        children[_key6 - 1] = arguments[_key6];
	    }

	    return elem.apply(undefined, ['a', props].concat(children));
	};

	function i(props) {
	    for (var _len7 = arguments.length, children = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
	        children[_key7 - 1] = arguments[_key7];
	    }

	    return elem.apply(undefined, ['i', props].concat(children));
	};

	function span(props) {
	    for (var _len8 = arguments.length, children = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
	        children[_key8 - 1] = arguments[_key8];
	    }

	    return elem.apply(undefined, ['span', props].concat(children));
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.trigger = trigger;
	exports.on = on;
	function trigger(eventName) {
	    if (window.CustomEvent) {
	        var ev = new CustomEvent(eventName);
	        ev.isTrigger = true;
	        this.dispatchEvent(ev);
	    } else if (document.createEvent) {
	        var ev = document.createEvent('HTMLEvents');
	        ev.initEvent(eventName, true, false);
	        ev.isTrigger = true;
	        this.dispatchEvent(ev);
	    } else {
	        this.fireEvent('on' + eventName);
	    }
	};

	function on(eventName, callback) {
	    this.addEventListener(eventName, callback);
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _dom = __webpack_require__(9);

	var _events = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Icon = function () {
	    function Icon(_ref) {
	        var style = _ref.style;

	        _classCallCheck(this, Icon);

	        this.style = style;

	        this.element = (0, _dom.i)({
	            className: style.rightIcon
	        });
	    }

	    _createClass(Icon, [{
	        key: 'loadingStart',
	        value: function loadingStart() {
	            this.element.className = this.style.loadingRightIcon;
	        }
	    }, {
	        key: 'loadingStop',
	        value: function loadingStop() {
	            this.element.className = this.style.rightIcon;
	        }
	    }]);

	    return Icon;
	}();

	exports.default = Icon;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _SearchInput = __webpack_require__(13);

	var _SearchInput2 = _interopRequireDefault(_SearchInput);

	var _ErrorView = __webpack_require__(14);

	var _ErrorView2 = _interopRequireDefault(_ErrorView);

	var _List = __webpack_require__(15);

	var _List2 = _interopRequireDefault(_List);

	var _dom = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Panel = function () {
	    function Panel(_ref, _ref2, autocomplete) {
	        var style = _ref.style;
	        var onSelect = _ref2.onSelect;

	        _classCallCheck(this, Panel);

	        this.components = {
	            searchInput: new _SearchInput2.default({ style: style }),
	            errorView: new _ErrorView2.default({ style: style }),
	            list: new _List2.default({ style: style }, { onSelect: onSelect }, autocomplete)
	        };

	        this.element = (0, _dom.div)({
	            className: style.panel
	        }, this.components.searchInput.elements.wrapper, this.components.errorView.elements.wrapper, this.components.list.elements.wrapper);
	    }

	    _createClass(Panel, [{
	        key: 'show',
	        value: function show(results) {
	            this.components.list.show(results.data);
	        }
	    }, {
	        key: 'error',
	        value: function error(_ref3) {
	            var message = _ref3.message;

	            this.components.errorView.show(message);
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.components.errorView.hide();
	            this.components.list.hide();
	        }
	    }]);

	    return Panel;
	}();

	exports.default = Panel;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _dom = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchInput = function () {
	    function SearchInput(_ref) {
	        var style = _ref.style;

	        _classCallCheck(this, SearchInput);

	        this.elements = {};

	        this.elements.wrapper = (0, _dom.div)({ className: style.searchInputWrapper }, this.elements.input = (0, _dom.input)({
	            className: style.searchInput,
	            placeholder: 'Search...'
	        }));
	    }

	    _createClass(SearchInput, [{
	        key: 'value',
	        value: function value(setValue) {
	            if (typeof setValue !== 'undefined') {
	                this.elements.input.value = setValue;
	                return this;
	            }
	            return this.elements.input.value;
	        }
	    }]);

	    return SearchInput;
	}();

	exports.default = SearchInput;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _dom = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchInput = function () {
	    function SearchInput(_ref) {
	        var style = _ref.style;

	        _classCallCheck(this, SearchInput);

	        this.elements = {};

	        this.elements.wrapper = (0, _dom.div)({ className: style.errorViewWrapper }, this.elements.error = (0, _dom.div)({
	            className: style.errorView
	        }));

	        this.hide();
	    }

	    _createClass(SearchInput, [{
	        key: 'show',
	        value: function show(message) {
	            this.elements.error.innerText = message;
	            this.elements.wrapper.style.display = 'block';
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.elements.wrapper.style.display = 'none';
	        }
	    }]);

	    return SearchInput;
	}();

	exports.default = SearchInput;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extend = __webpack_require__(5);

	var _extend2 = _interopRequireDefault(_extend);

	var _SelectSource = __webpack_require__(7);

	var _SelectSource2 = _interopRequireDefault(_SelectSource);

	var _dom = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var List = function () {
	    function List(_ref, _ref2, autocomplete) {
	        var style = _ref.style;
	        var onSelect = _ref2.onSelect;

	        _classCallCheck(this, List);

	        // Initial value
	        this.elements = {};
	        this.onSelect = onSelect;
	        this.autocomplete = autocomplete;

	        this.elements.wrapper = (0, _dom.div)({ className: style.listWrapper }, this.elements.ul = (0, _dom.ul)());

	        this.hide();
	    }

	    _createClass(List, [{
	        key: 'show',
	        value: function show(items) {
	            this.elements.ul.innerHTML = '';
	            var length = items.length;

	            var childForEmpty = (0, _dom.div)({
	                innerText: 'Empty'
	            });
	            childForEmpty.style.fontStyle = 'italic';
	            this.prepareItemEvents(childForEmpty, { content: null, value: null });
	            var liChildForEmpty = (0, _dom.li)({}, childForEmpty);
	            this.elements.ul.appendChild(liChildForEmpty);

	            for (var index = 0; index < length; index++) {
	                var innerChild = (0, _dom.div)({
	                    innerText: items[index].content
	                });
	                this.prepareItemEvents(innerChild, items[index]);
	                var liChild = (0, _dom.li)({}, innerChild);
	                this.elements.ul.appendChild(liChild);
	            }
	            this.elements.wrapper.style.display = 'block';
	        }
	    }, {
	        key: 'prepareItemEvents',
	        value: function prepareItemEvents(element, data) {
	            var _this = this;

	            element.addEventListener('mousedown', function (event) {
	                //event.preventDefault();
	                //event.stopPropagation();
	                _this.onSelect(data);
	                _this.autocomplete.closePanel();
	            });
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.elements.wrapper.style.display = 'none';
	        }
	    }]);

	    return List;
	}();

	exports.default = List;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = debounce;
	function debounce(func, wait, immediate) {
	    var timeout;
	    return function () {
	        var context = this,
	            args = arguments;
	        var later = function later() {
	            timeout = null;
	            if (!immediate) func.apply(context, args);
	        };
	        var callNow = immediate && !timeout;
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	        if (callNow) func.apply(context, args);
	    };
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ENTER = exports.ENTER = 13;
	var SPACE = exports.SPACE = 32;
	var ESC = exports.ESC = 27;
	var ARROW_UP = exports.ARROW_UP = 38;
	var ARROW_DOWN = exports.ARROW_DOWN = 40;
	var ARROW_RIGHT = exports.ARROW_RIGHT = 39;
	var ARROW_LEFT = exports.ARROW_LEFT = 37;
	var TAB = exports.TAB = 9;
	var SHIFT = exports.SHIFT = 16;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Source = __webpack_require__(8);

	var _Source2 = _interopRequireDefault(_Source);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AjaxSource = function () {
	    function AjaxSource(url) {
	        _classCallCheck(this, AjaxSource);

	        this.url = url;
	        this.request = null;
	    }

	    _createClass(AjaxSource, [{
	        key: 'prepareRequest',
	        value: function prepareRequest(params) {
	            this.request = new XMLHttpRequest();
	            var paramUrl = Object.keys(params).map(function (key) {
	                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	            }).join('&');
	            this.request.open('GET', this.url + '?' + paramUrl, true);
	        }
	    }, {
	        key: 'abort',
	        value: function abort() {
	            this.request && this.request.abort && this.request.abort();
	        }
	    }, {
	        key: 'send',
	        value: function send() {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                _this.request.onreadystatechange = function () {
	                    console.log('readyState change', _this.request.readyState, _this.request.status, _this.request);
	                    if (_this.request.readyState == 4 && _this.request.status == 200) {
	                        var json = JSON.parse(_this.request.responseText);
	                        _this.request = null;
	                        resolve(json);
	                    } else if (_this.request.readyState == 4 && _this.request.status != 200) {
	                        reject(new Error(_this.request.responseText));
	                    }
	                };
	                _this.request.send();
	            });
	        }
	    }, {
	        key: 'find',
	        value: function () {
	            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(params) {
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                this.prepareRequest(params);
	                                _context.next = 3;
	                                return this.send();

	                            case 3:
	                                return _context.abrupt('return', _context.sent);

	                            case 4:
	                            case 'end':
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));

	            function find(_x) {
	                return ref.apply(this, arguments);
	            }

	            return find;
	        }()
	    }]);

	    return AjaxSource;
	}();

	exports.default = AjaxSource;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Source = __webpack_require__(8);

	var _Source2 = _interopRequireDefault(_Source);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ArraySource = function () {
	    function ArraySource() {
	        var data = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	        _classCallCheck(this, ArraySource);

	        this.data = data;
	    }

	    _createClass(ArraySource, [{
	        key: 'find',
	        value: function () {
	            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
	                var value = _ref.value;
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                return _context.abrupt('return', {
	                                    data: this.data
	                                });

	                            case 1:
	                            case 'end':
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));

	            function find(_x2) {
	                return ref.apply(this, arguments);
	            }

	            return find;
	        }()
	    }]);

	    return ArraySource;
	}();

	exports.default = ArraySource;

/***/ }
/******/ ]);