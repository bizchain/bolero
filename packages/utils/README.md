# Utils

Utils functions used by BizChain Labs

## Helper functions

```ts
export function isEmpty(value: any): boolean
```

```ts
//Simple way extract plaintext from HTML. Best use for not very long HTML string
export function removeHTMLTags(str: string): string
```

```ts
//Convert readable password to un-readable password to keep in the database, if someone get this, he/she cannot use
export async function passwordHash(password: string): Promise<string>
```

```ts
///Determine whether the provided `date` is less than number of provided `days`
export function isRecentlyUpdate(date: string, days: number): boolean
```

## Regex

- `REGEX_ENGLISH_NAME`
- `REGEX_ANYNAME`
- `REGEX_EMAIL` whether email is valid in format or not 
- `REGEX_EXTERNAL_URL` whether slug is an external url

## Email

```ts
//Send email via MailJet services
export async function sendMailJet(emailData: TEmailData, config: TMailJetConfig): Promise<any>
```

## React Hook

```ts
/**
 * Whether current position of scrollY has been greater than a supplied position
 * @param pos 
 * @returns 
 */
export function useScrollOver(pos: number): boolean
```

```ts
/**
 * Whether user is going down
 * @param _minY the minimum distant before starting checking. Default is 0 for to check immediately
 */
export function useScrollDown(_minY?: number): {
    isGoingDown: boolean;
    isOnTop: boolean;
}
```

