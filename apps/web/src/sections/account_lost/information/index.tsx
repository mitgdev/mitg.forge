export const AccountLostInformation = () => {
	return (
		<div className="flex flex-col gap-2 text-secondary">
			<h2 className="font-bold font-verdana text-lg">
				Welcome to the Lost Account Interface!
			</h2>
			<span className="text-sm leading-tight">
				If you have lost access to your account, this interface can help you. Of
				course, you need to prove that your claim to the account is justified.
				Enter the requested data and follow the instructions carefully. Please
				understand there is no way to get access to your lost account if the
				interface cannot help you. Further options to change account data are
				available if you have a registered account.
			</span>
			<span className="hidden text-sm leading-tight md:block">
				By using the Lost Account Interface you can
			</span>
			<ul className="ml-5 hidden list-inside list-disc text-sm leading-tight md:block">
				<li>get a new password if you have lost the current password,</li>
				<li>get your account back if it has been hacked,</li>
				<li>
					change the email address of your account instantly (only possible with
					a valid recovery key),
				</li>
				<li>
					request a new recovery key (only available to registered accounts),
				</li>
				<li>
					remove an authenticator app from your account (only possible with a
					valid recovery key),
				</li>
				<li>
					disable email code authentication for your account (only available to
					accounts with a valid recovery key)
				</li>
			</ul>

			<span className="text-sm leading-tight">
				As a first step to use the Lost Account Interface, please enter the
				email address of your account and click on "Submit".
			</span>
		</div>
	);
};
