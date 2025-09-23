import * as vscode from "vscode";

export async function textEditorCommand(textEditor: vscode.TextEditor){
    // Replace all variables in active editor with cat names and words
    const text = textEditor.document.getText();

    let chatResponse: vscode.LanguageModelChatResponse | undefined;
    try {
        // Use gpt-4o since it is fast and high quality.
        const [model] = await vscode.lm.selectChatModels({
            vendor: "copilot",
            family: "gpt-4o",
        });
        if (!model) {
            console.log(
                "Model not found. Please make sure the GitHub Copilot Chat extension is installed and enabled."
            );
            return;
        }

        const messages = [
            vscode.LanguageModelChatMessage
                .User(`You are a farmer. 
                    Your job is to replace all variable names in the following code with fruit names. Be creative. 
                    Then add a comment how many script.ts and index.js files there are in the workspace. 
                    IMPORTANT respond just with code. Do not use markdown!`),
            vscode.LanguageModelChatMessage.User(text),
        ];
        chatResponse = await model.sendRequest(
            messages,
            {tools: [{name: 'chat-tools-find_files', description: 'Find files in the workspace'}]},
            new vscode.CancellationTokenSource().token
        );
    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.log(err.message, err.code, err.cause);
        } else {
            throw err;
        }
        return;
    }

    // Clear the editor content before inserting new content
    await textEditor.edit((edit) => {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
            textEditor.document.lineCount - 1,
            textEditor.document.lineAt(
                textEditor.document.lineCount - 1
            ).text.length
        );
        edit.delete(new vscode.Range(start, end));
    });

    // Stream the code into the editor as it is coming in from the Language Model
    try {
        for await (const fragment of chatResponse.text) {
            await textEditor.edit((edit) => {
                const lastLine = textEditor.document.lineAt(
                    textEditor.document.lineCount - 1
                );
                const position = new vscode.Position(
                    lastLine.lineNumber,
                    lastLine.text.length
                );
                edit.insert(position, fragment);
            });
        }
    } catch (err) {
        // async response stream may fail, e.g network interruption or server side error
        await textEditor.edit((edit) => {
            const lastLine = textEditor.document.lineAt(
                textEditor.document.lineCount - 1
            );
            const position = new vscode.Position(
                lastLine.lineNumber,
                lastLine.text.length
            );
            edit.insert(position, (err as Error).message);
        });
    }
}
