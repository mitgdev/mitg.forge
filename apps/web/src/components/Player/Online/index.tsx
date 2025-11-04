export const PlayerIsOnline = ({ online = false }: { online?: boolean }) => {
	return (
		<div>
			{online ? (
				<img alt="online" src="/assets/icons/global/on.gif" />
			) : (
				<img alt="offline" src="/assets/icons/global/off.gif" />
			)}
		</div>
	);
};
