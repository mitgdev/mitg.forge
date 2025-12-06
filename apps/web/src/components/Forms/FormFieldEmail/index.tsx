import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/Form";
import { Input } from "@/ui/Input";

type Props<TFormValues extends FieldValues> = {
	disabled?: boolean;
	label?: string;
	form: UseFormReturn<TFormValues>;
};

export function FormFieldEmail<
	TFormValues extends { email: string } & FieldValues,
>({ disabled, label = "Email:", form }: Props<TFormValues>) {
	return (
		<FormField
			control={form.control}
			name={"email" as Path<TFormValues>}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
						<FormLabel className="min-w-35">{label}</FormLabel>
						<div className="flex w-full flex-col">
							<FormControl>
								<Input
									{...field}
									placeholder="Email..."
									value={value}
									disabled={disabled}
									onChange={(event) => {
										onChange(event.target.value);
									}}
									type="email"
									className="max-w-sm"
								/>
							</FormControl>
							<FormMessage className="text-red-500" />
						</div>
					</FormItem>
				);
			}}
		/>
	);
}
