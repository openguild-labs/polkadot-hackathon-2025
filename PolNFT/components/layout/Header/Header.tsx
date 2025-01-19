'use client';
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import Link from 'next/link';
import Notifications from './Notifications';
import Image from 'next/image';
import { Typography } from "antd";
import '@rainbow-me/rainbowkit/styles.css';
import {
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import ArrowDownIcon from '@/components/common/icons/ArrowDownIcon';


const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link href={'/my-rentals'} className='hover:!text-text-hover font-bold'>Rentals</Link>,
    key: 'rentals',

  },
  {
    label: <Link href={'/my-listings/assets'} className='hover:!text-text-hover font-bold'>Listings</Link>,
    key: 'listings',
  },
  {
    label: <Link href={'/activity'} className='hover:!text-text-hover font-bold'>Activity</Link>,
    key: 'activity',
  }
];

export default function Header() {
  const [currentPage, setCurrentPage] = useState('');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentPage(e.key);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/50 backdrop-blur-md border-b border-gray-600 shadow-lg">
      <nav className="relative mx-auto flex h-20 max-w-[1760px] items-center gap-5 px-[12vw]">
        <Link href='/'><Text strong className='text-4xl pr-8 text-primary'>PolFT</Text></Link>
        <SearchBar placeholder='Search NFTs, games, authors, ...' />
        <Menu onClick={onClick} selectedKeys={[currentPage]} mode="horizontal" items={items} className='flex-1' />
        <div className="flex gap-4 items-center h-9">
          <ConnectWallet />
          {/* <ConnectButton /> */}
          <Notifications />
          <Button className="px-0 h-full">
            <Image
              src="https://image-cdn.lootrush.com/unsafe/311x0/smart/filters:format(webp)/https%3A%2F%2Faxiecdn.axieinfinity.com%2Faxies%2F11782174%2Faxie%2Faxie-full-transparent.png"
              alt="profile"
              width={48}
              height={36}
            // className='w-full h-full'
            />
          </Button>
        </div>
      </nav>
    </header>
  );
}

function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <Button type='primary' className='h-full' onClick={openConnectModal}><Text strong>Connect Wallet</Text></Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button className='h-full' onClick={openChainModal}><Text strong>Wrong chain</Text></Button>
                );
              }
              return (
                <>
                  <Button onClick={openChainModal} className='h-full'>
                    {chain.iconUrl &&
                      <Image
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        width={28}
                        height={28}
                      />
                    }
                    <ArrowDownIcon />
                  </Button>
                  <Button onClick={openAccountModal} className='h-full'>
                    <Text strong>{account.displayName}</Text>
                    <ArrowDownIcon />
                  </Button>
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
