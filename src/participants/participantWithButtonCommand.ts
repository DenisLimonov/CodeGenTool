// Implementing a chat participant consists of the following parts:
// 1) Define the chat participant in the package.json file of your extension.
// 2) Implement a request handler to process the user's chat prompt and return a response.
// 3) (Optional) Implement chat slash commands to provide users with a shorthand notation for common tasks.
// 4) (Optional) Define suggested follow-up questions.
// 5) (Optional) Implement participant detection where VS Code automatically routes a chat request to the appropriate chat participant without explicit mention from the user.

import * as vscode from "vscode";

interface ICatChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    };
}

export function getParticipantWithButtonCommand(): vscode.ChatRequestHandler {
    const handler: vscode.ChatRequestHandler = async (
        request: vscode.ChatRequest,
        context: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<ICatChatResult> => {
        stream.progress("Waiting for command...");

        stream.button({
            command: "MyCommandText",
            title: vscode.l10n.t("MyCommandText"),
        });

        return { metadata: { command: "MyCommandText" } };
    };

    return handler;
}
