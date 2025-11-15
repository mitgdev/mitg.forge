import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "@/sdk/lib/api/factory";

export const AccountRegistrationInformation = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	const hasRegistration = !!data?.registration;

	if (hasRegistration) {
		return (
			<span className="text-secondary text-sm">
				Use this interface to edit incorrect registration data, such as your
				postal address after moving elsewhere. Note that the changes will only
				be finalized after a waiting period of 30 days has passed.
			</span>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<span className="text-secondary text-sm">
				Account registration offers important advantages:
			</span>
			<ul className="ml-5 text-secondary text-sm">
				<li className="list-disc">
					If a new recovery key is needed, registered users can request one for
					a small fee.
				</li>
			</ul>
			<span className="text-secondary text-sm">
				<strong>NOTE:</strong> The data given in the registration will be used
				exclusively for sending recovery letters and compiling internal
				statistical surveys. It will be treated in a strictly confidential
				manner. For details please see the{" "}
				<Link to="/" className="font-bold text-blue-800 hover:underline">
					Privacy Policy
				</Link>
			</span>
			<span className="text-secondary text-sm">
				Please enter correct and complete data to make sure we can provide you
				with the best possible support. Above all, give your full address to
				make sure that our postal recovery letters will reach you. Note that all
				data entered in the registration can be re-edited later on.
			</span>
		</div>
	);
};
