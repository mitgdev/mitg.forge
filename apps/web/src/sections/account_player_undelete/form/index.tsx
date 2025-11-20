import { ORPCError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { toast } from "sonner";

import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Input } from "@/ui/Input";

export const AccountPlayerUndeleteForm = ({ name }: { name: string }) => {
	const { mutateAsync, isSuccess } = useMutation(
		api.query.miforge.accounts.characters.cancelDeleteByName.mutationOptions(),
	);

	const queryClient = useQueryClient();

	const handleSubmit = useCallback(async () => {
		try {
			await mutateAsync({
				name: name,
			});

			queryClient.invalidateQueries(
				api.query.miforge.accounts.characters.list.queryOptions({
					input: {},
				}),
			);

			toast.success("Character undeleted successfully.");
		} catch (error) {
			if (error instanceof ORPCError) {
				return toast.error(`${error.message}`);
			}

			toast.error("An unexpected error occurred. Please try again.");
		}
	}, [name, mutateAsync, queryClient]);

	return (
		<Container title={"Delete Character"}>
			{!isSuccess && (
				<InnerContainer className="p-1 md:p-2">
					<div className="mb-1 flex flex-1 flex-col gap-0.5 md:items-start">
						<span className="min-w-25 font-semibold text-secondary text-sm">
							Character Name:{" "}
						</span>
						<div className="flex w-full flex-col">
							<Input className="flex-1" disabled value={name} />
						</div>
					</div>
				</InnerContainer>
			)}
			{isSuccess && (
				<InnerContainer>
					<div className="max-w-lg">
						<span className="max-w-lg text-secondary text-sm">
							You have successfully undeleted the character.
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
						<ButtonImage
							variant="green"
							type="button"
							disabled={isSuccess}
							onClick={handleSubmit}
						>
							Undelete
						</ButtonImage>
					)}
				</div>
			</InnerContainer>
		</Container>
	);
};
