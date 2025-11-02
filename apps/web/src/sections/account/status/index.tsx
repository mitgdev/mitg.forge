import { useSession } from "@/sdk/contexts/session";
import { Button } from "@/ui/Buttons/Button";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountStatus = () => {
	const { logout } = useSession();
	return (
		<Container title="Account Status">
			<InnerContainer>
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-row items-center gap-2">
						<img
							alt="premium-time-status"
							src="/assets/status/account-status_red.gif"
							className="h-[52px] w-[52px]"
						/>
						<div className="flex flex-col font-roboto text-secondary text-sm leading-tight">
							<span className="text-error">Free Account</span>
							<span className="text-xs">
								Your VIP Time expired at Dec 31, 1969, 21:00:00 BRA.
							</span>
							<span className="text-xs">(Balance of Premium Time: 0 days)</span>
						</div>
					</div>
					<div className="flex flex-row flex-wrap gap-1 md:flex-col">
						<ButtonLink variant="info" to="/">
							Manage Account
						</ButtonLink>
						<ButtonLink variant="green" to="/">
							Get Premium
						</ButtonLink>
						<Button variant="red" onClick={logout}>
							Logout
						</Button>
					</div>
				</div>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-row flex-wrap justify-around gap-3">
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/citizen_doll.gif"
							className="h-8 w-8"
						/>
						<span className="font-roboto text-secondary text-sm">
							customise quick looting to your liking
						</span>
					</div>
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/armillary_sphere.gif"
							className="h-8 w-8"
						/>
						<span className="font-roboto text-secondary text-sm">
							lose 30% less on death with a promotion
						</span>
					</div>
					<div className="flex w-full flex-row items-center gap-1 md:w-auto">
						<img
							alt="something"
							src="/assets/icons/32/goromaphone.gif"
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
