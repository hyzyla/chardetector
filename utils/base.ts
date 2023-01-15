// Decode string to URL safe base64 string
export function base64UrlDecode(str: string): string {
    return Buffer.from(str, 'base64').toString('utf8').replace(/_/g, '/').replace(/-/g, '+').replace(/=/g, '');
}

export function base64UrlEncode(str: string): string {
    return Buffer.from(str).toString('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}