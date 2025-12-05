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
	disabled: boolean;
	form: UseFormReturn<TFormValues>;
};

export function FormFieldRecoveryKey<
	TFormValues extends { recoveryKey: string } & FieldValues,
>({ disabled, form }: Props<TFormValues>) {
	return (
		<FormField
			control={form.control}
			name={"recoveryKey" as Path<TFormValues>}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
						<FormLabel className="min-w-35">Recovery Key:</FormLabel>
						<div className="flex w-full flex-col">
							<FormControl>
								<Input
									{...field}
									placeholder="Recovery Key..."
									value={value}
									disabled={disabled}
									onChange={(event) => {
										onChange(event.target.value);
									}}
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
