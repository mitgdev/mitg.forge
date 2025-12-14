import { ORPCError } from "@orpc/client";
import { ShopProvider, ShopProviderMethod } from "generated/client";
import { inject, injectable } from "tsyringe";
import type {
	ShopProvidersRepository,
	ShopServicesRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { centsToFloat } from "@/shared/utils/money";
import type { MercadoPagoService } from "../mercadoPago";

@injectable()
export class ShopService {
	constructor(
		@inject(TOKENS.ShopServicesRepository)
		private readonly shopServicesRepository: ShopServicesRepository,
		@inject(TOKENS.ShopProvidersRepository)
		private readonly shopProvidersRepository: ShopProvidersRepository,
		@inject(TOKENS.MercadoPagoService)
		private readonly mercadoPagoService: MercadoPagoService,
	) {}

	async getAllServices() {
		const services = await this.shopServicesRepository.listAll();

		return services.map((service) => ({
			...service,
			unit_price: centsToFloat(service.unit_price),
		}));
	}

	async getAllProviders() {
		const providers = await this.shopProvidersRepository.findAll();

		return providers;
	}

	async createOrder(data: { serviceId: number; providerId: number }) {
		const service = await this.shopServicesRepository.findById(data.serviceId);
		const provider = await this.shopProvidersRepository.findById(
			data.providerId,
		);

		if (!service || !provider) {
			throw new ORPCError("NOT_FOUND", {
				message: "Service or Provider not found",
			});
		}

		const paymentMethod = provider.method;
		const paymentProvider = provider.provider;

		if (paymentProvider === ShopProvider.MERCADO_PAGO) {
			switch (paymentMethod) {
				case ShopProviderMethod.PIX:
					return this.mercadoPagoService.createPixPayment(
						service.id,
						paymentMethod,
					);
				default:
					throw new ORPCError("NOT_IMPLEMENTED", {
						message: `Payment method ${paymentMethod} not implemented for provider ${paymentProvider}`,
					});
			}
		}

		throw new ORPCError("NOT_IMPLEMENTED", {
			message: `Payment provider ${paymentProvider} not implemented`,
		});
	}
}
