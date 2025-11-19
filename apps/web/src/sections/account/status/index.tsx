import { useSession } from "@/sdk/contexts/session";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { cn } from "@/sdk/utils/cn";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

type Props = {
	premium?: boolean;
	premiumDays?: number;
	premiumExpiresAt?: Date | null;
};

export const AccountStatus = ({
	premium = false,
	premiumDays = 0,
	premiumExpiresAt,
}: Props) => {
	const { formatDate } = useTimezone();
	const { logout } = useSession();

	/**
	 * TODO - Add a alert when premium is about to expire
	 * changing the border color of the container to yellow/orange
	 * and adding a tooltip on hover to notify the user
	 *
	 * TODO - The crystal server has premium and vip in the same system as premium
	 * we when vip system is enabled we should show as vip instead of premium
	 */

	return (
		<Container title="Account Status">
			<InnerContainer>
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-row items-center gap-2">
						<img
							alt="premium-time-status"
							src={
								premium
									? "/assets/status/account-status_green.gif"
									: "/assets/status/account-status_red.gif"
							}
							className="h-[52px] w-[52px]"
						/>
						<div className="flex flex-col font-roboto text-secondary text-sm leading-tight">
							<span
								className={cn("font-bold", {
									"text-success": premium,
									"text-error": !premium,
								})}
							>
								{premium ? "Premium Account" : "Free Account"}
							</span>
							{premiumExpiresAt && (
								<span className="text-xs">
									{premium
										? `Your Premium Time expired at ${formatDate(premiumExpiresAt)}`
										: "Your premium time is expired."}
								</span>
							)}

							<span className="text-xs">
								(Balance of Premium Time: {premiumDays} days)
							</span>
						</div>
					</div>
					<div className="flex flex-row flex-wrap gap-1 md:flex-col">
						<ButtonImageLink variant="info" to="/account/details">
							Manage Account
						</ButtonImageLink>
						<ButtonImageLink variant="green" to="/">
							Get Premium
						</ButtonImageLink>
						<ButtonImage variant="red" onClick={logout}>
							Logout
						</ButtonImage>
					</div>
				</div>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-row flex-wrap justify-between gap-3">
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/premium-icon-quick-loot.png"
							className="h-8 w-8"
						/>
						<span className="font-roboto text-secondary text-sm">
							customize quick looting to your liking
						</span>
					</div>
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/premium-icon-death.png"
							className="h-8 w-8"
						/>
						<span className="font-roboto text-secondary text-sm">
							lose 30% less on death with a promotion
						</span>
					</div>
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/premium-icon-stamina.png"
							className="h-8 w-8"
						/>
						<span className="font-roboto text-secondary text-sm">
							50% XP boost for 3 hours every day
						</span>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
