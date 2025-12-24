export function computePanelInsertIndex(
	panelElement: HTMLElement,
	clientY: number,
) {
	const widgets = Array.from(
		panelElement.querySelectorAll<HTMLElement>("[data-widget-root='true']"),
	);

	// painel vazio => insere no começo
	if (widgets.length === 0) return 0;

	for (let i = 0; i < widgets.length; i++) {
		const r = widgets[i].getBoundingClientRect();
		const mid = r.top + r.height / 2;
		if (clientY < mid) return i;
	}

	// abaixo de todos => insere no fim
	return widgets.length;
}
