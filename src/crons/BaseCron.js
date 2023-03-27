import { CronJob } from 'cron';

/**
 * BaseCron class for cron jobs.
 *
 * @class BaseCron
 */
export default class BaseCron {
  /** @type {import(@utils/Lock)} */
  lock;

  /**
   * Creates an instance of BaseCron.
   *
   * @param {string} cronName
   * @param {string} cronTime
   * @public
   * @memberof BaseCron
   */
  constructor(cronName, cronTime, container) {
    if (!cronName || !container) {
      throw new Error('ERR_INVALID_ARG_VALUE');
    }

    this.lock = container.get('lockInstance');
    this.cronName = cronName;
    this.cronTime = cronTime;
    this.cronJob = new CronJob(this.cronTime, this.onTick.bind(this), this.onComplete.bind(this));
  }

  /**
   * Starts the cron job.
   *
   * @public
   * @memberof BaseCron
   */
  start() {
    this.cronJob.start();
  }

  /**
   * Stops the cron job.
   *
   * @public
   * @memberof BaseCron
   */
  stop() {
    this.cronJob.stop();
  }

  lockResource() {
    return this.lock.acquire(this.cronName);
  }

  async releaseResource(lock) {
    this.lock.release(lock);
  }

  // eslint-disable-next-line class-methods-use-this
  async implement() {
    throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
  }

  /**
   * Function onTick for the current cron job.
   *
   * @public
   * @memberof BaseCron
   */
  async onTick() {
    const acquiredLock = await this.lockResource();
    await this.implement();
    this.releaseResource(acquiredLock);
  }

  /**
   * Function onComplete for the current cron job executes when cron is stopped.
   *
   * @public
   * @memberof BaseCron
   */
  // eslint-disable-next-line class-methods-use-this
  async onComplete() {
    // Implement in child class
  }

  /**
   * Returns an instance of cron npm module.
   *
   * @public
   * @memberof BaseCron
   */
  getCronInstance() {
    return this.cronJob;
  }

  /**
   * Check if current cron job is running.
   *
   * @public
   * @memberof BaseCron
   */
  isCronRunning() {
    return this.cronJob.running;
  }
}
