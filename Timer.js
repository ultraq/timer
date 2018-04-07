/* 
 * Copyright 2015, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Interval between timer checks to see if the resolution between ticks has
 * elapsed and thus the callback should be invoked.
 * 
 * TODO: If I choose to use requestAnimationFrame in future, I can probably get
 *       rid of this.  And then the Animation class can just make use of this as
 *       the timing mechanism.
 * 
 * @const {Number}
 */
const DEFAULT_CHECK_INTERVAL = 50;

/**
 * Basic timer class that executes a function which is passed the time elapsed
 * since the timer was started.
 * 
 * @author Emanuel Rabina
 */
export default class Timer {

	/**
	 * Constructor, configures the timer to run the given callback function and
	 * other options.
	 * 
	 * @param {Function} callback
	 *   Function to execute at every 'tick' of the timer.
	 * @param {Number} [resolution=1000]
	 *   Time to elapse, in milliseconds, between ticks.
	 * @param {Number} [duration=-1]
	 *   For how long, in milliseconds, the timer should run, barring early calls
	 *   to {@link Timer#stop}.  A value of -1 (the default) means the timer
	 *   should go forever.
	 */
	constructor(callback, resolution = 1000, duration = -1) {

		this.callback   = callback;
		this.resolution = resolution;
		this.duration   = duration;
	}

	/**
	 * Starts the timer.  Runs from now until the configured duration, or by a
	 * call to {@link Timer#stop}.
	 */
	start() {

		const start = Date.now();
		let lastTick = start;
		this.tickId = setInterval(() => {
			const now = Date.now();
			const diff = now - lastTick;
			if (diff >= this.resolution) {
				lastTick = now;
				const timeElapsed = now - start;
				if (timeElapsed < this.duration || this.duration === -1) {
					this.callback(timeElapsed);
				}
				else {
					clearInterval(this.tickId);
				}
			}
		}, DEFAULT_CHECK_INTERVAL);
	}

	/**
	 * Stops the timer.
	 */
	stop() {

		clearInterval(this.tickId);
	}
}
