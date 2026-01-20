export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public name: string,
    message: string,
  ) {
    super(message);
  }
}

export const badRequest = (msg: string) =>
  new HttpError(400, "BadRequest", msg);

export const unauthorized = (msg: string) =>
  new HttpError(401, "Unauthorized", msg);

export const forbidden = (msg: string) => new HttpError(403, "Forbidden", msg);

export const notFound = (msg: string) => new HttpError(404, "NotFound", msg);

export const conflict = (msg: string) => new HttpError(409, "Conflict", msg);
