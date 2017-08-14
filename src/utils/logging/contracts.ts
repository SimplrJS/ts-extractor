export type WriteMessageHandler = (level: LogLevel, message: string, exception?: Error) => void;

export type MessageFormatter<TMessage = string> = (message: TMessage, exception?: Error) => string;

export type LogLevelFilters = {[key in LogLevels]: boolean};

/**
 * String values of log levels.
 */
export type LogLevels = "Trace" | "Debug" | "Information" | "Warning" | "Error" | "Critical" | "None";

/**
 * Defines logging severity levels.
 */
export enum LogLevel {
    /**
     * Logs that contain the most detailed messages. These messages may contain sensitive application data.
     * These messages are disabled by default and should never be enabled in a production environment.
     */
    Trace = 0,

    /**
     * Logs that are used for interactive investigation during development.
     * These logs should primarily contain information useful for debugging and have no long-term value.
     */
    Debug = 1,

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     */
    Information = 2,

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow,
     * but do not otherwise cause the application execution to stop.
     */
    Warning = 3,

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * These should indicate a failure in the current activity, not an application-wide failure.
     */
    Error = 4,

    /**
     * Logs that describe an unrecoverable application or system crash,
     * or a catastrophic failure that requires immediate attention.
     */
    Critical = 5,

    /**
     * Not used for writing log messages. Specifies that a logging category should not write any messages.
     */
    None = 6
}
