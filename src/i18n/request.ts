import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";
import { hasLocale } from "next-intl";

// Load and merge all per-feature translation files for a given locale.
// Convention: src/messages/{namespace}.{locale}.json
// Example: src/messages/auth.ar.json → messages.auth = { ... }
async function loadMessages(locale: Locale) {
    const messages: Record<string, Record<string, unknown>> = {};

    // Dynamically import all message files for this locale.
    // Add new namespaces here as your app grows.
    const namespaces = await getNamespaceFiles(locale);

    for (const [namespace, content] of Object.entries(namespaces)) {
        messages[namespace] = content;
    }

    return messages;
}

async function getNamespaceFiles(locale: Locale) {
    const result: Record<string, Record<string, unknown>> = {};

    // Auto-discover: import all known namespace files
    // To add a new namespace, simply create {name}.ar.json and {name}.en.json
    // then add the namespace string to this array:
    const knownNamespaces = ["common", "auth", "dashboard", "projects", "store", "public"];

    for (const ns of knownNamespaces) {
        try {
            const mod = await import(`../messages/${ns}.${locale}.json`);
            result[ns] = mod.default;
        } catch {
            // Namespace file doesn't exist for this locale — skip silently
            console.warn(`[i18n] Missing translation file: ${ns}.${locale}.json`);
        }
    }

    return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!hasLocale(routing.locales, locale)) {
        locale = routing.defaultLocale;
    }

    const messages = await loadMessages(locale as Locale);

    return {
        locale,
        messages,
    };
});
