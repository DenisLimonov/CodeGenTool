// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { textEditorCommand } from "./commands/textEditorCommand";
import { getLogger } from "./Helpers/Logger";
import { FindFilesTool } from "./tools/findFilesTool";
import { getParticipantWithButtonCommand } from "./participants/participantWithButtonCommand";
import { getParticipantWithTool } from "./participants/toolParticipant";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "CodeGenTool" is now active!');

    const logger = getLogger();

    const idk = vscode.commands.registerTextEditorCommand(
        "MyCommandText",
        textEditorCommand
    );
    const idk2 = vscode.lm.registerTool(
        "chat-tools-find_files",
        new FindFilesTool()
    );

    const participantWithButton = vscode.chat.createChatParticipant(
        "chat-participants-participantWithButtonCommand",
        getParticipantWithButtonCommand()
    );

    const participantWithTool = vscode.chat.createChatParticipant(
        "chat-participants-participantWithTool",
        getParticipantWithTool()
    );

    context.subscriptions.push(idk);
    context.subscriptions.push(idk2);
    context.subscriptions.push(logger);
    context.subscriptions.push(participantWithButton);
    context.subscriptions.push(participantWithTool);
}

// This method is called when your extension is deactivated
export function deactivate() {}
