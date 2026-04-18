import {App, Modal, Setting} from "obsidian";

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

	constructor(app: App, customPresets: ColorPreset[] = []) {
		super(app);
		this.customPresets = customPresets;
		this.selectedPreset = customPresets.length > 0 ? customPresets[0]! : null;
		
		this.defaultPresets = [
			{highlightColor: '#ffd700', rectTextColor: '#000000', textColor: '#000000', label: '黄色'},
			{highlightColor: '#ff6b6b', rectTextColor: '#ffffff', textColor: '#ffffff', label: '红色'},
			{highlightColor: '#4ecdc4', rectTextColor: '#000000', textColor: '#000000', label: '青色'},
			{highlightColor: '#45b7d1', rectTextColor: '#ffffff', textColor: '#ffffff', label: '蓝色'},
			{highlightColor: '#96ceb4', rectTextColor: '#000000', textColor: '#000000', label: '绿色'},
			{highlightColor: '#ff9ff3', rectTextColor: '#000000', textColor: '#000000', label: '粉色'},
			{highlightColor: '#feca57', rectTextColor: '#000000', textColor: '#000000', label: '橙色'},
			{highlightColor: '#a29bfe', rectTextColor: '#ffffff', textColor: '#ffffff', label: '紫色'}
		];
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		(this.containerEl as HTMLElement).style.setProperty('--modal-width', '360px');
		contentEl.style.padding = '16px';

		contentEl.createEl('h3', {text: '选择高亮颜色'});
		(contentEl.querySelector('h3') as HTMLElement).style.marginBottom = '12px';
		(contentEl.querySelector('h3') as HTMLElement).style.marginTop = '0';

		if (this.customPresets.length > 0) {
			const customLabel = contentEl.createEl('h4', {text: '我的预设'});
			customLabel.style.marginBottom = '8px';
			customLabel.style.marginTop = '0';
			customLabel.style.fontSize = '13px';
			customLabel.style.color = 'var(--text-muted)';
			const customPresetContainer = contentEl.createDiv('preset-container');
			customPresetContainer.style.display = 'grid';
			customPresetContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
			customPresetContainer.style.gap = '6px';
			customPresetContainer.style.marginBottom = '12px';

			this.customPresets.forEach(preset => {
				this.createPresetButton(customPresetContainer, preset);
			});
		}

		const defaultLabel = contentEl.createEl('h4', {text: '默认预设'});
		defaultLabel.style.marginBottom = '8px';
		defaultLabel.style.marginTop = '0';
		defaultLabel.style.fontSize = '13px';
		defaultLabel.style.color = 'var(--text-muted)';
		const presetContainer = contentEl.createDiv('preset-container');
		presetContainer.style.display = 'grid';
		presetContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
		presetContainer.style.gap = '6px';
		presetContainer.style.marginBottom = '12px';

		this.defaultPresets.forEach(preset => {
			this.createPresetButton(presetContainer, preset);
		});

		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = 'grid';
		buttonContainer.style.gridTemplateColumns = '1fr 1fr';
		buttonContainer.style.gap = '8px';
		buttonContainer.style.marginTop = '12px';

		const annotationBtn = buttonContainer.createEl('button');
		annotationBtn.textContent = '注释';
		(annotationBtn as HTMLElement).style.padding = '8px 12px';
		(annotationBtn as HTMLElement).style.fontSize = '13px';
		(annotationBtn as HTMLElement).style.fontWeight = 'bold';
		(annotationBtn as HTMLElement).style.backgroundColor = 'var(--interactive-normal)';
		(annotationBtn as HTMLElement).style.color = 'var(--text-on-interactive)';
		(annotationBtn as HTMLElement).style.border = 'none';
		(annotationBtn as HTMLElement).style.borderRadius = '6px';
		(annotationBtn as HTMLElement).style.cursor = 'pointer';
		annotationBtn.addEventListener('click', () => {
			this.close();
			if (this.selectedPreset) {
				this.resolve({
					preset: this.selectedPreset,
					mode: 'annotation'
				});
			}
		});

		const highlightBtn = buttonContainer.createEl('button');
		highlightBtn.textContent = '高亮';
		(highlightBtn as HTMLElement).style.padding = '8px 12px';
		(highlightBtn as HTMLElement).style.fontSize = '13px';
		(highlightBtn as HTMLElement).style.fontWeight = 'bold';
		(highlightBtn as HTMLElement).style.backgroundColor = 'var(--interactive-accent)';
		(highlightBtn as HTMLElement).style.color = 'var(--text-on-accent)';
		(highlightBtn as HTMLElement).style.border = 'none';
		(highlightBtn as HTMLElement).style.borderRadius = '6px';
		(highlightBtn as HTMLElement).style.cursor = 'pointer';
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
			cls: 'preset-button'
		}) as HTMLButtonElement;

		const colorBlock = presetBtn.createDiv('color-block');
		colorBlock.style.width = '100%';
		colorBlock.style.height = '100%';
		colorBlock.style.backgroundColor = preset.highlightColor;
		colorBlock.style.borderRadius = '6px';
		colorBlock.style.display = 'flex';
		colorBlock.style.alignItems = 'center';
		colorBlock.style.justifyContent = 'center';
		colorBlock.style.gap = '4px';
		colorBlock.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
		colorBlock.style.transition = 'all 0.2s ease';

		const rectText = colorBlock.createDiv();
		rectText.textContent = '■';
		rectText.style.color = preset.rectTextColor;
		rectText.style.fontSize = '16px';
		rectText.style.fontWeight = 'bold';
		rectText.style.lineHeight = '1';

		const mainText = colorBlock.createDiv();
		mainText.textContent = '■';
		mainText.style.color = preset.textColor;
		mainText.style.fontSize = '16px';
		mainText.style.lineHeight = '1';

		(presetBtn as HTMLElement).style.backgroundColor = 'transparent';
		(presetBtn as HTMLElement).style.border = 'none';
		(presetBtn as HTMLElement).style.cursor = 'pointer';
		(presetBtn as HTMLElement).style.padding = '0';
		(presetBtn as HTMLElement).style.display = 'block';
		(presetBtn as HTMLElement).style.transition = 'transform 0.2s ease';

		const isSelected = this.selectedPreset && 
			this.selectedPreset.highlightColor === preset.highlightColor && 
			this.selectedPreset.textColor === preset.textColor;

		if (isSelected) {
			colorBlock.style.outline = '2px solid var(--interactive-accent)';
			colorBlock.style.outlineOffset = '2px';
		}

		presetBtn.addEventListener('mouseenter', () => {
			(presetBtn as HTMLElement).style.transform = 'scale(1.05)';
			colorBlock.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
		});

		presetBtn.addEventListener('mouseleave', () => {
			(presetBtn as HTMLElement).style.transform = 'scale(1)';
			colorBlock.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
		});

		presetBtn.addEventListener('click', () => {
			this.selectedPreset = preset;
			this.updateSelection();
		});
	}

	private updateSelection() {
		document.querySelectorAll('.color-block').forEach(block => {
			(block as HTMLElement).style.outline = 'none';
			(block as HTMLElement).style.outlineOffset = '0';
		});
		
		document.querySelectorAll('.preset-button').forEach((btn, index) => {
			const allPresets = [...this.customPresets, ...this.defaultPresets];
			const preset = allPresets[index];
			if (preset && 
				this.selectedPreset && 
				preset.highlightColor === this.selectedPreset.highlightColor && 
				preset.textColor === this.selectedPreset.textColor) {
				const colorBlock = btn.querySelector('.color-block') as HTMLElement;
				if (colorBlock) {
					colorBlock.style.outline = '2px solid var(--interactive-accent)';
					colorBlock.style.outlineOffset = '2px';
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

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();

		(this.containerEl as HTMLElement).style.setProperty('--modal-width', '320px');
		contentEl.style.padding = '16px';

		contentEl.createEl('h3', {text: '输入矩形文字'});
		(contentEl.querySelector('h3') as HTMLElement).style.marginBottom = '8px';
		(contentEl.querySelector('h3') as HTMLElement).style.marginTop = '0';

		contentEl.createEl('p', {
			text: '输入要显示在圆角矩形内的文字：',
			cls: 'modal-description'
		});
		const desc = contentEl.querySelector('.modal-description') as HTMLElement;
		if (desc) {
			desc.style.fontSize = '12px';
			desc.style.marginBottom = '8px';
		}

		const inputContainer = contentEl.createDiv('input-container');
		const textInput = inputContainer.createEl('input', {
			type: 'text',
			placeholder: '请输入文字...',
			cls: 'rectangle-text-input'
		}) as HTMLInputElement;
		textInput.style.width = '100%';
		textInput.style.padding = '8px';
		textInput.style.marginTop = '8px';
		textInput.style.fontSize = '14px';

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

		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = 'grid';
		buttonContainer.style.gridTemplateColumns = '1fr 1fr';
		buttonContainer.style.gap = '8px';
		buttonContainer.style.marginTop = '12px';

		const beforeBtn = buttonContainer.createEl('button');
		beforeBtn.textContent = '注释在前';
		(beforeBtn as HTMLElement).style.padding = '8px 12px';
		(beforeBtn as HTMLElement).style.fontSize = '13px';
		(beforeBtn as HTMLElement).style.fontWeight = 'bold';
		(beforeBtn as HTMLElement).style.backgroundColor = 'var(--interactive-normal)';
		(beforeBtn as HTMLElement).style.color = 'var(--text-on-interactive)';
		(beforeBtn as HTMLElement).style.border = 'none';
		(beforeBtn as HTMLElement).style.borderRadius = '6px';
		(beforeBtn as HTMLElement).style.cursor = 'pointer';
		beforeBtn.addEventListener('click', () => {
			this.close();
			if (this.inputText.trim()) {
				this.resolve({ text: this.inputText, position: 'before' });
			}
		});

		const afterBtn = buttonContainer.createEl('button');
		afterBtn.textContent = '注释在后';
		(afterBtn as HTMLElement).style.padding = '8px 12px';
		(afterBtn as HTMLElement).style.fontSize = '13px';
		(afterBtn as HTMLElement).style.fontWeight = 'bold';
		(afterBtn as HTMLElement).style.backgroundColor = 'var(--interactive-accent)';
		(afterBtn as HTMLElement).style.color = 'var(--text-on-accent)';
		(afterBtn as HTMLElement).style.border = 'none';
		(afterBtn as HTMLElement).style.borderRadius = '6px';
		(afterBtn as HTMLElement).style.cursor = 'pointer';
		afterBtn.addEventListener('click', () => {
			this.close();
			if (this.inputText.trim()) {
				this.resolve({ text: this.inputText, position: 'after' });
			}
		});

		setTimeout(() => textInput.focus(), 100);
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
