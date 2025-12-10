import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useConfig } from "@/sdk/contexts/config";
import { api } from "@/sdk/lib/api/factory";
import { withORPCErrorHandling } from "@/sdk/utils/orpc";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/ui/Dialog";

export const AccountDetailsDiscordOauth = () => {
	const { config } = useConfig();
	const queryClient = useQueryClient();
	const [confirmUnlinkDialogOpen, setConfirmUnlinkDialogOpen] = useState(false);
	const { data: details } = useQuery(
		api.query.miforge.accounts.details.queryOptions(),
	);

	const { mutateAsync: unlinkDiscord, isPending: unlinkDiscordLoading } =
		useMutation(
			api.query.miforge.accounts.oauth.discord.unlink.mutationOptions(),
		);

	const { mutateAsync: linkDiscord } = useMutation(
		api.query.miforge.accounts.oauth.discord.link.mutationOptions(),
	);

	const isDiscordConnected = details?.oauths.discord ?? false;

	const handleUnlink = useCallback(() => {
		withORPCErrorHandling(
			async () => {
				await unlinkDiscord({});
			},
			{
				onSuccess: () => {
					setConfirmUnlinkDialogOpen(false);

					queryClient.invalidateQueries({
						queryKey: api.query.miforge.accounts.details.queryKey(),
					});

					toast.success("Discord account unlinked successfully.");
				},
			},
		);
	}, [unlinkDiscord, queryClient]);

	const handleLink = useCallback(() => {
		withORPCErrorHandling(
			async () => {
				return await linkDiscord({});
			},
			{
				onSuccess: (data) => {
					const location = data.headers.Location;

					if (location) {
						window.location.href = location;
					}
				},
			},
		);
	}, [linkDiscord]);

	if (!config.discord.enabled) {
		return null;
	}

	return (
		<Container title="Discord OAuth">
			{isDiscordConnected && (
				<Dialog
					open={confirmUnlinkDialogOpen}
					onOpenChange={setConfirmUnlinkDialogOpen}
				>
					<DialogContent title="Confirm Unlink Discord Account">
						<DialogHeader className="hidden">
							<DialogTitle>Confirm Unlink Discord Account</DialogTitle>
							<DialogDescription>
								This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<InnerContainer className="text-secondary">
							Are you sure you want to unlink your Discord account?
						</InnerContainer>
						<InnerContainer className="mb-0">
							<div className="flex flex-row justify-end gap-1">
								<ButtonImage
									variant="info"
									disabled={unlinkDiscordLoading}
									loading={unlinkDiscordLoading}
									onClick={() => setConfirmUnlinkDialogOpen(false)}
								>
									Close
								</ButtonImage>
								<ButtonImage
									type="button"
									variant="green"
									disabled={unlinkDiscordLoading}
									loading={unlinkDiscordLoading}
									onClick={handleUnlink}
								>
									Confirm
								</ButtonImage>
							</div>
						</InnerContainer>
					</DialogContent>
				</Dialog>
			)}

			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-3">
					<div className="flex flex-col gap-2">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							{isDiscordConnected ? (
								<>
									Your account is{" "}
									<span className="font-bold text-success">connected</span> to
									Discord.
								</>
							) : (
								<>Connect your account to Discord!</>
							)}
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							{isDiscordConnected && (
								<>
									If you do not want to use Discord any longer, you can "Unlink"
									your Discord account. Note, however, that linking your Discord
									account is an important feature which helps to prevent any
									unauthorized access to your account.
								</>
							)}
							{!isDiscordConnected && (
								<>
									As a first step to connect Discord to your account, click on
									"Activate"! Then authorize the connection in the Discord
									window that pops up.
								</>
							)}
						</span>
					</div>
					<div>
						{isDiscordConnected ? (
							<ButtonImage
								variant="red"
								onClick={() => setConfirmUnlinkDialogOpen(true)}
							>
								Unlink
							</ButtonImage>
						) : (
							<ButtonImage variant="green" onClick={handleLink}>
								Link
							</ButtonImage>
						)}
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
