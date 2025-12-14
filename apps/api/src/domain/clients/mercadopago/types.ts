export type MPItem = {
	title: string;
	description?: string;
	quantity: number;
	currency_id: "BRL";
	unit_price: number;
};

export type MPCreatePreferenceInput = {
	external_reference: string;
	items: MPItem[];
	back_urls: {
		success: string;
		failure: string;
		pending: string;
	};
	notification_url: string;
	payer?: {
		email?: string;
		name?: string;
	};
};

type MPStatus =
	| "pending"
	| "approved"
	| "authorized"
	| "in_process"
	| "in_mediation"
	| "rejected"
	| "cancelled"
	| "refunded"
	| "charged_back";

export type MPCreatePixPayment = {
	x_idempotency_key: string;
	external_reference: string;
	payment_method_id: "pix";
	notification_url: string;
	status?: MPStatus;
	payer: {
		email: string;
		first_name?: string;
		last_name?: string;
	};
	installments: 1;
	transaction_amount: number;
	description?: string;
};

export type MPCreatePaymentResponse = {
	id: number;
	external_reference: string;
	date_created: string;
	date_approved: string | null;
	date_last_updated: string;
	date_of_expiration: string | null;
	operation_type:
		| "investment"
		| "regular_payment"
		| "money_transfer"
		| "recurring_payment"
		| "account_fund"
		| "payment_addition"
		| "cellphone_recharge"
		| "pos_payment"
		| "money_exchange";
	payment_type_id:
		| "ticket"
		| "bank_transfer"
		| "atm"
		| "credit_card"
		| "debit_card"
		| "prepaid_card"
		| "digital_currency"
		| "digital_wallet"
		| "voucher_card"
		| "crypto_transfer";
	status: MPStatus;
	point_of_interaction: {
		transaction_data: {
			qr_code: string | null;
			qr_code_base64: string | null;
		};
	};
};

export type MPGetPaymentResponse = MPCreatePaymentResponse;
