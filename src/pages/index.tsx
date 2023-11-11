import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useState } from 'react'
import { Alchemy } from 'alchemy-sdk';
import { CSVLink } from 'react-csv';
import { Data } from 'react-csv/lib/core';

const inter = Inter({ subsets: ['latin'] })


type OwnersState = {
  owners: string[];
};


export default function Home() {
  const [address, setAddress] = useState('empty');
  const [fetchedOwners, setFetchedOwners] = useState(false);
  const [owners, setOwners] = useState({ ownerAddresses: [{ ownerAddress: '', tokenBalances: [{ tokenId: '', balance: 0 }] }] });
  const [csvData, setCSVData] = useState<{
    'Owner Address': string;
    'Token ID': string;
    Balance: number;
  }[]>([]);
  const headers = [
    { label: 'Owner Address', key: 'Owner Address' },
    { label: 'Token ID', key: 'Token ID' },
    { label: 'Balance', key: 'Balance' },
  ];

  const [showDownload, setShowDownload] = useState(false)
  const { Alchemy, Network } = require("alchemy-sdk");

  const config = {
    apiKey: process.env.alchemyAPI,
    network: Network.MATIC_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const getList = async () => {
    // Get owners 

    const options = { method: 'GET', headers: { accept: 'application/json' } };
    let ownerList = { ownerAddresses: [{ ownerAddress: '', tokenBalances: [{ tokenId: '', balance: 0 }] }] }


    await fetch('https://polygon-mainnet.g.alchemy.com/nft/v2/xbf3_lEczk7H7M3lwzCrO89OmwTSn2gG/getOwnersForCollection?contractAddress=0xF8e930E79C59f973d432EaBF67c0f9618405a287&withTokenBalances=true', options)
      .then(response => response.json())
      .then(response => ownerList = response)
      .catch(err => console.error(err))


    const ownerAddressesList = ownerList.ownerAddresses.map(owner => owner.ownerAddress);
    setOwners(ownerList)


    const csvData = ownerList.ownerAddresses.flatMap(owner => (
      owner.tokenBalances.map(token => ({
        'Owner Address': owner.ownerAddress,
        'Token ID': token.tokenId,
        'Balance': token.balance,
      }))
    ));

    setCSVData(csvData)



    setFetchedOwners(true)
    
    exportToCsv()

  };

  const handleChange = (event: { target: { value: any; }; }) => {
    const value = event.target.value
    setAddress(value)
  }

  const exportToCsv = () => {
    const csvData = owners.ownerAddresses.map(owner => ({
      'Owner Address': owner.ownerAddress,
      'Token ID': owner.tokenBalances.map(token => token.tokenId).join(','),
      'Balance': owner.tokenBalances.map(token => token.balance).join(','),
    }));

    const headers = [
      { label: 'Owner Address', key: 'Owner Address' },
      { label: 'Token ID', key: 'Token ID' },
      { label: 'Balance', key: 'Balance' },
    ];
    setShowDownload(true)

  }

  if (fetchedOwners) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <div>
          Welcome to the Snapshot tool! This is available for the POLYGON chain only.
        </div>

        <div>
          Enter your contract address for the NFT project:
        </div>

        <input type='text' placeholder='0x..' onChange={handleChange} className='text-ellipsis overflow-hidden' style={{ color: 'black' }}></input>

        <div className='flex p-3'>
          <div className='pr-3'>
            <button className='rounded-full bg-blue-500 p-3 hover:bg-sky-700'
              onClick={() => getList()} style={{ color: 'white' }}>

              Get holders

            </button>
          </div>


          {showDownload &&(
            <CSVLink className='rounded-full bg-blue-500 p-3 hover:bg-sky-700' data={csvData} headers={headers} filename={'ownerList.csv'}>
              Export to CSV
            </CSVLink>
          )}
        </div>

        <div>
          {owners.ownerAddresses.map(owner => (
            <div key={owner.ownerAddress}>
              <p>Owner Address: {owner.ownerAddress}</p>
              <div>
                {owner.tokenBalances.map(token => (
                  <p key={token.tokenId}>Token ID: {token.tokenId}, Balance: {token.balance}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    )
  }


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        Welcome to the Snapshot tool! This is available for the Polygon chain only.
      </div>

      <div>
        Enter your contract address for the NFT project:
      </div>

      <input type='text' placeholder='0x..' onChange={handleChange} className='text-ellipsis overflow-hidden' style={{ color: 'black' }}></input>

      <div className='rounded-full'>
        <button className='rounded-full bg-blue-500 p-3 hover:bg-sky-700'
          onClick={() => getList()} style={{ color: 'white' }}>Get holders</button>
      </div>

    </main>
  )
}
