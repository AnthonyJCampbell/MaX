# Translations

## Overview

> For detailed information on why we chose i18next,
> refer to [this Metacom article](https://metacom2.metaswitch.com/confluence/x/f0YJC).

We use [`i18next`](https://www.i18next.com/) as the framework to handle translations in our app.
We also use the following plugins: [`react-i18next`](https://react.i18next.com/)
and [`i18next-intervalPlural-postprocessor`](https://github.com/i18next/i18next-intervalPlural-postProcessor).

The high level overview of how we use `i18next` in our app:

- All strings shown in the app are defined in `src/shared/languages/<language_name>.ts`.
- The i18next library loads the strings during initialisation at runtime.
  - i18next is initialised separately for Node (in `guardian.ts`) and for React (in `index.js`).
  - See config files in `src/shared/localisation/config/` for the config we use to run i18next, including the plugins.
- Whenever the application needs to use a translated string, it calls the the `i18next.t()` function and i18next will return the string in the language it is set in.
  - The app detects the OS language and tries to load translations for that language.
## Adding new strings to the UI

To add a new string to the UI of the app (whether visual or screen reader text),
you need to (1) define the strings in the English `en.ts` file,
and (2) use `i18next.t()` function in the code where you need to display the string.

This doesn't only apply to strings that needs to be translated (e.g. tooltip text),
but also strings that are not supposed to be translated (e.g. the name of the application).
The context comment should indicate whether the string should be translated.

### Define the strings in the English resource file

First, define the string in the English resource file `src/shared/localisation/languages/en.ts` file
by adding it to the exported object as such:

```typescript
// Scenario: User is on the main screen.
// Use: In the main header panel.
// Purpose: The application greets the world.
// Max length: N/A
// Read out: false
myTranslationKey: "Hello world!",

// Scenario: User is on the main screen.
// Use: On a notification.
// Purpose: Introduces the name of the application to the user.
// Max length: N/A
// Read out: true
myTranslationKeyWithInterpolation: "Hello, my name is {{name}}.",
```

If you need to add strings that involve nesting, interpolation, or plurals,
see the [i18next documentation](https://www.i18next.com/translation-function/interpolation)
or refer to existing strings in this codebase for the syntax.

**Do not forget to add context comments** for any string you add.
For the syntax of context comments, see [this Metacom article](https://metacom2.metaswitch.com/confluence/x/B0wKAg). Every comment must contain "Scenario", "Use", "Purpose", "Read out" and "Max length". Our linter will enforce this.

You may use the "Scenario 1, Use 1, ..., Scenario 2, Use 2, ..." syntax if there are two significantly different uses for a particular string. Do consider though whether they should be two separate strings (do they definitely represent the same thing?) and in any case use it sparingly.

Do not add translation for other languages -
that will be done separately by the translations team during the release process.

### Removing strings

When removing code containing strings, check if the strings are used anywhere else. If they are no longer needed, remove them from the English translation file.

### Use i18next `t()` function in the code

If the text is displayed in a **React component**, use the `useTranslation` hooks, and use the `t()` function.

```typescript
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>t("myTranslationKey")</h1>
      <p>t("myTranslationKeyWithInterpolation", { name: "MaX" })</p>;
  </div>
  );
};
```

If the text is displayed on **node** (e.g. Mac app menu) or anywhere else outside a React component, import `i18next` and use the `t()` function from that import.

```typescript
import i18n from "i18next";

const stringToBeUsed = i18n.t("myTranslationKey");
```

## Writing automated tests

### UT

To check that a React component uses the correct string, use the `mockedT()` function as such:

```typescript
import { mockedT } from "shared/mocks/ts-utils";

expect(myComponent.text()).toBe(mockedT("myTranslationKey"));
expect(myOtherComponent.text()).toBe(mockedT("myTranslationKeyWithInterpolation", { name: "MaX" }));
```

This will also check that the correct parameters are passed into the `t()` function in the code.

### FV

FVs are run using English as the default language,
so to check for a string in the UI,
just check that it matches the English translation.

## VSCode extension

If you're going to work with translated strings,
it's recommended to have [i18n Ally](vscode:extension/Lokalise.i18n-ally) VSCode extension
and add the following configuration in your VSCode `settings.json`:

```json
"i18n-ally.namespace": true,
"i18n-ally.defaultNamespace": "common",
"i18n-ally.enabledParsers": ["ts"],
"i18n-ally.localesPaths": "src/shared/localisation/languages",
```

This extension does the following things (amongst others):

- displays the actual translated text while viewing `t()` function calls.
  If you don't like how it substitutes the key with the actual translated text,
  you can disable it by adding `"i18n-ally.annotations": false`.
- on hover, shows translations for the string in all available languages.
- highlights the code when the translation key doesn't exist in the `en.ts` file.

## Linting

We use [eslint-plugin-i1n8ext](https://github.com/edvardchen/eslint-plugin-i18next)
to check for literal/untranslated strings in the React components (everything under `src/components`).

By default this linting rule has many false positives
(i.e. legitimate use of literal strings in the code
rather than forgetting to move the strings to the translations file),
so we've added exceptions in the following places:

- in the `src/components/eslintrc.yml`
  when there's a pattern of legitimate use, e.g. allowing literal strings for logging code
- by adding individual lines of `// eslint-disable-next-line i18next/no-literal-string` in the code

We have not added this linting for the `node-server` code because
there are too many legitimate uses of literal strings
and not enough strings that needs to be translated
to justify the effort of customising/adding exceptions to the linting rule for the Node code.

## Language selection
### Selection from OS
#### 1. Best-guess on startup
On startup, the electron client tries to get the OS locale using electron's `app` APIs, and loads translations using that.

Usually, this locale will match the one used by the Java client, except for Windows users with unusual combinations of language and region settings (i.e. using a region where their display language is not usually spoken).

##### Locale construction
The electron client picks up the locale using `app.getLocale()`
- If it has a region subtag already (e.g. pt-BR), it's used as-is.
- If not (e.g. fr), which is very common due to how Chromium works, electron gets a region subtag using `app.getLocaleCountryCode()`, and appends it to the language subtag to create a locale

#### 2. Use Java's locale
Once the app has started (and the user is logged in), the electron client receives the Java client's locale over WISPA, and switches to use that if it's different (in both node and react), reloads date and time localisation, and reloads the mac menu bar. After this point, the display languages of the electron and Java UIs should always match.

### Fallback
If the exact locale isn't supported, the electron client falls back to en-US. This matches the Java client's behaviour.

i18next creates a languages list, with the specific locale from the OS first, less specific versions of the same language next, and finally the hardcoded fallback language en-US.

For example, the list for fr-CA is ["fr-CA", "fr", "en-US"]. The first language we provide translations for is used.

This means it would be easy to provide fallback translations for languages without a locale, and do a better job of trying to provide a translated client before falling back to English, for example by mapping both "fr-FR" and "fr" locales to our "fr-FR" resources.
This is *not* currently planned because it wouldn't match the Java client's behaviour, but could be considered once the client is fully refreshed.

### Gotchas
- In Indonesian, Java's locale is in-ID (for backwards compatibility), whereas electron's guess is the more modern id-ID. We map both tags to the same set of resources.
- In Cypriot Greek (el-CY) on Windows, both Java and electron report the locale as el-GR. Because we don't currently support el-GR, we map both tags to the same set of resources.
- In Angolan Portuguese (pt-AO):
  - On Windows, both electron and Java report the locale as pt-PT, and therefore fall back to en-US instead of using the pt-AO resources. For now, we keep this behaviour so that the electron and Java UIs always match.
  - On Mac, electron reports pt-BR and Java reports pt-AO, so the client will initially display pt_BR and then switch to pt-AO.

## Date and time localisation

We use the built-in javascript `Intl.DateTimeFormat()`
to display date and time strings in a format appropriate to the user's locale.

To get the user's locale for date time formatting,
we get the app language from i18n (see Language selection above)
and the OS's region two-letter ISO 3166 country code from `app.getLocaleCountryCode()`.
Combining the two, we get a language and country combination like: `fr-LU`, `en-US`.

This ensures that date and time strings are in the same language as the rest of the app,
but has some limitations:
in case there is no standard formatting for the combination of the user's OS region and the app's language,
the default region for that language will be used.
For example, if the user has their OS display language set to German and regional format set to Malaysia,
as there is no German (Malaysia) format, German (Germany) will be used.
For English, there is a large set of supported regions, but defaults to English (US).

## Spellcheck localisation

We use Chromium's spellchecker, which is built in to electron.
The spellchecker automatically detects its language from the OS (indepenently from the app's main language selection behaviour described above). The spellcheck language comes from the display language on both Windows and Mac.

Spellcheck does not support all languages, only those for which Hunspell dictionaries (Windows) or native APIs (Mac) are available.

Spellcheck caches its language when the client first starts up, which persists over restart, even if the OS language changes later. This can lead to spellcheck using a different language to the rest of the app. To work around this, delete the relevant key from the Preferences file in electron's app data.

## Phone number localisation

Not yet implemented (DUIR-3354).

## Java/Electron API Behaviour

On Windows:
- `app.getLocale()` returns a value based on the Windows display language. This will match one of the locales in the shipped locales folder, so often does not have a region subtag.
- `app.getLocaleCountryCode()` returns the region part of the "Regional Format" setting,
i.e. having the setting English (Canada) will return CA.
- Java's locale is based on the Windows display language, and is not affected by the "Regional Format" setting.

On Mac:
- `app.getLocale()` returns a value based on the display language. This will match one of the locales in the shipped locales folder, so often does not have a region subtag.
- `app.getLocaleCountryCode()` returns the region set in OS-level Preferences > Language & Region
- Java's locale is a combination of the OS display language and region. It seems to work the same way as our best-guess logic in electron, i.e.
  - Return the display language if it includes a region
  - Otherwise, return the display language plus the region