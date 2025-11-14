import { useQuery } from "@tanstack/react-query";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountDetailsBadges = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	if (!data) {
		return null;
	}

	return (
		<Container title="Account Badges">
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Account Badges
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							The following account badges are displayed if other players search
							for your character.
						</span>
					</div>
					<ButtonImageLink variant="info" to="/">
						Edit
					</ButtonImageLink>
				</div>
			</InnerContainer>
			<InnerContainer>
				<span className="font-verdana text-secondary text-sm leading-tight">
					You have not unlocked any badges yet. Click on "Edit" to see the
					requirements for unlocking the single badges.
				</span>
			</InnerContainer>
		</Container>
	);
};
