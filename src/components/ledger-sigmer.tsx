import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// @ts-ignore
import FilecoinApp from '@zondax/ledger-filecoin';
import { VerifyAPI } from '@keyko-io/filecoin-verifier-tools';
// import cbor from 'cbor';

interface AddressItem {
  index: number;
  address: string;
}

const LedgerFilecoinSigner: React.FC = () => {
  const [transport, setTransport] = useState<any>(null);
  const [filecoinApp, setFilecoinApp] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');

  // For address selection dialog
  const [showDialog, setShowDialog] = useState(false);
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const addressesPerPage = 5; // Number of addresses per page

  // Keep track of the selected address index
  const [addressIndex, setAddressIndex] = useState<number | null>(null);

  const connectLedger = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const filecoinApp = new FilecoinApp(transport);
      setTransport(transport);
      setFilecoinApp(filecoinApp);
      setShowDialog(true); // Show the dialog to select an address
    } catch (error) {
      console.error('Connection Error:', error);
    }
  };

  const fetchAddresses = async (startIndex: number, count: number) => {
    if (!filecoinApp) return;
    const addresses: AddressItem[] = [];
    for (let i = startIndex; i < startIndex + count; i++) {
      const path = `m/44'/461'/${i}'/0/0`;
      const resp = await filecoinApp.getAddressAndPubKey(path);
      if (resp.return_code === 0x9000) {
        addresses.push({ index: i, address: resp.addrString });
      } else {
        console.error(`Error fetching address at index ${i}: ${resp.error_message}`);
      }
    }
    return addresses;
  };

  const loadAddresses = async () => {
    const startIndex = currentPage * addressesPerPage;
    const addresses = await fetchAddresses(startIndex, addressesPerPage);
    setAddressList(addresses || []);
  };

  useEffect(() => {
    if (showDialog) {
      loadAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog, currentPage]);

  const selectAddress = (selectedAddress: AddressItem) => {
    setAddress(selectedAddress.address);
    setAddressIndex(selectedAddress.index);
    setConnected(true);
    setShowDialog(false);
  };

  const proposeAddVerifier = async (datacap: number) => {
    if (!filecoinApp || !transport || addressIndex === null) {
      console.error('Ledger not connected or address not selected');
      return;
    }

    //const messageId = await this.context.wallet.api.proposeVerifier(
    //  address,
    //  BigInt(datacap),
    //  this.context.wallet.walletIndex
    //);
  };

  const signTransaction = async () => {
    try {
      if (!filecoinApp || !transport || addressIndex === null) {
        console.error('Ledger not connected or address not selected');
        return;
      }

      const path = `m/44'/461'/${addressIndex}'/0/0`;

      // Create the message object
      const message = {
        To: toAddress,
        From: address,
        Nonce: 0,
        Value: amount,
        GasLimit: 0,
        GasFeeCap: '0',
        GasPremium: '0',
        Method: 0,
        Params: ''
      };

      // Serialize the message using CBOR encoding
      //const serializedMessage = cbor.encode(message);
      //
      //const resp = await filecoinApp.sign(path, serializedMessage);
      //
      //if (resp.return_code === 0x9000) {
      //  setSignature(resp.signature.toString('hex'));
      //} else {
      //  console.error(`Signing Error: ${resp.error_message}`);
      //}
    } catch (error) {
      console.error('Signing Error:', error);
    }
  };

  return (
    <div className="p-4">
      {!connected ? (
        <Button onClick={connectLedger}>Connect Ledger</Button>
      ) : (
        <div>
          <p>Connected Address: {address}</p>
          <Input
            placeholder="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="my-2"
          />
          <Input
            placeholder="Amount (attoFIL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="my-2"
          />
          <Button onClick={signTransaction}>Sign Transaction</Button>
          {signature && (
            <div className="mt-4">
              <p>Signature:</p>
              <textarea
                readOnly
                value={signature}
                className="w-full h-32 p-2 border rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* Address Selection Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an Address</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {addressList.length > 0 ? (
              <>
                {addressList.map((item) => (
                  <div key={item.index} className="flex items-center justify-between my-2">
                    <div>
                      <p className="font-mono text-sm">{item.address}</p>
                      <p className="text-xs text-gray-500">Index: {item.index}</p>
                    </div>
                    <Button onClick={() => selectAddress(item)}>Select</Button>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p>Loading addresses...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LedgerFilecoinSigner;