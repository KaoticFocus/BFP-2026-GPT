// BuildFlow Pro AI Constants

export const API_VERSION = 'v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const DEVICE_CODE_EXPIRY_MINUTES = 15;
export const DEVICE_CODE_POLL_INTERVAL_SECONDS = 5;
export const SESSION_EXPIRY_DAYS = 7;

export const FILE_UPLOAD_MAX_SIZE = 50 * 1024 * 1024; // 50MB
export const PRESIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

export const OUTBOX_POLL_INTERVAL_MS = 1000;
export const OUTBOX_MAX_RETRIES = 5;

export const SYNC_BATCH_SIZE = 100;
export const SYNC_PULL_PAGE_SIZE = 50;

export const AI_DEFAULT_MODEL = 'gpt-4o';
export const AI_EMBEDDING_MODEL = 'text-embedding-3-small';
export const AI_EMBEDDING_DIMENSIONS = 1536;

export const QUIET_HOURS_DEFAULT_START = 21; // 9 PM
export const QUIET_HOURS_DEFAULT_END = 8; // 8 AM

export const DRIFT_THRESHOLD_PERCENT = 10; // Alert when budget drifts > 10%
