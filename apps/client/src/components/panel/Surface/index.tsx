export function PanelSurface({
	children,
	panelId,
}: {
	panelId: string;
	children: React.ReactNode;
}) {
	return (
		<div
			data-dropzone="PANEL"
			data-panel-id={panelId}
			className="h-full min-w-0"
		>
			{children}
		</div>
	);
}
