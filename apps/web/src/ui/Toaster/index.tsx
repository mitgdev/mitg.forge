import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="system"
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--color-tibia-500)",
					"--normal-text": "var(--color-tibia-100",
					"--normal-border": "var(--color-quaternary)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
