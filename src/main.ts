import {Editor, MarkdownView, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, HighlightBoxSettings, HighlightBoxSettingTab} from "./settings";
import {ColorPickerModal, TextInputModal, ColorPickerResult, TextInputResult} from "./ui/modals";
import {applyHighlight, hasSelection, removeHighlight} from "./highlight-engine";

export default class HighlightBoxPlugin extends Plugin {
	settings: HighlightBoxSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'highlight-text',
			name: 'Highlight selected text',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (!hasSelection(editor)) {
					new Notice('Please select text first');
					return;
				}
				await this.highlightTextFlow(editor, view);
			}
		});

		this.addCommand({
			id: 'remove-highlight',
			name: 'Remove highlight',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				if (!hasSelection(editor)) {
					new Notice('Please select text first');
					return;
				}
				const success = removeHighlight(editor);
				if (success) {
					new Notice('Highlight removed');
				} else {
					new Notice('Selected text is not a highlightbox highlight');
				}
			}
		});

		this.addRibbonIcon('highlighter', 'Highlight text', async (evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice('No active editor found');
				return;
			}
			const editor = view.editor;
			if (!hasSelection(editor)) {
				new Notice('Please select text first');
				return;
			}
			await this.highlightTextFlow(editor, view);
		});

		this.addRibbonIcon('eraser', 'Remove highlight', (evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice('No active editor found');
				return;
			}
			const editor = view.editor;
			if (!hasSelection(editor)) {
				new Notice('Please select text first');
				return;
			}
			const success = removeHighlight(editor);
			if (success) {
				new Notice('Highlight removed');
			} else {
				new Notice('Selected text is not a highlightbox highlight');
			}
		});

		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu, editor, view) => {
				if (!hasSelection(editor)) {
					return;
				}

				menu.addItem(item => {
					item.setTitle('Highlight with highlightbox')
						.setIcon('highlighter')
						.onClick(async () => {
							await this.highlightTextFlow(editor, view as MarkdownView);
						});
				});

				menu.addItem(item => {
					item.setTitle('Remove highlightbox highlight')
						.setIcon('eraser')
						.onClick(() => {
							const success = removeHighlight(editor);
							if (success) {
								new Notice('Highlight removed');
							} else {
								new Notice('Selected text is not a highlightbox highlight');
							}
						});
				});
			})
		);

		this.addSettingTab(new HighlightBoxSettingTab(this.app, this));
	}

	async highlightTextFlow(editor: Editor, view: MarkdownView): Promise<void> {
		const colorPickerModal = new ColorPickerModal(
			this.app,
			this.settings.colorPresets
		);
		const result: ColorPickerResult | null = await colorPickerModal.getResult();

		if (!result) {
			return;
		}

		const { preset, mode } = result;

		if (mode === 'annotation') {
			const textInputModal = new TextInputModal(this.app);
			const textResult: TextInputResult | null = await textInputModal.getResult();

			if (!textResult) {
				return;
			}

			applyHighlight(
				editor,
				view,
				preset.highlightColor,
				preset.rectTextColor,
				preset.textColor,
				textResult.text,
				textResult.position
			);

			new Notice('Annotation applied');
		} else {
			applyHighlight(
				editor,
				view,
				preset.highlightColor,
				preset.textColor,
				preset.textColor,
				'',
				'before'
			);

			new Notice('Highlight applied');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<HighlightBoxSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
