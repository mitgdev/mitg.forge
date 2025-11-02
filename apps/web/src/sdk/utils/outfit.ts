export const makeOutfit = ({
	id,
	addons,
	head,
	body,
	legs,
	feet,
}: {
	id: number;
	addons: number;
	head: number;
	body: number;
	legs: number;
	feet: number;
}) => {
	const url = new URL(
		"https://outfit-images.ots.me/latest_walk/animoutfit.php",
	);

	const params = new URLSearchParams();
	params.set("id", String(id));
	params.set("addons", String(addons));
	params.set("head", String(head));
	params.set("body", String(body));
	params.set("legs", String(legs));
	params.set("feet", String(feet));
	url.search = params.toString();

	/**
	 * https://outfit-images.ots.me/latest_walk/animoutfit.php?id=130&addons=3&head=0&body=114&legs=94&feet=94
	 */
	return url.toString();
};
