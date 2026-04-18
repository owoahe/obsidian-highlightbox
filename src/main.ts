import {App, Editor, MarkdownView, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";
import {ColorPickerModal, TextInputModal, ColorPickerResult, TextInputResult} from "./ui/modals";
import {applyHighlight, hasSelection, removeHighlight} from "./highlight-engine";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'highlight-text',
			name: '高亮选中文本',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				if (!hasSelection(editor)) {
					new Notice('请先选中文本');
					return;
				}
				await this.highlightTextFlow(editor, view);
			}
		});

		this.addCommand({
			id: 'remove-highlight',
			name: '去除高亮',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				if (!hasSelection(editor)) {
					new Notice('请先选中文本');
					return;
				}
				const success = removeHighlight(editor);
				if (success) {
					new Notice('高亮已去除！');
				} else {
					new Notice('选中文本不是HighlightBox高亮');
				}
			}
		});

		this.addRibbonIcon('highlighter', '高亮文本', async (evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice('未找到活动编辑器');
				return;
			}
			const editor = view.editor;
			if (!hasSelection(editor)) {
				new Notice('请先选中文本');
				return;
			}
			await this.highlightTextFlow(editor, view);
		});

		this.addRibbonIcon('eraser', '去除高亮', (evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice('未找到活动编辑器');
				return;
			}
			const editor = view.editor;
			if (!hasSelection(editor)) {
				new Notice('请先选中文本');
				return;
			}
			const success = removeHighlight(editor);
			if (success) {
				new Notice('高亮已去除！');
			} else {
				new Notice('选中文本不是HighlightBox高亮');
			}
		});

		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu, editor, view) => {
				if (!hasSelection(editor)) {
					return;
				}

				menu.addItem(item => {
					item.setTitle('使用 HighlightBox 高亮')
						.setIcon('highlighter')
						.onClick(async () => {
							await this.highlightTextFlow(editor, view as MarkdownView);
						});
				});

				menu.addItem(item => {
					item.setTitle('去除 HighlightBox 高亮')
						.setIcon('eraser')
						.onClick(() => {
							const success = removeHighlight(editor);
							if (success) {
								new Notice('高亮已去除！');
							} else {
								new Notice('选中文本不是HighlightBox高亮');
							}
						});
				});
			})
		);

		this.addSettingTab(new SampleSettingTab(this.app, this));
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

			new Notice('注释应用成功！');
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

			new Notice('高亮应用成功！');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

