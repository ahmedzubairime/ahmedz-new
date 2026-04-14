import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface SidebarIconProps {
    name: string;
    className?: string;
}

/**
 * Convert kebab-case icon names to PascalCase for lucide-react
 * Examples:
 *   "chevron-down" -> "ChevronDown"
 *   "layout-grid" -> "LayoutGrid"
 *   "bar-chart-2" -> "BarChart2"
 *   "trash-2" -> "Trash2"
 */
function toPascalCase(str: string): string {
    return str
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

export function SidebarIcon({ name, className = "size-4" }: SidebarIconProps) {
    const pascalCaseName = toPascalCase(name);

    // Try to get the icon component from lucide-react
    const Icon = (LucideIcons as any)[pascalCaseName] as ((props: LucideProps) => React.ReactElement) | undefined;

    if (!Icon) {
        // Fallback to a default icon if not found
        console.warn(`Icon "${name}" (PascalCase: "${pascalCaseName}") not found in lucide-react. Using "Circle" as fallback.`);
        const FallbackIcon = LucideIcons.Circle;
        return <FallbackIcon className={className} />;
    }

    return <Icon className={className} />;
}
