import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "./main";

export interface ColorPreset {
	highlightColor: string;
	rectTextColor: string;
	textColor: string;
	label: string;
}

export interface MyPluginSettings {
	colorPresets: ColorPreset[];
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	colorPresets: []
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'HighlightBox 设置'});

		containerEl.createEl('h3', {text: '颜色预设'});
		containerEl.createEl('p', {
			text: '添加你喜欢的颜色组合以便快速使用。最多可添加8个预设。',
			cls: 'settings-description'
		});

		if (this.plugin.settings.colorPresets.length > 0) {
			const presetsContainer = containerEl.createDiv('presets-list');
			presetsContainer.style.marginBottom = '20px';

			this.plugin.settings.colorPresets.forEach((preset, index) => {
				const presetItem = presetsContainer.createDiv('preset-item');
				presetItem.style.display = 'flex';
				presetItem.style.alignItems = 'center';
				presetItem.style.gap = '10px';
				presetItem.style.marginBottom = '10px';
				presetItem.style.padding = '10px';
				presetItem.style.border = '1px solid var(--background-modifier-border)';
				presetItem.style.borderRadius = '4px';

				const previewBox = presetItem.createDiv('color-preview');
				previewBox.style.display = 'flex';
				previewBox.style.gap = '2px';
				previewBox.style.padding = '4px';
				previewBox.style.backgroundColor = preset.highlightColor;
				previewBox.style.borderRadius = '4px';
				previewBox.style.border = '2px solid var(--background-modifier-border)';

				const rectPreview = previewBox.createDiv('rect-preview');
				rectPreview.style.backgroundColor = preset.highlightColor;
				rectPreview.style.color = preset.rectTextColor;
				rectPreview.style.padding = '2px 6px';
				rectPreview.style.borderRadius = '4px';
				rectPreview.style.fontSize = '10px';
				rectPreview.style.fontWeight = 'bold';
				rectPreview.textContent = '标';

				const textPreview = previewBox.createDiv('text-preview');
				textPreview.style.backgroundColor = preset.highlightColor;
				textPreview.style.color = preset.textColor;
				textPreview.style.padding = '2px 4px';
				textPreview.style.borderRadius = '3px';
				textPreview.style.fontSize = '10px';
				textPreview.textContent = '文';

				const labelSpan = presetItem.createEl('span', {text: preset.label});
				labelSpan.style.flex = '1';
				labelSpan.style.fontWeight = 'bold';

				const deleteBtn = presetItem.createEl('button', {text: '×'});
				deleteBtn.style.background = 'var(--background-modifier-border)';
				deleteBtn.style.border = 'none';
				deleteBtn.style.borderRadius = '50%';
				deleteBtn.style.width = '24px';
				deleteBtn.style.height = '24px';
				deleteBtn.style.cursor = 'pointer';
				deleteBtn.style.fontSize = '18px';
				deleteBtn.style.lineHeight = '1';
				deleteBtn.addEventListener('click', async () => {
					this.plugin.settings.colorPresets.splice(index, 1);
					await this.plugin.saveSettings();
					this.display();
				});
			});
		}

		if (this.plugin.settings.colorPresets.length < 8) {
			const addPresetSection = containerEl.createDiv('add-preset-section');
			addPresetSection.style.marginTop = '10px';
			addPresetSection.style.padding = '15px';
			addPresetSection.style.border = '1px dashed var(--background-modifier-border)';
			addPresetSection.style.borderRadius = '4px';

			const addTitle = addPresetSection.createEl('p', {text: '添加新预设'});
			addTitle.style.marginTop = '0';
			addTitle.style.fontWeight = 'bold';

			const colorRow = addPresetSection.createDiv();
			colorRow.style.display = 'flex';
			colorRow.style.gap = '10px';
			colorRow.style.marginBottom = '10px';

			const highlightColorInput = colorRow.createEl('input', {
				type: 'color'
			}) as HTMLInputElement;
			(highlightColorInput as HTMLElement).style.width = '50px';
			(highlightColorInput as HTMLElement).style.height = '40px';
			(highlightColorInput as HTMLElement).style.cursor = 'pointer';
			highlightColorInput.value = '#ffd700';

			const rectTextColorInput = colorRow.createEl('input', {
				type: 'color'
			}) as HTMLInputElement;
			(rectTextColorInput as HTMLElement).style.width = '50px';
			(rectTextColorInput as HTMLElement).style.height = '40px';
			(rectTextColorInput as HTMLElement).style.cursor = 'pointer';
			rectTextColorInput.value = '#ffffff';

			const textColorInput = colorRow.createEl('input', {
				type: 'color'
			}) as HTMLInputElement;
			(textColorInput as HTMLElement).style.width = '50px';
			(textColorInput as HTMLElement).style.height = '40px';
			(textColorInput as HTMLElement).style.cursor = 'pointer';
			textColorInput.value = '#000000';

			const labelInput = colorRow.createEl('input', {
				type: 'text',
				placeholder: '预设名称'
			}) as HTMLInputElement;
			labelInput.style.flex = '1';
			labelInput.style.padding = '8px';
			labelInput.style.border = '1px solid var(--background-modifier-border)';
			labelInput.style.borderRadius = '4px';

			const colorLabels = addPresetSection.createDiv('color-labels');
			colorLabels.style.display = 'flex';
			colorLabels.style.gap = '10px';
			colorLabels.style.marginBottom = '15px';
			colorLabels.style.fontSize = '11px';
			colorLabels.style.color = 'var(--text-muted)';
			colorLabels.innerHTML = '<span style="width: 50px;">高亮</span><span style="width: 50px;">矩形</span><span style="width: 50px;">文本</span><span style="flex: 1;"></span>';

			const previewRow = addPresetSection.createDiv('preview-row');
			previewRow.style.marginBottom = '10px';
			previewRow.style.display = 'flex';
			previewRow.style.gap = '4px';
			previewRow.style.alignItems = 'center';

			const previewRect = previewRow.createDiv('preview-rect');
			previewRect.style.backgroundColor = highlightColorInput.value;
			previewRect.style.color = rectTextColorInput.value;
			previewRect.style.padding = '4px 8px';
			previewRect.style.borderRadius = '4px';
			previewRect.style.fontSize = '12px';
			previewRect.style.fontWeight = 'bold';
			previewRect.textContent = '矩形';

			const previewText = previewRow.createDiv('preview-text');
			previewText.style.backgroundColor = highlightColorInput.value;
			previewText.style.color = textColorInput.value;
			previewText.style.padding = '4px 8px';
			previewText.style.borderRadius = '3px';
			previewText.style.fontSize = '12px';
			previewText.textContent = '选中文本';

			const updatePreview = () => {
				previewRect.style.backgroundColor = highlightColorInput.value;
				previewRect.style.color = rectTextColorInput.value;
				previewText.style.backgroundColor = highlightColorInput.value;
				previewText.style.color = textColorInput.value;
			};

			highlightColorInput.addEventListener('input', updatePreview);
			rectTextColorInput.addEventListener('input', updatePreview);
			textColorInput.addEventListener('input', updatePreview);

			const addBtn = addPresetSection.createEl('button', {text: '添加预设'});
			addBtn.style.padding = '8px 16px';
			addBtn.style.background = 'var(--interactive-accent)';
			addBtn.style.color = 'var(--text-on-accent)';
			addBtn.style.border = 'none';
			addBtn.style.borderRadius = '4px';
			addBtn.style.cursor = 'pointer';
			addBtn.style.fontWeight = 'bold';

			addBtn.addEventListener('click', async () => {
				if (labelInput.value.trim()) {
					this.plugin.settings.colorPresets.push({
						highlightColor: highlightColorInput.value,
						rectTextColor: rectTextColorInput.value,
						textColor: textColorInput.value,
						label: labelInput.value.trim()
					});
					await this.plugin.saveSettings();
					this.display();
				}
			});
		}
	}
}
