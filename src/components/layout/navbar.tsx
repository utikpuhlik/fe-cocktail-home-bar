import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
	{ href: "/", label: "Seasonal" },
	{ href: "/database", label: "Database" },
	{ href: "/rating", label: "Rating" },
	{ href: "/longs", label: "Long Drinks" },
	{ href: "/shorts", label: "Short Drinks" },
	{ href: "/shots", label: "Shots" },
];

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center gap-2 font-bold">
					Cocktail Home Bar
				</Link>
				<nav className="hidden items-center gap-4 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
