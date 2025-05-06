/**
 * Fetches the full JSON for a Filecoin multisig address from Filfox.
 * Uses the built-in fetch in Node 18+ (no extra deps).
 */
export async function getMultisigInfo(address: string): Promise<any> {
    const url = `https://filfox.info/api/v1/address/${address}`;
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Filfox API returned ${res.status} for ${address}`);
    }
    return res.json();
  }