import { cleanEnv, num, str, makeValidator, port } from 'envalid';

// Defining here to include "yes" as an option
const bool = makeValidator<boolean>((input: string) => {
	return ['yes', 'true', 't', 'y', '1'].includes(input.toLowerCase());
});

// clone process.env since we modify it in some places, so we cannot freeze it
const env = { ...process.env };

export const config = cleanEnv(env, {
	TEST_MODE: bool({ default: false }),
	HTTP_FORWARDED_COUNT: num({ default: 0 }),
	MAIL_URL: str({ default: '' }), // check, this is being overriden in code
	MAX_RESUME_LOGIN_TOKENS: num({ default: 50 }),
	REG_TOKEN: str({ default: '' }),
	FEDERATED_DOMAINS_LENGTH: num({ default: 10 }),
	HOME: str({ default: '' }),
	HOMEPATH: str({ default: '' }),
	USERPROFILE: str({ default: '' }),
	TMPDIR: str({ default: '' }),
	INSTANCE_IP: str({ default: '' }),
	ROCKET_CHAT_DEPRECATION_THROW_ERRORS_FOR_VERSIONS_UNDER: str({ default: '' }),
	OBSERVERS_CHECK_TIMEOUT: num({ default: 2 * 60 * 1000 }),
	OBSERVERS_CHECK_INTERVAL: num({ default: 60 * 1000 }),
	OBSERVERS_CHECK_DEBUG: bool({ default: false }),
	EXIT_UNHANDLEDPROMISEREJECTION: bool({ default: false }),
	CREATE_TOKENS_FOR_USERS: bool({ default: false }),
	RATE_LIMITER_LOGGER: str({ default: '' }),
	RATE_LIMITER_SLOWDOWN_RATE: num({ default: 0 }),
	// This should be a `port`, but made `num` to keep the default value logic
	PROMETHEUS_PORT: num({ default: 0 }),
	BIND_IP: str({ default: '0.0.0.0' }),
	NOTIFICATIONS_WORKER_TIMEOUT: num({ default: 2000 }),
	NOTIFICATIONS_BATCH_SIZE: num({ default: 100 }),
	NOTIFICATIONS_SCHEDULE_DELAY_ONLINE: num({ default: 120 }),
	NOTIFICATIONS_SCHEDULE_DELAY_AWAY: num({ default: 0 }),
	NOTIFICATIONS_SCHEDULE_DELAY_OFFLINE: num({ default: 0 }),
	DEBUG_SETTINGS: bool({ default: false }),
	SETTINGS_BLOCKED: str({ default: '' }),
	SETTINGS_HIDDEN: str({ default: '' }),
	SETTINGS_REQUIRED_ON_WIZARD: str({ default: '' }),
	DEPLOY_METHOD: str({ default: 'tar' }),
	DEPLOY_PLATFORM: str({ default: 'selfinstall' }),
	DISABLE_ANIMATION: bool({ default: false }),
	BUGSNAG_CLIENT: str({ default: '' }),
	STATIC_SEED: str({ default: '' }),
	LICENSE_DEBUG: bool({ default: false }),
	ROCKETCHAT_LICENSE: str({ default: '' }),
	WAIT_FOR_SERVICES_TIMEOUT: num({ default: 10000 }),
	OVERWRITE_INTERNAL_MARKETPLACE_URL: str({ default: '' }),
	LICENSE_CHECK_INTERVAL: num({ default: 20 }),
	MAX_FAILS: num({ default: 2 }),
	TCP_PORT: port({ default: 1 }),
	PORT: port({ default: 4000 }),
	MONGO_URL: str({ default: 'mongodb://localhost:27017/rocketchat' }),
	PROXY_HOST: str({ default: 'localhost' }),
	PROXY_PORT: port({ default: 3000 }),
	MULTIPLE_INSTANCES_PING_INTERVAL: num({ default: 10000 }),
	IGNORE_CHANGE_STREAM: bool({ default: false }),
	USE_NATIVE_OPLOG: bool({ default: false }),
	CHANGESTREAM_FULL_DOCUMENT: bool({ default: false }),
	MONGO_OPLOG_URL: str({ default: '' }),
	DBWATCHER_EXCLUDE_COLLECTIONS: str({ default: '' }),
	DBWATCHER_ONLY_COLLECTIONS: str({ default: '' }),

	// ms envs
	MS_NAMESPACE: str({ default: '' }),
	TRANSPORTER: str({ default: '' }),
	TRANSPORTER_EXTRA: str({ default: '' }),
	CACHE: str({ default: 'Memory' }),
	SERIALIZER: str({ default: 'EJSON' }),
	MOLECULER_LOG_LEVEL: str({ default: 'warn' }),
	BALANCE_STRATEGY: str({ default: 'RoundRobin' }),
	BALANCE_PREFER_LOCAL: bool({ default: false }),
	RETRY_FACTOR: num({ default: 2 }),
	RETRY_MAX_DELAY: num({ default: 1000 }),
	RETRY_DELAY: num({ default: 100 }),
	RETRY_RETRIES: num({ default: 5 }),
	RETRY_ENABLED: bool({ default: false }),
	REQUEST_TIMEOUT: num({ default: 10 }),
	HEARTBEAT_INTERVAL: num({ default: 10 }),
	HEARTBEAT_TIMEOUT: num({ default: 30 }),
	BULKHEAD_ENABLED: bool({ default: false }),
	BULKHEAD_CONCURRENCY: num({ default: 10 }),
	BULKHEAD_MAX_QUEUE_SIZE: num({ default: 10000 }),
	MS_METRICS: bool({ default: false }),
	MS_METRICS_PORT: port({ default: 9458 }),
	TRACING_ENABLED: bool({ default: false }),
	SKIP_PROCESS_EVENT_REGISTRATION: bool({ default: false }),
});
