// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 *  Mock class and remove logging output from UTs.
 */
class Log {
  error(message: string): void {
    console.log(`[ERROR] ${message}`);
  }

  warn(message: string): void {
    console.log(`[WARN] ${message}`);
  }

  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  userAction(message: string): void {
    console.log(`[USER ACTION] ${message}`);
  }

  test(message: string): void {
    console.log(`============================== ${message} ==============================`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  verbose(_message: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  debug(_message: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  silly(_message: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  ipc(_message: string): void {}
}

export default new Log();
