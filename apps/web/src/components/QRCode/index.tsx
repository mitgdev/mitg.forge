import { forwardRef } from "react";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";

type QRCodeProps = { value: string; size?: number; logo: string };

export const QRCode = forwardRef<QRCodeLogo, QRCodeProps>(
	({ value, size = 200, logo }, ref) => {
		const logoSize = size / 4;

		return (
			<QRCodeLogo
				ref={ref}
				value={value}
				size={size}
				logoWidth={logoSize}
				logoHeight={logoSize}
				ecLevel="H"
				removeQrCodeBehindLogo
				logoImage={logo}
				style={{
					height: "auto",
					maxWidth: "100%",
					width: `${size}px`,
				}}
			/>
		);
	},
);
