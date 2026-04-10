export function formatDbError(err: any): string {
  // Mongo duplicate key
  if (err && err.code === 11000) {
    const keys = Object.keys(err.keyValue || {});
    if (keys.length) return `${keys[0]} already exists`;
    return 'Duplicate key error';
  }

  // Mongoose validation errors
  if (err && err.name === 'ValidationError' && err.errors) {
    const msgs = Object.values(err.errors).map((e: any) => e.message);
    return msgs.join('; ');
  }

  // Fallback to message
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Database error';
}
