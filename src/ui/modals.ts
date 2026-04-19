import {Modal} from "obsidian";

export interface ColorPreset {
	highlightColor: string;
	rectTextColor: string;
	textColor: string;
	label: string;
}

export interface ColorPickerResult {
	preset: ColorPreset;
	mode: 'annotation' | 'highlight';
}

export interface TextInputResult {
	text: string;
	position: 'before' | 'after';
}

export class ColorPickerModal extends Modal {
	private resolve: (result: ColorPickerResult | null) => void;
	private selectedPreset: ColorPreset | null;
	private customPresets: ColorPreset[];
	private defaultPresets: ColorPreset[];

	constructor(app: import('obsidian').App, customPresets: ColorPreset[] = []) {
		super(app);
		this.customPresets = customPresets;
		this.selectedPreset = customPresets.length > 0 ? customPresets[0]! : null;

		this.defaultPresets = [
			{highlightColor: '#ffd700', rectTextColor: '#000000', textColor: '#000000', label: 'Yellow'},
			{highlightColor: '#ff6b6b', rectTextColor: '#ffffff', textColor: '#ffffff', label: 'Red'},
			{highlightColor: '#4ecdc4', rectTextColor: '#000000', textColor: '#000000', label: 'Cyan'},
			{highlightColor: '#45b7d1', rectTextColor: '#ffffff', textColor: '#ffffff', label: 'Blue'},
			{highlightColor: '#96ceb4', rectTextColor: '#000000', textColor: '#000000', label: 'Green'},
			{highlightColor: '#ff9ff3', rectTextColor: '#000000', textColor: '#000000', label: 'Pink'},
			{highlightColor: '#feca57', rectTextColor: '#000000', textColor: '#000000', label: 'Orange'},
			{highlightColor: '#a29bfe', rectTextColor: '#ffffff', textColor: '#ffffff', label: 'Purple'}
		];
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.addClass('highlightbox-modal');
		contentEl.addClass('highlightbox-color-picker');

		contentEl.createEl('h3', {text: 'Select highlight color', cls: 'highlightbox-modal-title'});

		if (this.customPresets.length > 0) {
			contentEl.createEl('h4', {text: 'My presets', cls: 'highlightbox-section-label'});
			const customPresetContainer = contentEl.createDiv('highlightbox-preset-grid');

			this.customPresets.forEach(preset => {
				this.createPresetButton(customPresetContainer, preset);
			});
		}

		contentEl.createEl('h4', {text: 'Default presets', cls: 'highlightbox-section-label'});
		const presetContainer = contentEl.createDiv('highlightbox-preset-grid');

		this.defaultPresets.forEach(preset => {
			this.createPresetButton(presetContainer, preset);
		});

		const buttonContainer = contentEl.createDiv('highlightbox-modal-buttons');

		const annotationBtn = buttonContainer.createEl('button', {
			text: 'Annotate',
			cls: 'highlightbox-btn highlightbox-btn-annotate'
		});
		annotationBtn.addEventListener('click', () => {
			this.close();
			if (this.selectedPreset) {
				this.resolve({
					preset: this.selectedPreset,
					mode: 'annotation'
				});
			}
		});

		const highlightBtn = buttonContainer.createEl('button', {
			text: 'Highlight',
			cls: 'highlightbox-btn highlightbox-btn-highlight'
		});
		highlightBtn.addEventListener('click', () => {
			this.close();
			if (this.selectedPreset) {
				this.resolve({
					preset: this.selectedPreset,
					mode: 'highlight'
				});
			}
		});
	}

	private createPresetButton(container: HTMLElement, preset: ColorPreset) {
		const presetBtn = container.createEl('button', {
			cls: 'highlightbox-preset-button'
		});

		const colorBlock = presetBtn.createDiv('highlightbox-color-block');
		colorBlock.setCssProps({'--highlight-color': preset.highlightColor});

		const rectText = colorBlock.createDiv('highlightbox-block-rect');
		rectText.setCssProps({'--rect-text-color': preset.rectTextColor});
		rectText.textContent = '■';

		const mainText = colorBlock.createDiv('highlightbox-block-text');
		mainText.setCssProps({'--text-color': preset.textColor});
		mainText.textContent = '■';

		const isSelected = this.selectedPreset &&
			this.selectedPreset.highlightColor === preset.highlightColor &&
			this.selectedPreset.textColor === preset.textColor;

		if (isSelected) {
			colorBlock.addClass('highlightbox-color-block-selected');
		}

		presetBtn.addEventListener('click', () => {
			this.selectedPreset = preset;
			this.updateSelection();
		});
	}

	private updateSelection() {
		this.contentEl.querySelectorAll('.highlightbox-color-block').forEach(block => {
			block.removeClass('highlightbox-color-block-selected');
		});

		this.contentEl.querySelectorAll('.highlightbox-preset-button').forEach((btn, index) => {
			const allPresets = [...this.customPresets, ...this.defaultPresets];
			const preset = allPresets[index];
			if (preset &&
				this.selectedPreset &&
				preset.highlightColor === this.selectedPreset.highlightColor &&
				preset.textColor === this.selectedPreset.textColor) {
				const colorBlock = btn.querySelector('.highlightbox-color-block');
				if (colorBlock) {
					colorBlock.addClass('highlightbox-color-block-selected');
				}
			}
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	getResult(): Promise<ColorPickerResult | null> {
		return new Promise(resolve => {
			this.resolve = resolve;
			this.open();
		});
	}
}

export class TextInputModal extends Modal {
	private resolve: (result: TextInputResult | null) => void;
	private inputText: string = '';

	constructor(app: import('obsidian').App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		contentEl.addClass('highlightbox-modal');
		contentEl.addClass('highlightbox-text-input');

		contentEl.createEl('h3', {text: 'Enter rectangle text', cls: 'highlightbox-modal-title'});

		contentEl.createEl('p', {
			text: 'Enter text to display in the rounded rectangle:',
			cls: 'highlightbox-modal-description'
		});

		const inputContainer = contentEl.createDiv('highlightbox-input-container');
		const textInput = inputContainer.createEl('input', {
			type: 'text',
			placeholder: 'Enter text...',
			cls: 'highlightbox-text-input-field'
		});

		textInput.addEventListener('input', () => {
			this.inputText = textInput.value;
		});

		textInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				this.close();
				if (this.inputText.trim()) {
					this.resolve({ text: this.inputText, position: 'before' });
				}
			}
		});

		const buttonContainer = contentEl.createDiv('highlightbox-modal-buttons');

		const beforeBtn = buttonContainer.createEl('button', {
			text: 'Annotate before',
			cls: 'highlightbox-btn highlightbox-btn-annotate'
		});
		beforeBtn.addEventListener('click', () => {
			this.close();
			if (this.inputText.trim()) {
				this.resolve({ text: this.inputText, position: 'before' });
			}
		});

		const afterBtn = buttonContainer.createEl('button', {
			text: 'Annotate after',
			cls: 'highlightbox-btn highlightbox-btn-highlight'
		});
		afterBtn.addEventListener('click', () => {
			this.close();
			if (this.inputText.trim()) {
				this.resolve({ text: this.inputText, position: 'after' });
			}
		});

		activeWindow.setTimeout(() => textInput.focus(), 100);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	getResult(): Promise<TextInputResult | null> {
		return new Promise(resolve => {
			this.resolve = resolve;
			this.open();
		});
	}
}
