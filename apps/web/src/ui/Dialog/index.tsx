import * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";
import { cn } from "@/sdk/utils/cn";

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	title,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
	title?: string;
}) {
	const corner = cn(
		"absolute h-[5px] w-[5px] bg-[url('/assets/borders/box-frame-edge.gif')] bg-no-repeat",
	);

	const borderAboves = cn(
		"block h-1 w-full bg-[url('/assets/borders/table-headline-border.gif')] bg-repeat-x",
	);

	const borderSides = cn(
		"absolute top-0 top-0 block h-full w-1 bg-[url('/assets/borders/box-frame-vertical.gif')] bg-repeat-y",
	);
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />

			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",

					className,
				)}
				{...props}
			>
				{title && (
					<div className="relative">
						<span className={`${borderAboves}`} />
						<span className={`${borderSides} -right-px`} />
						<span className={`${corner} -top-px -right-px`} />
						<span className={`${corner} -right-px -bottom-px`} />
						<div className="flex items-center justify-between gap-3 bg-tibia-700 px-3 py-1">
							<h1 className="font-bold font-poppins text-sm text-white">
								{title}
							</h1>
						</div>
						<span className={`${borderAboves} -left-px`} />
						<span className={`${borderSides}`} />
						<span className={`${corner} -top-px -left-px`} />
						<span className={`${corner} -bottom-px -left-px`} />
					</div>
				)}

				<div
					className={cn(
						"border p-1 shadow-lg",
						"mx-0.5 border-septenary bg-tibia-800 outline-1 outline-quaternary",
					)}
				>
					{children}
					{showCloseButton && (
						<DialogPrimitive.Close
							data-slot="dialog-close"
							className="absolute top-3 right-3 rounded-xs opacity-70 ring-offset-background transition-opacity hover:cursor-pointer hover:opacity-100 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
						>
							<img
								alt="x-icon"
								src="/assets/icons/global/false.png"
								width={12}
								height={12}
								className="h-3 w-3 object-contain"
							/>
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					)}
				</div>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("font-semibold text-lg leading-none", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
