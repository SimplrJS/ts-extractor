import {
    LogLevel,
    WriteMessageHandler,
    MessageFormatter,
    LogLevels,
    LogLevelFilters,
    LogMessageMethod
} from "./contracts";

export class Logging {
    constructor(private filters?: LogLevelFilters, private writeMessageHandler?: WriteMessageHandler) { }

    /**
     * @param formatter Function to create a `string` message of the `state` and `exception`.
     */
    public WithFormatter = (formatter: MessageFormatter): { Log: LogMessageMethod } => ({ Log: this.log.bind(this, formatter) });

    /**
     * Writes a log entry.
     *
     * @param level Entry will be written on this level.
     * @param messages Messages to be written.
     */
    public Log: LogMessageMethod = (level: LogLevel, ...messages: any[]) => this.log(undefined, level, ...messages);

    private log(formatter: MessageFormatter | undefined, level: LogLevel, ...messages: any[]): void {
        if (!this.IsEnabled(level)) {
            return;
        }

        let formattedMessages = (formatter != null) ? formatter(...messages) : messages;
        if (!Array.isArray(formattedMessages)) {
            formattedMessages = [formattedMessages];
        }

        return this.WriteMessage(level, messages);
    }

    /**
     * Write a list of messages to the console.
     *
     * @param level Entry will be written on this level.
     * @param messages Messages list to be written.
     */
    public WriteMessage(level: LogLevel, messages: any[]): void {
        if (this.writeMessageHandler != null) {
            this.writeMessageHandler(level, messages);
            return;
        }

        const logLevelString = this.GetLogLevelString(level);

        switch (level) {
            case LogLevel.Critical:
            case LogLevel.Error: {
                console.error(`${logLevelString}:`, ...messages);
                break;
            }
            case LogLevel.Information: {
                console.info(`${logLevelString}:`, ...messages);
                break;
            }
            case LogLevel.Warning: {
                console.warn(`${logLevelString}:`, ...messages);
                break;
            }
            case LogLevel.None: {
                break;
            }
            default: {
                // tslint:disable-next-line:no-console
                console.log(`${logLevelString}:`, ...messages);
            }
        }
    }

    public SetFilters(filters: LogLevelFilters): void {
        this.filters = filters;
    }

    public IsEnabled(level: LogLevel): boolean {
        if (this.filters == null) {
            return true;
        }

        const levelName = LogLevel[level] as LogLevels;

        return this.filters[levelName];
    }

    protected GetLogLevelString(level: LogLevel): string {
        switch (level) {
            case LogLevel.Trace:
                return "trce";
            case LogLevel.Debug:
                return "dbug";
            case LogLevel.Information:
                return "info";
            case LogLevel.Warning:
                return "warn";
            case LogLevel.Error:
                return "fail";
            case LogLevel.Critical:
                return "crit";
            case LogLevel.None:
                return "none";
        }
    }

}
