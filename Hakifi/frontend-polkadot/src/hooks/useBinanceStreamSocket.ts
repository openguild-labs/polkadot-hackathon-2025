'use client';

import { useEffect, useRef, useState } from 'react';
import BinanceFutureSocketStream from '@/socket/binanceFutureSocketStream';

const useBinanceStreamSocket = (
  stream: string | string[],
  callback: (data: any) => void,
) => {
  const streams = Array.isArray(stream) ? stream : [stream];

  const wsStream = useRef(BinanceFutureSocketStream.getInstance());

  const [isConnected, setIsConnected] = useState(wsStream.current.isConnected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };
    wsStream.current.on('connect', onConnect);
    wsStream.current.on('disconnect', onDisconnect);
    return () => {
      wsStream.current.off('connect', onConnect);
      wsStream.current.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    wsStream.current.subscribe(streams, callback);
    return () => {
      wsStream.current.unsubscribe(streams, callback);
    };
  }, [streams.join(','), callback, isConnected]);
};

export default useBinanceStreamSocket;
