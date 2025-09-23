// When a user sends a chat prompt, the following steps occur:

// 1) Copilot determines the list of available tools based on the user's configuration.
//    The list of tools consists of built-in tools, tools registered by extensions, and tools from MCP servers. You can contribute to agent mode via extensions or MCP servers (shown in green in the diagram).

// 2) Copilot sends the request to the LLM and provides it with the prompt, chat context, and the list of tool definitions to consider.
//    The LLM generates a response, which might include one or more requests to invoke a tool.

// 3) If needed, Copilot invokes the suggested tool(s) with the parameter values provided by the LLM.
//    A tool response might result in more requests for tool invocations.

// 4) If there are errors or follow-up tool requests, Copilot iterates over the tool-calling flow until all tool requests are resolved.

// 5) Copilot returns the final response to the user, which might include responses from multiple tools.
import * as vscode from 'vscode';

export interface IFindFilesParameters {
	pattern: string;
}

export class FindFilesTool implements vscode.LanguageModelTool<IFindFilesParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IFindFilesParameters>,
		token: vscode.CancellationToken
	) {
		const params = options.input as IFindFilesParameters;
		const files = await vscode.workspace.findFiles(
			params.pattern,
			'**/node_modules/**',
			undefined,
			token
		);

		const strFiles = files.map((f) => f.fsPath).join('\n');
		return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Found ${files.length} files matching "${params.pattern}":\n${strFiles}`)]);
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<IFindFilesParameters>,
		_token: vscode.CancellationToken
	) {
		return {
			invocationMessage: `Searching workspace for "${options.input.pattern}"`,
		};
	}
}