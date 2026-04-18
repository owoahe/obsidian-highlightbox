import {Editor, MarkdownView} from "obsidian";

export interface HighlightData {
	highlightColor: string;
	textColor: string;
	rectangleText: string;
	originalText: string;
}

export function applyHighlight(
	editor: Editor,
	view: MarkdownView,
	highlightColor: string,
	rectTextColor: string,
	textColor: string,
	rectangleText: string,
	position: 'before' | 'after' = 'before'
): void {
	const selection = editor.getSelection();
	if (!selection) {
		return;
	}

	const selectedText = selection.trim();
	if (!selectedText) {
		return;
	}

	let highlightHtml: string;

	if (rectangleText === '') {
		highlightHtml = `<span class="highlightpop-wrapper">
<span class="highlightpop-text" style="background-color: ${highlightColor}; color: ${textColor};">${escapeHtml(selectedText)}</span>
</span>`;
	} else {
		if (position === 'before') {
			highlightHtml = `<span class="highlightpop-wrapper" data-rect-text="${encodeURIComponent(rectangleText)}">
<span class="highlightpop-rect" style="background-color: ${highlightColor}; color: ${rectTextColor};">${escapeHtml(rectangleText)}</span>
<span class="highlightpop-text" style="background-color: ${highlightColor}; color: ${textColor};">${escapeHtml(selectedText)}</span>
</span>`;
		} else {
			highlightHtml = `<span class="highlightpop-wrapper" data-rect-text="${encodeURIComponent(rectangleText)}">
<span class="highlightpop-text" style="background-color: ${highlightColor}; color: ${textColor};">${escapeHtml(selectedText)}</span>
<span class="highlightpop-rect" style="background-color: ${highlightColor}; color: ${rectTextColor};">${escapeHtml(rectangleText)}</span>
</span>`;
		}
	}

	editor.replaceSelection(highlightHtml);
}

function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

export function getSelectedText(editor: Editor): string {
	return editor.getSelection();
}

export function hasSelection(editor: Editor): boolean {
	const selection = editor.getSelection();
	return selection !== null && selection.length > 0;
}

export function removeHighlight(editor: Editor): boolean {
	const selection = editor.getSelection();
	if (!selection) {
		return false;
	}

	const wrapper = document.createElement('div');
	wrapper.innerHTML = selection;

	const highlightWrapper = wrapper.querySelector('.highlightpop-wrapper');
	if (!highlightWrapper) {
		return false;
	}

	const highlightText = wrapper.querySelector('.highlightpop-text');
	if (!highlightText) {
		return false;
	}

	const plainText = highlightText.textContent || '';
	editor.replaceSelection(plainText);
	return true;
}

export function createContextMenuHandler(
	editor: Editor,
	view: MarkdownView,
	highlightColor: string,
	rectTextColor: string,
	textColor: string,
	rectangleText: string,
	position: 'before' | 'after' = 'before'
): () => void {
	return () => {
		applyHighlight(editor, view, highlightColor, rectTextColor, textColor, rectangleText, position);
	};
}
