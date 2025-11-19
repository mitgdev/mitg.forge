import { zodResolver } from "@hookform/resolvers/zod";
import { ORPCError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { List } from "@/components/List";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Checkbox } from "@/ui/Checkbox";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/Form";
import { Label } from "@/ui/Label";
import { Textarea } from "@/ui/Textarea";

const FormSchema = z.object({
	hideInformation: z.boolean(),
	comment: z
		.string()
		.max(2000)
		.refine((val) => val.split("\n").length <= 50, {
			message: "Comment cannot exceed 50 lines",
		})
		.optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export const AccountPlayerEditForm = ({ name }: { name: string }) => {
	const queryClient = useQueryClient();
	const { data: player } = useQuery(
		api.query.miforge.accounts.characters.findByName.queryOptions({
			input: {
				name: name,
			},
		}),
	);

	const { mutateAsync } = useMutation(
		api.query.miforge.accounts.characters.editByName.mutationOptions(),
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			hideInformation: player?.ishidden || false,
			comment: player?.comment || "",
		},
	});

	const comment = form.watch("comment");
	const commentLength = comment ? comment.length : 0;
	const commentLineCount = comment ? comment.split("\n").length : 0;

	const handleSubmit = useCallback(
		async (data: FormValues) => {
			try {
				await mutateAsync({
					name: name,
					isHidden: data.hideInformation,
					comment: data.comment,
				});

				queryClient.invalidateQueries(
					api.query.miforge.accounts.characters.findByName.queryOptions({
						input: {
							name: name,
						},
					}),
				);

				toast.success("Character information updated successfully.");
			} catch (error) {
				if (error instanceof ORPCError) {
					return toast.error(`${error.message}`);
				}

				toast.error("An unexpected error occurred. Please try again.");
			}
		},
		[mutateAsync, name, queryClient],
	);

	return (
		<Container title="Edit Character Information">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<InnerContainer className="p-0">
						<List>
							<List.Item title="Name" borderless>
								<span className="text-secondary text-sm">{name}</span>
							</List.Item>
							<List.Item title="Hide Information" borderless>
								<span className="text-secondary text-sm">
									<FormField
										control={form.control}
										name="hideInformation"
										render={({ field: { value, onChange } }) => {
											return (
												<FormItem className="flex flex-col items-start gap-2">
													<FormControl>
														<Label
															htmlFor="hideInformation"
															className="flex flex-row items-center gap-2"
														>
															<Checkbox
																checked={value || false}
																onCheckedChange={(checked) => onChange(checked)}
																id="hideInformation"
															/>
															<div>check to hide your account information</div>
														</Label>
													</FormControl>
													<FormMessage className="text-red-500" />
												</FormItem>
											);
										}}
									/>
								</span>
							</List.Item>
						</List>
					</InnerContainer>
					<InnerContainer>
						<List>
							<List.Item title="Comment" borderless>
								<FormField
									control={form.control}
									name="comment"
									render={({ field: { onChange, value, ...field } }) => {
										return (
											<FormItem className="flex flex-1 flex-col gap-0.5">
												<div className="flex w-full flex-col">
													<FormControl>
														<Textarea
															{...field}
															value={value}
															onChange={(event) => {
																onChange(event.target.value);
															}}
														/>
														<span className="text-secondary text-sm">
															[max. length: {commentLength}/2000 chars,{" "}
															{commentLineCount}/50 lines (ENTERs)]
														</span>
													</FormControl>
													<FormMessage className="text-red-500" />
												</div>
											</FormItem>
										);
									}}
								/>
							</List.Item>
						</List>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink variant="info" to="/account" hash="registration">
								Back
							</ButtonImageLink>
							<ButtonImage variant="info" type="submit">
								Update
							</ButtonImage>
						</div>
					</InnerContainer>
				</form>
			</Form>
		</Container>
	);
};
