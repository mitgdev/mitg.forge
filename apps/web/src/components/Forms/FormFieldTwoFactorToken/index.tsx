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
	form: UseFormReturn<TFormValues>;
};

export function FormFieldTwoFactorToken<
	TFormValues extends { twoFactorToken?: string } & FieldValues,
>({ disabled, form }: Props<TFormValues>) {
	return (
		<FormField
			control={form.control}
			name={"twoFactorToken" as Path<TFormValues>}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<FormItem className="flex flex-1 flex-col gap-0.5 md:flex-row md:items-center">
						<FormLabel className="min-w-35">Confirmation Code:</FormLabel>
						<div className="flex w-full flex-col">
							<FormControl>
								<Input
									{...field}
									placeholder="Confirmation Code..."
									maxLength={6}
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
