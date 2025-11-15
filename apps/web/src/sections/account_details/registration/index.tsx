import { useQuery } from "@tanstack/react-query";
import { List } from "@/components/List";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountDetailsRegistration = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	const registration = data?.registration;

	return (
		<Container title="Registration">
			{!registration && (
				<InnerContainer>
					<div className="flex flex-col justify-between gap-1 md:flex-row md:gap-0">
						<span className="font-bold font-verdana text-error text-sm leading-tight md:self-center">
							Your account is not registered yet.
						</span>
						<div className="self-end">
							<ButtonImageLink variant="info" to="/account/registration">
								Register Account
							</ButtonImageLink>
						</div>
					</div>
				</InnerContainer>
			)}
			{registration && (
				<>
					<InnerContainer className="p-0">
						<List zebra labelCol="180px" className="leading-tight">
							<List.Item title="First Name">
								<span className="font-verdana text-secondary text-sm">
									{registration.firstName}
								</span>
							</List.Item>
							<List.Item title="Last Name">
								<span className="font-verdana text-secondary text-sm">
									{registration.lastName}
								</span>
							</List.Item>
							<List.Item title="Street">
								<span className="font-verdana text-secondary text-sm">
									{registration.street}
								</span>
							</List.Item>
							<List.Item title="Number">
								<span className="font-verdana text-secondary text-sm">
									{registration.number}
								</span>
							</List.Item>
							<List.Item title="Postal Code">
								<span className="font-verdana text-secondary text-sm">
									{registration.postal}
								</span>
							</List.Item>
							<List.Item title="City">
								<span className="font-verdana text-secondary text-sm">
									{registration.city}
								</span>
							</List.Item>
							<List.Item title="Country">
								<span className="font-verdana text-secondary text-sm">
									{registration.country}
								</span>
							</List.Item>
							<List.Item title="State">
								<span className="font-verdana text-secondary text-sm">
									{registration.state}
								</span>
							</List.Item>
						</List>
					</InnerContainer>
					<InnerContainer className="flex justify-end gap-3">
						<ButtonImageLink to="/account/registration" variant="info">
							Edit
						</ButtonImageLink>
					</InnerContainer>
				</>
			)}
		</Container>
	);
};
