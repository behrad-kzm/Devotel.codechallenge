import { Request, Response, NextFunction } from 'express';
import { Logger, OTLPUtils, TelemetryMiddleware } from '../../src/utils';

export function mockLogger() {
  jest.spyOn(Logger, 'setup').mockImplementation(async () => { });

  jest.spyOn(Logger, 'logResponseError').mockImplementation(async () => { });

  jest.spyOn(Logger, 'logError').mockImplementation(async () => { });

  jest.spyOn(Logger, 'logMessage').mockImplementation(async () => { });

  jest.spyOn(Logger, 'sendLog').mockImplementation(async () => { });

  jest.spyOn(Logger, 'sendError').mockImplementation(async () => { });
}

export function mockOpenTelemetry() {
  jest.spyOn(TelemetryMiddleware.prototype, 'use').mockImplementation((req: Request, res: Response, next: NextFunction) => {
    next();
  });

  jest.spyOn(OTLPUtils, 'span').mockImplementation(({ spanName, title, body }: { spanName: string, title: string, body: () => Promise<Error | undefined> }) => {
    return new Promise(async (resolve, _) => {
      await body();
      return resolve();
    });
  })
}


export function mockAll() {
  mockLogger();
  mockOpenTelemetry();

  // [TODO] complete the list of mocks

  return { 
    // add more mocks here
  };
}

export function resetAdditionalMocks() {
  jest.clearAllMocks();
  return mockAll();
}