"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth-client";
import { UserIcon, SettingsIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

function displayName(user: { name?: string | null; email?: string | null }) {
	if (user.name?.trim()) return user.name;
	const local = user.email?.split("@")[0];
	return local?.trim() ? local : "User";
}

function initials(user: { name?: string | null; email?: string | null }) {
	const base = displayName(user);
	return base.slice(0, 1).toUpperCase();
}

export function NavUser() {
	const { data: session, isPending } = useSession();
	const user = session?.user;

	if (isPending) {
		return <Skeleton className="size-8 shrink-0 rounded-full" aria-hidden />;
	}

	if (!user) {
		return null;
	}

	const name = displayName(user);
	const letter = initials(user);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					aria-label="Account menu"
				>
					<Avatar className="size-8">
						{user.image ? <AvatarImage src={user.image} alt="" /> : null}
						<AvatarFallback>{letter}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuLabel className="flex cursor-default select-none items-center gap-3 px-3 py-2.5 text-sm font-normal text-foreground">
					<Avatar className="size-10 shrink-0">
						{user.image ? <AvatarImage src={user.image} alt="" /> : null}
						<AvatarFallback>{letter}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1 space-y-0.5">
						<p className="truncate font-medium leading-none">{name}</p>
						<p className="truncate text-xs text-muted-foreground leading-snug">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon
						/>
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<SettingsIcon
						/>
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<CreditCardIcon
						/>
						Plan & Billing
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						variant="destructive"
						onSelect={() => {
							signOut({
								fetchOptions: {
									onSuccess: () => {
										window.location.href = "/login";
									},
								},
							});
						}}
					>
						<LogOutIcon
						/>
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
