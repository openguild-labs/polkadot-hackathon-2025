'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from '@/contexts/Web3Context'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'
import { Line, Pie, Bar } from 'react-chartjs-2'
import { DollarSign, LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, Users, Sun, Moon, Clock, TrendingUp, Link2 } from 'lucide-react'
import { DYNAMICNFT_CONTRACT_ADDRESS } from '@/config/addresses'
import Link from 'next/link'

// Define interfaces for our data types
interface NFT {
  id: number
  name: string
}

interface Sale {
  timestamp: string
  price: string
}

interface RoyaltyDistribution {
  name: string
  value: number
}

interface SaleOverTime {
  date: string
  price: number
}

interface DashboardData {
  averageRoyalty: number
  activeListings: number
  totalVolume: number
  volume24h: number
  volume7d: number
  vwap24h: number
  salesCount24h: number
  highPrice24h: number
  lowPrice24h: number
  recentSales: Sale[]
  royaltyDistribution: RoyaltyDistribution[]
  salesOverTime: SaleOverTime[]
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { DynamicNFTContract, RoyaltyContract, MonitorContract, account, selectedNetwork } = useWeb3()
  const [loading, setLoading] = useState(true)
  const [userNFTs, setUserNFTs] = useState<NFT[]>([])
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    averageRoyalty: 0,
    activeListings: 0,
    totalVolume: 0,
    volume24h: 0,
    volume7d: 0,
    vwap24h: 0,
    salesCount24h: 0,
    highPrice24h: 0,
    lowPrice24h: 0,
    recentSales: [],
    royaltyDistribution: [],
    salesOverTime: []
  })


  const fetchUserNFTs = async () => {
    try {
      const totalSupply = await DynamicNFTContract.methods.totalSupply().call()
      const nfts = []
      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await DynamicNFTContract.methods.tokenByIndex(i).call()
        const royaltyConfig = await RoyaltyContract.methods.getRoyaltyInfo(DYNAMICNFT_CONTRACT_ADDRESS, tokenId).call()
        if (royaltyConfig.beneficiary.toLowerCase() === account.toLowerCase()) {
          nfts.push({ id: Number(tokenId), name: `NFT #${tokenId}` })
        }
      }
      setUserNFTs(nfts)
      if (nfts.length > 0) {
        setSelectedNFT(nfts[0].id)
      }
    } catch (err) {
      console.error('Error fetching user NFTs:', err)
    }
  }

  const fetchDashboardData = async (tokenId: number) => {
    try {
      setLoading(true)
      // Fetch average royalty
      const royaltyConfigs = await RoyaltyContract.methods.getRoyaltyInfo(DYNAMICNFT_CONTRACT_ADDRESS, tokenId).call();
      const averageRoyalty = Number(royaltyConfigs.baseRate) / 100 // Convert basis points to percentage
      
      // Fetch active listings
      const totalSupply = Number(await DynamicNFTContract.methods.totalSupply().call());
      let activeListings = 0
      for (let i = 0; i < totalSupply; i++) {
        const currentTokenId = await DynamicNFTContract.methods.tokenByIndex(i).call();
        const isListed = await DynamicNFTContract.methods.isTokenListed(currentTokenId).call();
        if (isListed) activeListings++
      }

      // Fetch market metrics from MarketMonitor
      const marketMetrics = await MonitorContract.methods.getMarketMetrics(DYNAMICNFT_CONTRACT_ADDRESS, tokenId).call();
      const totalVolume = Number(marketMetrics.totalVolume) / 1e18
      const volume24h = Number(marketMetrics.volume24h) / 1e18
      const volume7d = Number(marketMetrics.volume7d) / 1e18
      const vwap24h = Number(marketMetrics.vwap24h) / 1e18
      const salesCount24h = Number(marketMetrics.salesCount24h)
      const highPrice24h = Number(marketMetrics.highPrice24h) / 1e18
      const lowPrice24h = Number(marketMetrics.lowPrice24h) / 1e18

      // Fetch recent sales and price history
      const recentSales = await MonitorContract.methods.getPriceHistory(DYNAMICNFT_CONTRACT_ADDRESS, tokenId).call();

      // Prepare data for charts
      const royaltyDistribution = [
        { name: 'Base Rate', value: Number(royaltyConfigs.baseRate) },
        { name: 'Min Rate', value: Number(royaltyConfigs.minRate) },
        { name: 'Max Rate', value: Number(royaltyConfigs.maxRate) }
      ]

      const salesOverTime = recentSales.map((sale:any) => ({
        date: new Date(Number(sale.timestamp) * 1000).toLocaleDateString(),
        price: Number(sale.price) / 1e18
      }))

      setDashboardData({
        averageRoyalty,
        activeListings,
        totalVolume,
        volume24h,
        volume7d,
        vwap24h,
        salesCount24h,
        highPrice24h,
        lowPrice24h,
        recentSales,
        royaltyDistribution : royaltyDistribution,
        salesOverTime
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    setMounted(true)
    if (account && selectedNetwork === 'SEPOLIA') {
      fetchUserNFTs()
    }
  }, [DynamicNFTContract, RoyaltyContract, account, selectedNetwork])

  useEffect(() => {
    if (selectedNFT && selectedNetwork === 'SEPOLIA') {
      fetchDashboardData(selectedNFT)
    }
  }, [selectedNFT, RoyaltyContract, MonitorContract, selectedNetwork])

  if (!mounted) return null

  if (selectedNetwork !== 'SEPOLIA') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Wrong Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Please switch to the Sepolia network to view the Analytics Dashboard.</p>
            <Button className="w-full" onClick={() => window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }]})}>
              Switch to Sepolia
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const salesChartData = {
    labels: dashboardData.salesOverTime.map((sale:any) => sale.date),
    datasets: [
      {
        label: 'Sale Price',
        data: dashboardData.salesOverTime.map((sale:any) => sale.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const volumeChartData = {
    labels: ['24h Volume', '7d Volume', 'Total Volume'],
    datasets: [
      {
        label: 'Volume (ETH)',
        data: [dashboardData.volume24h, dashboardData.volume7d, dashboardData.totalVolume],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
      }
    ]
  }

  const royaltyChartData = {
    labels: dashboardData.royaltyDistribution.map((item:any) => item.name),
    datasets: [
      {
        data: dashboardData.royaltyDistribution.map((item:any) => item.value),
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
      }
    ]
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold dark:text-white">Analytics Dashboard</h1>
          
        </div>
      </header>

      <main className="flex-1 container px-4 py-8">
        <Card className="mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Select NFT</CardTitle>
            <p className='dark:text-gray-400 text-gray-700'>
              Note: Only NFTs with configured royalty settings are displayed. To set royalty configuration for your NFTs, please visit the <Link href="/createNFT" className='text-blue-300'>CreateNFT page</Link>.
            </p>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedNFT(Number(value))} value={selectedNFT?.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an NFT" />
              </SelectTrigger>
              <SelectContent>
                {userNFTs.map((nft:any) => (
                  <SelectItem key={nft.id} value={nft.id.toString()}>{nft.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg dark:text-white">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Total Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.totalVolume.toFixed(2)} ETH</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">24h Volume</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.volume24h.toFixed(2)} ETH</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">7d Volume</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.volume7d.toFixed(2)} ETH</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Active Listings</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.activeListings}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">24h VWAP</CardTitle>
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.vwap24h.toFixed(4)} ETH</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">24h High</CardTitle>
                  <TrendingUp className="h-4 w-4  text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.highPrice24h.toFixed(4)} ETH</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">24h Low</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{dashboardData.lowPrice24h.toFixed(4)} ETH</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Sales Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={salesChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                  </div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Volume Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar data={volumeChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="dark:bg-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="dark:text-white">Royalty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Pie data={royaltyChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left dark:text-gray-200">Date</th>
                      <th className="text-left dark:text-gray-200">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentSales.slice(0, 5).map((sale:any, index) => (
                      <tr key={index}>
                        <td className="dark:text-gray-300">{new Date(Number(sale.timestamp) * 1000).toLocaleDateString()}</td>
                        <td className="dark:text-gray-300">{(Number(sale.price)/1e18).toFixed(4)} ETH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}