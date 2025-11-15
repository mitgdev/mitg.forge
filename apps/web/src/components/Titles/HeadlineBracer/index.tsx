export const HeadlineBracerTitle = ({ title }: { title: string }) => {
	return (
		<div className="flex flex-row items-center gap-3 self-center py-1">
			<img
				alt={`headline-bracer-left-${title}`}
				src="/assets/borders/headline-bracer.gif"
			/>
			<span className="text-center font-bold font-verdana text-lg text-secondary">
				{title}
			</span>
			<img
				alt={`headline-bracer-right-${title}`}
				src="/assets/borders/headline-bracer.gif"
				className="rotate-y-180"
			/>
		</div>
	);
};
