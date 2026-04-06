import path from "path";
import winston from "winston";

// ─── Caller Detection (tsx source-map aware) ────────────────────────────────

const STACK_RE = /at .+? \((.+):(\d+):\d+\)|at (.+):(\d+):\d+/;

function getCallerInfo(depth: number): string {
	const frames = new Error().stack?.split("\n") ?? [];
	const frame = frames[depth + 1];
	if (frame) {
		const match = STACK_RE.exec(frame);
		if (match) {
			const raw = match[1] || match[3];
			const line = match[2] || match[4];
			return `${path.relative(process.cwd(), raw).replace(/\\/g, "/")}:${line}`;
		}
	}
	return "unknown:0";
}

// ─── Box Formatter ──────────────────────────────────────────────────────────

const BOX_WIDTH = 100;
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function visibleLength(str: string): number {
	return str.replace(ANSI_RE, "").length;
}

function wordWrap(text: string, maxWidth: number): string[] {
	const words = text.split(/( +)/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const projected = current + word;
		if (visibleLength(projected) > maxWidth && current.trim().length > 0) {
			lines.push(current.trimEnd());
			current = word.trimStart();
		} else {
			current = projected;
		}
	}
	if (current.trim().length > 0) lines.push(current.trimEnd());
	return lines.length > 0 ? lines : [""];
}

function boxed(text: string): string {
	const wrapped = text.split("\n").flatMap((l) => wordWrap(l, BOX_WIDTH));
	const border = "─".repeat(BOX_WIDTH + 2);
	return [`┌${border}`, ...wrapped.map((l) => `│ ${l}`), `└${border}`].join("\n");
}

// ─── Winston Setup ──────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
	debug: "\x1b[36m",
	info: "\x1b[32m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
	critical: "\x1b[1m\x1b[31m",
};
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const RST = "\x1b[0m";

const CUSTOM_LEVELS = {
	levels: { critical: 0, error: 1, warn: 2, info: 3, debug: 4 },
	colors: { critical: "bold red", error: "red", warn: "yellow", info: "green", debug: "cyan" },
};

const RESERVED_KEYS = new Set(["level", "message", "timestamp", "caller", "loggerName", "splat"]);

const boxedFormat = winston.format.printf((info) => {
	const color = LEVEL_COLORS[info.level] || RST;
	const label = (info.level === "warn" ? "WARNING" : info.level.toUpperCase()).padEnd(8);

	const levelStr = `${color}${label}${RST}`;
	const nameStr = `${BLUE}[${info["loggerName"] || "app"}]${RST}`;
	const locStr = `${CYAN}${info["caller"] || "unknown:0"}${RST}`;
	const msgStr = `${color}${info.message}${RST}`;

	let line = `${levelStr} ${info["timestamp"]} ${nameStr} ${locStr} - ${msgStr}`;

	// Auto-append extra fields (mirrors Python's auto extra fields)
	const extras = Object.entries(info).filter(([k]) => !RESERVED_KEYS.has(k));
	if (extras.length > 0) {
		const pairs = extras.map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`).join(" ");
		line += ` ${color}[${pairs}]${RST}`;
	}

	return boxed(line);
});

// ─── Logger Factory ─────────────────────────────────────────────────────────

const container = new winston.Container();

type LogFn = (message: string, meta?: Record<string, unknown>) => void;

interface AppLogger {
	debug: LogFn;
	info: LogFn;
	warn: LogFn;
	warning: LogFn;
	error: LogFn;
	critical: LogFn;
	child: (meta: Record<string, unknown>) => AppLogger;
}

function wrapLogger(wLogger: winston.Logger): AppLogger {
	const call = (level: string) => (message: string, meta?: Record<string, unknown>) => {
		(wLogger as Record<string, Function>)[level](message, { ...meta, caller: getCallerInfo(2) });
	};
	return {
		debug: call("debug"),
		info: call("info"),
		warn: call("warn"),
		warning: call("warn"),
		error: call("error"),
		critical: call("critical"),
		child: (meta) => wrapLogger(wLogger.child(meta)),
	};
}

function getLogger(name: string, level: string = "debug"): AppLogger {
	if (!container.has(name)) {
		container.add(name, {
			levels: CUSTOM_LEVELS.levels,
			level,
			format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), boxedFormat),
			transports: [new winston.transports.Console({ level, stderrLevels: ["error", "critical"] })],
			defaultMeta: { loggerName: name },
		});
	}
	return wrapLogger(container.get(name));
}

function setupLogging(options?: { level?: string }) {
	winston.addColors(CUSTOM_LEVELS.colors);
	if (options?.level) {
		container.loggers.forEach((logger) => {
			logger.level = options.level!;
			logger.transports.forEach((t) => (t.level = options.level));
		});
	}
}

export { getLogger, setupLogging };
export type { AppLogger };
