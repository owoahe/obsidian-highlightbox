import {PluginSettingTab, Setting} from "obsidian";
import HighlightBoxPlugin from "./main";

export interface ColorPreset {
	highlightColor: string;
	rectTextColor: string;
	textColor: string;
	label: string;
}

export interface HighlightBoxSettings {
	colorPresets: ColorPreset[];
}

export const DEFAULT_SETTINGS: HighlightBoxSettings = {
	colorPresets: []
}

export class HighlightBoxSettingTab extends PluginSettingTab {
	plugin: HighlightBoxPlugin;

	constructor(app: import('obsidian').App, plugin: HighlightBoxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setHeading()
			.setName('Highlightbox');

		new Setting(containerEl)
			.setHeading()
			.setName('Color presets');

		new Setting(containerEl)
			.setDesc('Add your favorite color combinations for quick use. Up to 8 presets.');

		if (this.plugin.settings.colorPresets.length > 0) {
			const presetsContainer = containerEl.createDiv('highlightbox-presets-list');

			this.plugin.settings.colorPresets.forEach((preset, index) => {
				const presetItem = presetsContainer.createDiv('highlightbox-preset-item');

				const previewBox = presetItem.createDiv('highlightbox-color-preview');
				previewBox.setCssProps({'--highlight-color': preset.highlightColor});

				const rectPreview = previewBox.createDiv('highlightbox-rect-preview');
				rectPreview.setCssProps({
					'--highlight-color': preset.highlightColor,
					'--rect-text-color': preset.rectTextColor
				});
				rectPreview.textContent = '标';

				const textPreview = previewBox.createDiv('highlightbox-text-preview');
				textPreview.setCssProps({
					'--highlight-color': preset.highlightColor,
					'--text-color': preset.textColor
				});
				textPreview.textContent = '文';

				presetItem.createEl('span', {text: preset.label, cls: 'highlightbox-preset-label'});

				const deleteBtn = presetItem.createEl('button', {text: '×', cls: 'highlightbox-delete-btn'});
				deleteBtn.addEventListener('click', () => {
					this.plugin.settings.colorPresets.splice(index, 1);
					void this.plugin.saveSettings().then(() => this.display());
				});
			});
		}

		if (this.plugin.settings.colorPresets.length < 8) {
			const addPresetSection = containerEl.createDiv('highlightbox-add-preset-section');

			addPresetSection.createEl('p', {text: 'Add new preset', cls: 'highlightbox-add-title'});

			const colorRow = addPresetSection.createDiv('highlightbox-color-row');

			const highlightColorInput = colorRow.createEl('input', {
				type: 'color',
				cls: 'highlightbox-color-input'
			});
			highlightColorInput.value = '#ffd700';

			const rectTextColorInput = colorRow.createEl('input', {
				type: 'color',
				cls: 'highlightbox-color-input'
			});
			rectTextColorInput.value = '#ffffff';

			const textColorInput = colorRow.createEl('input', {
				type: 'color',
				cls: 'highlightbox-color-input'
			});
			textColorInput.value = '#000000';

			const labelInput = colorRow.createEl('input', {
				type: 'text',
				placeholder: 'Preset name',
				cls: 'highlightbox-label-input'
			});

			const colorLabels = addPresetSection.createDiv('highlightbox-color-labels');
			colorLabels.createEl('span', {text: 'Highlight', cls: 'highlightbox-color-label-item'});
			colorLabels.createEl('span', {text: 'Rect', cls: 'highlightbox-color-label-item'});
			colorLabels.createEl('span', {text: 'Text', cls: 'highlightbox-color-label-item'});
			colorLabels.createEl('span', {cls: 'highlightbox-color-label-spacer'});

			const previewRow = addPresetSection.createDiv('highlightbox-preview-row');

			const previewRect = previewRow.createDiv('highlightbox-preview-rect');
			previewRect.setCssProps({
				'--highlight-color': highlightColorInput.value,
				'--rect-text-color': rectTextColorInput.value
			});
			previewRect.textContent = 'Rect';

			const previewText = previewRow.createDiv('highlightbox-preview-text');
			previewText.setCssProps({
				'--highlight-color': highlightColorInput.value,
				'--text-color': textColorInput.value
			});
			previewText.textContent = 'Selected text';

			const updatePreview = () => {
				previewRect.setCssProps({
					'--highlight-color': highlightColorInput.value,
					'--rect-text-color': rectTextColorInput.value
				});
				previewText.setCssProps({
					'--highlight-color': highlightColorInput.value,
					'--text-color': textColorInput.value
				});
			};

			highlightColorInput.addEventListener('input', updatePreview);
			rectTextColorInput.addEventListener('input', updatePreview);
			textColorInput.addEventListener('input', updatePreview);

			const addBtn = addPresetSection.createEl('button', {text: 'Add preset', cls: 'highlightbox-add-btn'});

			addBtn.addEventListener('click', () => {
				if (labelInput.value.trim()) {
					this.plugin.settings.colorPresets.push({
						highlightColor: highlightColorInput.value,
						rectTextColor: rectTextColorInput.value,
						textColor: textColorInput.value,
						label: labelInput.value.trim()
					});
					void this.plugin.saveSettings().then(() => this.display());
				}
			});
		}
	}
}
