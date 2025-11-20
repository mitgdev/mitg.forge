import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/Form";
import { Input } from "@/ui/Input";

const FormSchema = z.object({
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountPlayerDeleteForm = ({ name }: { name: string }) => {
	const { formatDate } = useTimezone();
	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			password: "",
		},
	});

	const { mutateAsync, isSuccess, data } = useMutation(
		api.query.miforge.accounts.characters.deleteByName.mutationOptions(),
	);

	const queryClient = useQueryClient();

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				await mutateAsync({
					name: name,
					password: data.password,
				});

				queryClient.invalidateQueries(
					api.query.miforge.accounts.characters.list.queryOptions({
						input: {},
					}),
				);

				toast.success("Character deletion scheduled successfully.");
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[name, mutateAsync, queryClient],
	);

	return (
		<Container title={"Delete Character"}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					{!isSuccess && (
						<InnerContainer className="p-1 md:p-2">
							<div className="mb-1 flex flex-1 flex-col gap-0.5 md:items-start">
								<FormLabel className="min-w-25">Character Name: </FormLabel>
								<div className="flex w-full flex-col">
									<Input className="flex-1" disabled value={name} />
								</div>
							</div>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-1 flex-col gap-0.5 md:items-start">
											<FormLabel className="min-w-25">Password: </FormLabel>
											<div className="flex w-full flex-col">
												<FormControl>
													<Input
														type="password"
														{...field}
														className="flex-1"
													/>
												</FormControl>
												<FormMessage className="text-red-500" />
											</div>
										</FormItem>
									);
								}}
							/>
						</InnerContainer>
					)}
					{isSuccess && data?.scheduleDate && (
						<InnerContainer>
							<div className="max-w-lg">
								<span className="max-w-lg text-secondary text-sm">
									The character <b>{name}</b> has been scheduled for deletion.
									It will be removed permanently from your account on{" "}
									<b>{formatDate(data.scheduleDate)}</b>.
								</span>
							</div>
						</InnerContainer>
					)}
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink variant="info" to="/account">
								Back
							</ButtonImageLink>
							{!isSuccess && (
								<ButtonImage variant="red" type="submit" disabled={isSuccess}>
									Delete
								</ButtonImage>
							)}
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
