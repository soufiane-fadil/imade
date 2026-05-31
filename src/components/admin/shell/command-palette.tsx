"use client";

import Link from "next/link";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Tags,
  Newspaper,
  PenLine,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  type LucideIcon,
} from "lucide-react";

type NavEntry = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV: NavEntry[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/auteurs", label: "Auteurs", icon: PenLine },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

const ACTIONS = [
  { href: "/admin/articles/new", label: "Nouvel article" },
  { href: "/admin/categories/new", label: "Nouvelle catégorie" },
  { href: "/admin/auteurs/new", label: "Nouvel auteur" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const close = () => onOpenChange(false);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Palette de commandes"
      description="Recherchez et naviguez dans l'admin"
    >
      <CommandInput placeholder="Rechercher ou naviguer…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.href} value={item.label} asChild>
                <Link href={item.href} onClick={close}>
                  <Icon className="mr-2 size-4" />
                  {item.label}
                </Link>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {ACTIONS.map((a) => (
            <CommandItem key={a.href} value={a.label} asChild>
              <Link href={a.href} onClick={close}>
                <Plus className="mr-2 size-4" />
                {a.label}
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
