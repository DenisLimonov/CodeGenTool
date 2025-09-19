// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { simpleParticipant, textEditorCommand } from './commands/chat';
import { getLogger } from './Helpers/Logger';
import { getAIHandler } from './AIConfigurations/AIHandler';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "CodeGenTool" is now active!');

	const chatParticipant: vscode.ChatParticipant = getAIHandler();
	const logger = getLogger();

	const idk = vscode.commands.registerCommand('MyCommand', simpleParticipant);
	const idk2 = vscode.commands.registerTextEditorCommand('MyCommandText', textEditorCommand);
	

	context.subscriptions.push(
		chatParticipant.onDidReceiveFeedback(
			(feedback: vscode.ChatResultFeedback) => {
				// Log chat result feedback to be able to compute the success matric of the participant
				// unhelpful / totalRequests is a good success metric
				logger.logUsage("chatResultFeedback", {
					kind: feedback.kind,
				});
			}
		)
	);
	context.subscriptions.push(idk);
	context.subscriptions.push(idk2);
	context.subscriptions.push(chatParticipant);
	context.subscriptions.push(logger);
}

// This method is called when your extension is deactivated
export function deactivate() {}
