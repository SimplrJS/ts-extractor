import { LoggerBuilder, LoggerConfigurationBuilder, LogLevel } from "simplr-logger";

const LoggerConfiguration = new LoggerConfigurationBuilder()
    .SetLogLevel(LogLevel.Trace)
    .Build();

export const Logger = new LoggerBuilder(LoggerConfiguration);
