import {
    LogLevel,
    WriteMessageHandler,
    MessageFormatter,
    LogLevels,
    LogLevelFilters
} from "./contracts";

const defaultFormatter: MessageFormatter = message => message;

export class Logging {
    constructor(
        private filters?: LogLevelFilters,
        private writeMessageHandler?: WriteMessageHandler
    ) { }

    /**
     * Writes a log entry.
     * @param level Entry will be written on this level.
     * @param state The entry to be written. Can be also an object.
     * @param exception The exception related to this entry.
     * @param formatter Function to create a `string` message of the `state` and `exception`.
     */
    public Log<TState = string>(
        level: LogLevel,
        state: TState,
        exception: Error | undefined = undefined,
        formatter: MessageFormatter<TState> = (message, error) => message != null ? message.toString() : message
    ): void {
        if (!this.IsEnabled(level)) {
            return;
        }
        const message: string = formatter(state, exception);

        if (this.writeMessageHandler != null) {
            this.writeMessageHandler(level, message, exception);
        } else {
            this.WriteMessage(level, message, exception);
        }
    }

    public WriteMessage(level: LogLevel, message: string, exception?: Error): void {
        if (this.writeMessageHandler != null) {
            this.writeMessageHandler(level, message, exception);
            return;
        }

        const logLevelString = this.getLogLevelString(level);
        const exceptionMessage = exception != null ? exception : "";

        switch (level) {
            case LogLevel.Critical:
            case LogLevel.Error: {
                console.error(`${logLevelString}:`, message, exceptionMessage);
                break;
            }
            case LogLevel.Information: {
                console.info(`${logLevelString}:`, message, exceptionMessage);
                break;
            }
            default: {
                // tslint:disable-next-line:no-console
                console.log(`${logLevelString}:`, message, exceptionMessage);
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

    private getLogLevelString(level: LogLevel): string {
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
            default:
                throw Error(`LogLevel ${level} is not implemented!`);
        }
    }

}
