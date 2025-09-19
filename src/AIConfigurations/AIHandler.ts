import * as vscode from "vscode";
import { getLogger } from "../Helpers/Logger";

interface ICatChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    };
}

export function getAIHandler(): vscode.ChatParticipant {
    const logger = getLogger();

    // Define a Cat chat handler.
    const handler: vscode.ChatRequestHandler = async (
        request: vscode.ChatRequest,
        context: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<ICatChatResult> => {
        // To talk to an LLM in your subcommand handler implementation, your
        // extension can use VS Code's `requestChatAccess` API to access the Copilot API.
        // The GitHub Copilot Chat extension implements this provider.
        stream.progress("Picking the right topic to teach...");
        try {
            const messages = [
                vscode.LanguageModelChatMessage.User(
                    "You are a cat! Your job is to explain LINKED LIST"
                ),
            ];

            const chatResponse = await request.model.sendRequest(
                messages,
                {},
                token
            );
            for await (const fragment of chatResponse.text) {
                stream.markdown(fragment);
            }
        } catch (err) {
            // handle
        }

        stream.button({
            command: "ButtonCommand",
            title: vscode.l10n.t("Use Cat Names in Editor"),
        });

        logger.logUsage("request", { kind: request.command });
        return { metadata: { command: request.command ?? 'unknown' } };
    };

    // Chat participants appear as top-level options in the chat input
    // when you type `@`, and can contribute sub-commands in the chat input
    // that appear when you type `/`.
    return vscode.chat.createChatParticipant(
        "CodeGenChat",
        handler
    );
}
