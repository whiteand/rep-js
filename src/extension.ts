// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("rep-js.rep", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage(`There is no active text editor`);
      return;
    }
    const selection = editor.selection;
    const startLineBeginning = editor.document.lineAt(selection.start.line)
      .range.start;
    const endLineEnd = editor.document.lineAt(selection.end.line).range.end;

    const selectionText = editor.document
      .getText(new vscode.Range(startLineBeginning, endLineEnd))
      .trim();

    if (!selectionText) {
      vscode.window.showInformationMessage(`You should select js code`);
      return;
    }
    const jsCodeToBeRun = `
	    (function gen(window, globalThis, global) {
			const _rep_result = [];
			function write(text) {
				_rep_result.push(text)
			};
			function writeline(...texts) {
				for (const text of texts) {
					write(texts.toString())
					write('\\n')
				}
			};
			function __comment(prefix, args) {
				writeline('/* ' + prefix)
				writeline(...args)
				writeline('*/')
			}
			const console = {
				log(...args) {
					__comment('console.log', args)
				}
				error(...args) {
					__comment('console.error', args)
				}
				warn(...args) {
					__comment('console.warn', args)
				}
			}
			;${selectionText};
			return _rep_result.join('');
		})(null, null, null)
	`;
    const code = `
		(function(window, globalThis){
			const _rep_result = [];
			const __logs = []
			function __flushLogs() {
				const combined = []
				let last = { prefix: null, args: [] }
				for (const log of __logs) {
					if (log.prefix === last.prefix) {
						last.args.push('\\n   ',...log.args)
					} else {
						combined.push(log)
						last = log
					}
				}
				for (const log of combined) {
					_rep_result.push('/* ' + log.prefix + '\\n')
					_rep_result.push('   ', ...log.args)
					_rep_result.push('\\n*/\\n')
				}
				__logs.splice(0)
			}
			function write(...text) {
				__flushLogs()
				_rep_result.push(...text)
			};
			function writeline(...text) {
				__flushLogs()
				write(...text)
				write('\\n')
			}
			function __comment(prefix, ...args) {
				__logs.push({ prefix, args })
			}
			const console = {
				log: (...args) => {
					__comment('log', ...args)
				},
				warn: (...args) => {
					__comment('warn', ...args)
				},
				error: (...args) => {
					__comment('error', ...args)
				}
			}
			;${selectionText};
			__flushLogs();
			return _rep_result.join('')
		})(null, null)
	`.trim();

    try {
      const result = globalThis.eval(code);
      editor.edit((editBuilder) => {
        editBuilder.insert(endLineEnd, `\n${result}`);
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      vscode.window.showErrorMessage(
        `Error occurred: ${(error as any)?.message || error}`
      );
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
