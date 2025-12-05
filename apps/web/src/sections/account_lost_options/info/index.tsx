import { Link, useParams } from "@tanstack/react-router";

export const AccountLostOptionsInfo = () => {
	const { email } = useParams({
		from: "/_not_auth/account/lost/$email",
	});

	return (
		<div className="flex flex-col gap-2 text-secondary">
			<h2 className="text-center font-bold font-verdana text-lg">
				Email: {email}
			</h2>
			<span className="mt-5 text-sm leading-tight">
				The Lost Account Interface can help you to solve all problems listed
				below. Please select your problem and click on "Submit".
			</span>
			<span className="text-sm leading-tight">
				If your problem is not listed here, you might be able to find the answer
				on our website. Answers to the most common questions about Tibia can be
				found in the{" "}
				<Link className="font-bold text-blue-800" to="/">
					FAQ
				</Link>
				. You can also consult the{" "}
				<Link className="font-bold text-blue-800" to="/">
					manual
				</Link>
				. If you have questions concerning the security of your account, please
				take a look at the{" "}
				<Link className="font-bold text-blue-800" to="/">
					security hints
				</Link>
				.
			</span>
		</div>
	);
};
