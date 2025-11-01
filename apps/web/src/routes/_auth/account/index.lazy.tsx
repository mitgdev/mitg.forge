import { createLazyFileRoute } from "@tanstack/react-router";
import { useSession } from "@/sdk/contexts/session";
import { Container } from "@/ui/Container";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";

export const Route = createLazyFileRoute("/_auth/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	const session = useSession();

	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Welcome, Teste</h1>
			</SectionHeader>
			<InnerSection>
				<Container innerContainer title="Teste">
					<span className="break-all">
						{JSON.stringify(session.session, null, 2)}
					</span>
				</Container>
			</InnerSection>
		</Section>
	);
}
