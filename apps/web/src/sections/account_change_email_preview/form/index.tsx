import { ORPCError } from "@orpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Countdown } from "@/components/Countdown";
import { List } from "@/components/List";
import { useSession } from "@/sdk/contexts/session";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountChangeEmailPreviewForm = () => {
	const [redirecting, setRedirecting] = useState<Date | null>(null);
	const param = useParams({
		from: "/_auth/account/email/change/$token/preview/",
	});
	const { session } = useSession();
	const navigate = useNavigate();

	const { data } = useQuery(
		api.query.miforge.accounts.email.previewChange.queryOptions({
			input: {
				token: param.token,
			},
		}),
	);

	const {
		mutateAsync: confirmChangeEmail,
		isPending: isPendingConfirmChangeEmail,
		isSuccess: isSuccessConfirmChangeEmail,
	} = useMutation(
		api.query.miforge.accounts.email.confirmEmail.mutationOptions(),
	);

	const handleSubmit = useCallback(async () => {
		try {
			const { newEmail } = await confirmChangeEmail({
				token: param.token,
			});

			toast.success(
				"Email changed successfully. You need to login again. All your sessions have been revoked.",
			);

			// Wait for 5 seconds to let the user read the toast
			const date = new Date();
			date.setSeconds(date.getSeconds() + 5);
			setRedirecting(date);
			await new Promise((resolve) => setTimeout(resolve, 5000));

			navigate({
				to: "/account/$email/confirm",
				params: {
					email: newEmail,
				},
				replace: true,
				reloadDocument: true,
			});
		} catch (error) {
			if (error instanceof ORPCError) {
				return toast.error(`${error.message}`);
			}

			toast.error("An unexpected error occurred. Please try again.");
		}
	}, [navigate, param.token, confirmChangeEmail]);

	if (!data) {
		return (
			<Container title="Preview Email Change">
				<InnerContainer>Loading...</InnerContainer>
			</Container>
		);
	}

	return (
		<Container title="Preview Email Change">
			<InnerContainer className="p-0">
				<List>
					<List.Item title="Current Email">
						<span className="text-secondary">{session?.email}</span>
					</List.Item>
					<List.Item title="New Email">
						<span className="text-secondary">{data.newEmail}</span>
					</List.Item>
					<List.Item title="Expires In">
						<Countdown targetDate={data.expiresAt} />
					</List.Item>
				</List>
			</InnerContainer>
			{redirecting && (
				<InnerContainer>
					<p className="text-center text-secondary">
						You are being redirected to confirm your new email address. Please
						wait <Countdown targetDate={redirecting} />.
					</p>
				</InnerContainer>
			)}
			<InnerContainer>
				<div className="flex flex-row flex-wrap items-end justify-end gap-2">
					<ButtonImage
						variant="info"
						type="submit"
						disabled={
							isPendingConfirmChangeEmail || isSuccessConfirmChangeEmail
						}
						onClick={handleSubmit}
					>
						Change Email
					</ButtonImage>
				</div>
			</InnerContainer>
		</Container>
	);
};
