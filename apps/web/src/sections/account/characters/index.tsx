import { Link } from "@tanstack/react-router";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountCharacters = () => {
	return (
		<Container title="Characters">
			<InnerContainer className="flex justify-center p-0">
				<span className="font-bold text-secondary">Regular Characters</span>
			</InnerContainer>
			<InnerContainer className="p-0">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="border border-septenary p-1 text-start font-bold text-secondary" />
							<th className="border border-septenary p-1 text-start font-bold text-secondary">
								Name
							</th>
							<th className="border border-septenary p-1 text-start font-bold text-secondary">
								Status
							</th>
							<th className="border border-septenary p-1 text-start font-bold text-secondary">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="border border-septenary p-1 text-center">
								<span className="font-bold text-secondary">1.</span>
							</td>
							<td className="border border-septenary p-1 text-secondary">
								<div className="flex flex-row flex-wrap items-center gap-1">
									<div className="relative hidden h-16 w-16 md:block">
										<img
											alt="character-avatar"
											src="https://outfit-images.ots.me/latest_walk/animoutfit.php?id=130&addons=3&head=0&body=114&legs=94&feet=94"
											className="absolute right-3 bottom-3"
										/>
									</div>
									<div className="flex flex-col">
										<span className="font-bold text-lg text-secondary">
											Kamity
										</span>
										<span className="text-secondary text-xs">
											Royal Paladin - Level 897 - on Ferumbra
										</span>
									</div>
								</div>
							</td>
							<td className="border border-septenary p-1 text-secondary">
								Online
							</td>
							<td className="border border-septenary p-1">
								<div className="flex flex-col items-center">
									<span className="text-secondary text-sm">
										[
										<Link to="/" className="font-bold text-blue-900 underline">
											Edit
										</Link>
										]
									</span>
									<span className="text-secondary text-sm">
										[
										<Link to="/" className="font-bold text-blue-900 underline">
											Delete
										</Link>
										]
									</span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</InnerContainer>
			<div className="flex w-full justify-end">
				<ButtonLink variant="info" to="/">
					Create Character
				</ButtonLink>
			</div>
		</Container>
	);
};
