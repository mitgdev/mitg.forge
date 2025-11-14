import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

/**
 * TODO: Implement account registration functionality.
 */
export const AccountDetailsRegistration = () => {
	return (
		<Container title="Registration">
			<InnerContainer>
				<div className="flex flex-col justify-between gap-1 md:flex-row md:gap-0">
					<span className="font-bold font-verdana text-error text-sm leading-tight md:self-center">
						Your account is not registered yet.
					</span>
					<div className="self-end">
						<ButtonImageLink variant="info" to="/">
							Register Account
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
