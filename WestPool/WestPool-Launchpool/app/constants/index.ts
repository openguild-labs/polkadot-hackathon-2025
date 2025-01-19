import { time } from "console";
import { chainConfig } from "../config";
import { readFileSync } from "fs";

// ----------------------------Navbar----------------------------------
export const navItems = [
  // { label: "My Project", path: "/myProject" },
  { label: "My Staking", path: "/launchpool/myStaking" },
  { label: "Launchpool", path: "/launchpool/allproject" },
  { label: "Pre-market", path: "/preMarket/preMarket" },
  { label: "Dashboard", path: "/preMarket/dashboard" },
];

// -----------------------All_Project_Page -----------------------------
export const banners = [
  {
    id: "item1",
    src: "https://i.pinimg.com/736x/ad/26/0e/ad260e82393f75e8e463138070ca74fc.jpg",
    alt: "Image 1",
    width: 2000,
    height: 2000,
  },
  {
    id: "item2",
    src: "https://i.pinimg.com/736x/f8/a1/d6/f8a1d68246266f3ed11e00932dc1da88.jpg",
    alt: "Image 2",
    width: 2000,
    height: 2000,
  },
  {
    id: "item3",
    src: "https://i.pinimg.com/736x/2b/ca/2d/2bca2d8037abbd18e651933c45238487.jpg",
    alt: "Image 3",
    width: 2000,
    height: 2000,
  },
  {
    id: "item4",
    src: "https://i.pinimg.com/736x/c8/6f/d4/c86fd4b88b7ad89e688455c23ca1b71e.jpg",
    alt: "Image 4",
    width: 2000,
    height: 2000,
  },
];

// -----------------------All_Project_Page & MyStaking & MyProject -----------------------------
export const dataTable = [
  {
    title: "Project's Name",
    short_description: "Short Description",
    image:
      "https://i.pinimg.com/736x/ad/8e/9b/ad8e9b5cf76fb9b020d7f7ee301f4553.jpg",
    earned: "0",
    token: "BNB",
    totalStaked: "692,182 BNB",
    apr: "3,13%",
    endsIn: "--",
  },
  {
    title: "Project's Name",
    short_description: "Short Description",
    image:
      "https://i.pinimg.com/736x/87/11/f0/8711f0d6248f89d0163d5a65157614cf.jpg",
    earned: "15",
    token: "ETH",
    totalStaked: "500,000 ETH",
    apr: "2,50%",
    endsIn: "60 days",
  },
  {
    title: "Project's Name",
    short_description: "Short Description",
    image:
      "https://i.pinimg.com/736x/7e/37/f9/7e37f9865d9f07683bfeb7cb5276c35d.jpg",
    earned: "30",
    token: "USDT",
    totalStaked: "1,000,000 USDT",
    apr: "4,75%",
    endsIn: "90 days",
  },
  {
    title: "Project's Name",
    short_description: "Short Description",
    image:
      "https://i.pinimg.com/736x/87/11/f0/8711f0d6248f89d0163d5a65157614cf.jpg",
    earned: "30",
    token: "USDT",
    totalStaked: "1,000,000 USDT",
    apr: "4,75%",
    endsIn: "90 days",
  },
  {
    title: "Project's Name",
    short_description: "Short Description",
    image:
      "https://i.pinimg.com/736x/09/64/7b/09647b05eb441d9f223d021c4a3074f9.jpg",
    earned: "30",
    token: "USDT",
    totalStaked: "1,000,000 USDT",
    apr: "4,75%",
    endsIn: "90 days",
  },
];

export const availableTokens = [
  {
    id: "1",
    name: "BNB",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVQl3k2_pnTREpCeAXPyB5wxktuUPXjmBoQ&s",
    address: "FJO9KDHGKL3KDJ9834JD8F9J34KD9F9",
  },
  {
    id: "2",
    name: "ETH",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022",
    address: "FJH9QDHGKL3KDJ9834JD8F9J34KD9F9",
  },
  {
    id: "3",
    name: "USDT",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGcttVBhyCMnl1e_iNaaK7Z6GRz5WZTlDc3g&s",
    address: "FJH9KDHGKL3KDJ9834HD8F9J34KD9F9",
  },
  {
    id: "4",
    name: "BTC",
    image:
      "data:image/jpeg;base64,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",
    address: "LJH9KDHGKL3KDJ9834JD8F9J34KD9F9",
  },
  {
    id: "5",
    name: "ADA",
    image:
      "data:image/png;base64,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",
    address: "FJH9KaHGKL3KDJ9834JD8F9J34KD9F9",
  },
  {
    id: "6",
    name: "DOT",
    image:
      "data:image/png;base64,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",
    address: "FJH9KDHGKL3KDJ9834JD8F9J54KD9F9",
  },
  {
    id: "7",
    name: "DOGE",
    image:
      "data:image/jpeg;base64,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",
    address: "FJH9KDHGKL3KDJ9834JD8F9J34KD9k9",
  },
  {
    id: "8",
    name: "SOL",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=013",
    address: "FJH9KDHGKL3KDJ9834JD8F9J34KD9F9",
  },
  {
    id: "9",
    name: "LTC",
    image: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=013",
    address: "LTC1QDHGKSLJ34J8E93JDKF03JF34",
  },
  {
    id: "10",
    name: "UNI",
    image: "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=013",
    address: "0xAeF123D8cDEF5678abc123456789Ef9",
  },
  {
    id: "11",
    name: "LINK",
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=013",
    address: "0x12345678ABCDEFEF9876543210FBA",
  },
  {
    id: "12",
    name: "BCH",
    image: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png?v=013",
    address: "qrdtf8dfjkl8dkfj39fjw9f03fj38",
  },
  {
    id: "13",
    name: "XRP",
    image: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=013",
    address: "rHBcF123456789ABCDEFE987654321",
  },
];

export const availableNetworks = [
  {
    id: "1",
    name: "Ethereum",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022",
  },

  {
    id: "2",
    name: "Moonbeam",
    image:
      "https://altcoinsbox.com/wp-content/uploads/2023/04/moonbeam-logo.png",
  },
  {
    id: "3",
    name: "Astar",
    image: "https://altcoinsbox.com/wp-content/uploads/2023/03/astar-logo.png",
  },
  {
    id: "4",
    name: "Polkadot",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////mAHrmAHjkAG3kAGzkAG/lAHXlAHP//f797/X62uf75e7++PvmAHv+9fn/+/374uzoNYn3w9jtbaT4zN751uX2u9P86vLwirTudqnpRI/ymr74y9398fbrV5jnGH/sYp7zpcT0r8vqTZPxkrnvga/2v9XynsDpOYrueqvoKITqSZL1tc/sZ6DtcKXwhrKggIhKAAALg0lEQVR4nO1da3siLQ+uMICH2qrVWrU6nqrWnv7/v3v17W5Xh1PCMIB9vL/tde1QIhBIcie5uQmBu8Hj9ulhNt7n7Vo7349nn0+LTfM2yN+uHLfP6xlhTHBOSO0PCCGcC0Zr80m/HnuC5TBYdynjP5JJIJzR8aQZe5quaH7VTNKdSJmvW7En64DlnnGrdH/B6e4x9oRxqE+4sK/e2Uqy2iL2rBHYCoES7xuCLGNPHIh+7iLfEWx/EUrnkzrKdwDJnmJP34pWDtcvKojuXWwRzHhmOAWjWEbeiS2ECY9ZSfmOYIPYYujR8yFgrUaT1TfNEjrmDKIRWxQNamXP4F+QbmxR1Pgsp0VPISaxhVGh6ecQfoNNY4ujwMzXHj2Cv8QWR8bQ5xIeFjE9y3jr7xQeIdKzplY+N+lhm77GFkiC3yVM8MK4ZX4lrPHYEhXR8C0hiy1REXe+JRSxJZLgWUKyjy2QhLFnXfoQWyAJa8/3YXpeqabfbZol6Mzoen2XzmOLo0DP5yJmUZw1reVoTGgmup9LpW3j8d3GR6o/0Fg87EXG2m8v7xU4AYbrnInvOAvhgs4Vv/HU3yIShWUxmNGTCXS3fg/qYJadq0qeKQy4jS8DKlO4oh6ysy1CBH3wt5M7K4UXVHTvpf848bOK2bs0ckPhaObZh5/NWh9lygPGc1nEJx8iZvJVOFXHITldexCwx3VXOR/L/3tSfqNmCts31ykxkZf2rY4MPlCh+AV7Jd36nCs83gYvHsnKLWNjbwyUZYrgdKNbZqeylYKgMTB6mtmqhEtnYAnkql8eW0R4uzCe+jVqeS3x9tBVQHucRbWIB73wQV22Kqevsu46oG/bFMQ1lrOwaw2uCWh2ivcnQL7sU7MUH/ah6LOLgFtQnEX3deuVIbgKhIkn3d1Wh5zrrIcXcAESkOmVdX05zkBCHt5gM4N3FPaiz9Cr+A672ISRIjJdzpiZNMQFEx/vRoLbE2y/Z8iz2Afe3HZnw2Ay50daGzkX9C+xbWGd2BtwszMUr6oFvdNgDqNGf/E039XYP7THH0/LPsg8AE+FILiO922wkkC5Ne+nw2FrOJwqLwUN4DYZ38FHXcFVPavan4Lw/wil3azCGvHuwu1+B1jv+9PJyGaXEgOMfWC4LvwA5f5hMIMRMWIA8ssGQ5KDRaxwhIPq1xBFA4RQHPo4Ugyr2u2HOYcHULud0UYNWGPOlgsQA5yEROF4OMcayQ2lmLvNBeDHxx/Y9Ck60Fl5mO8eSyWzBI8BttgZCOId4QisoanyHv1DB+sqCxDmg768f2B8ZqF5Tbx6AtoL2ltg4FPh6ZPMwbZGYonmxVP9Is7RDiRaPcMOH3rlX7qxWngGbF65gDc3+NwGprvC0Ds+DDcLT3rU+VZATq3CUCH4dQv8Imq2Fv5Im860P3TwvzzrK0faoXcDeQsg4M1NjpZQfU076BmzL9EbgP7EUygJuBP8OAHuiiMcqDpKBbHHb9JVEAGdpjaXRxniNykLxVR20KYKL6eDJg1GcnWg5zI5jjHHX/fhcgXxySqKySWrZ47ooI+Q7HXDX6tBGaBoI1F+m77jbZSQOfRIj1tN4cj9QtuZ84ACOlCQpdcI+gGvJilUBjPjRAHJ7EG6STX8yAqBXQLpzYz9iSqPqhXRwjrJ2uffD5EnWWwDC4i3z+n558jHLQnhvSigjpSwsMuQ2hhLfPCCDW6OhdjtM+rrSKlzM1zc7zwqhpOwrZlCxbhFvUrKSKiiYQdBD6PxCxKi+ADxUslfEatYiGwiHt48lGWvAiIxh50TiOC8HJLHzLK+QzB9Cp+Cl7/ysLYZYCqMZCBC3+6Z2tcaDtACMfyz8CHQelIke4TGFnagJOsJRj2iKVQcg6WtSESfe8hnNPx7W4UvkIjSZwBfW5bCCh4BoBYqoqT2V40qXScS7GkEKheExXXunNRQCTaWjA4yU3xkXkS+T6t2U6dmPFXqLFvTSWTF2yU66jPDigg1V+FeW8mKi03g+UOw1OZXafn1LXVmHaEPaVb8nc40E65p3WQtIv8qhO1SUjHneN4rZOS5IaByW8z45XTslDQVDJtuYa8S+mH+orf/SeMhnPGXZAv8/WAwEidTpmO7adBcv3HKGMvnk3S35zn661n7MGNKVhMoKbs+TbDwhgV30/QKoF1xxRVXXHHFFVdcccV/HbfTFKtNmzEF2xaD9Vgc7cP27JLsw2PBBsoh9uHm3MZ/vQAb/5MhbHzZT8N21WenlcFjsSWR2U/TUVQuI6yb7mbF+tq0/tKPNP2lDay/tG7weacTdvqHBdrnbYxbWJyQ4eEQt7DEnvK4HIwiXGJP1vhhbBbGKR4t/C9V/BAQA47Pw/iLrUsM+JLi+AA2hpwzA+NipNH+5cWJiwHk06RAN4GRTSQ+DZQTFb9UOrCUr8SJAvPaYocTgcUAZV4bnJsYt2WoMzcR3p6CtKuuuWPCFE4SLlTOuRSOMCIjmJ6bCyiet48S024YufO8cVz9WAbjpgRXH5dvoa08Wy3C5VuET837RqmcGWzdtxj79BGZ93R+Dn9/7ho6/zD8Gxybf1jMt0DnkIZ2ipfNIcXnAYcmnGJ7vEhlSVLP5UYn5EtV21LPx0cXQJKsp0d8TYWQDYs81FTAFtE8LGJIFyq+q5tcR8mhtkk49j6+3KGiKCe2rmfQ+jQPPiaXco2hO4cKT7L/2qFOVLB4zdZLnSiH3ncJ1/pSqsHfX6/NZZteVs09l7qJ1uLZXoB9M2tfzb+/9qVDw9sLq1/qUoM2hMPGXw1aF10TwpvhsEm1/C98ZcE0a0Hrn5O/pJ63qUrX76jJri3nfZNmXX20aciMDC6smQJr7FIKfnsj4Hv6ojpaueAWqxuIZcAJ8lxrC7z7ArpHifURom3bqhnw4vrMJNcrCBn3A/QKuhnhYlhJdbSqMRDhB2WspCUhsO1NM62+axgJgX3XUA3Ek+qdR8HG3KX2P4QXrKzDrwzUjX/bGLY6rWEDQ4yvpoclPCQM60M6fF68zLv8pA8p2c2/Fn3QqQFPpYbKKPDXS7Y/mSl7yRIuDoLOt1ZdDH15Y98ewNJ2Zn9iY2HrB0wO0s+XxrMMjGzi6SFLkIiGy+J+uaOgns5EZCsDhbyqns6gxuM1PTuqM0L15RbiS7fJKuvLDVpFnUekOaP43uofmqsV0lvdMVPCXtRWTVdozC3V1HQyjpTa0HrnE+H8sGoatYSOrTBBr9/PeExJI7dExUql89x1ja/CTDH00PyJBWyl0Ktmg46tylXeeTGMrvKIbNQJc2BwrtD6Bu8RyUp7+54VFc7+TEZhTk+wzjoZquQj7StS5D5sm5dMOT7PZRcNLNnDJqL8imioFQKnngjZnZlCN4qdLCCmZblJRHkVG7m8kw73iz++y2Cenf+KPFM4lqFFjO0iqs7i+U4ign76NU0bk/3x+fz/wbmgqtsZ3UtYD65Qj4MZPZlAd1GBYTpcvo7bR8Nn9K4cHd+xSC+hMkrdWDx0OWXt1ct7lGKqqEb2NqgrrEYGno9jQGBuJwgOpBcTsvTKGq5dH6NqiPiJjkXgGaBGBO3qBoPfTQp0cYUEPIERCGH/m2Hh8br/RuWhVywcGmmaEYyeC4ZfVRqCIIAFnptlRKSmWSZsPd+H6VXEGfoynb6RnKK58bxNpaylFIDmU5kQvIEkCDiKgxEREjhBaPvapwleFd/Ad17WQCRbtbHn5yhWzu8ogY0PEZNq2SOhX9Kpf3SkpeiiOcFQ4brFQOySvCfOMHIKHv5ZwCxe3RQE+rlrfI11E9+hP1gIFxlFLZ2Sd1bUJxzBUziCsHYq9e6gWBab+JjE43ScnrVkR/OpbaYL/RWP5eu4BcRKoDkZU5OUnDP2tr0U9aLB/fNkXqNMcP6P2kbI4V+C0fZ8m1LJ0DK4bfYW69F83M3zdp7v3uaj9aLXDFP47X+OobgBlWOmMwAAAABJRU5ErkJggg==",
  },

  {
    id: "5",
    name: "Bifrost",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAM1BMVEUAAAD///8gICDf39+AgIAQEBBgYGDv7++/v7+fn5+Pj48wMDBAQEBvb29QUFDPz8+vr6/5O2bhAAAG8klEQVR4nOWdCYKrIAyGEXdc6v1P++zYVq0CCSQsff8Bpn6TEEKAIAoWlY9eTc04SFmLP9VSjmMzqaVreX5RUP/BclHN8Pr6e9XDXNHjkIJ0apYmhKPkrDrK3yYDeajRaIdb24zqQfX7NCDdBLbExTINjWEIQLoJbQoGFl+QtvKkeLFMZVSQbqSg2DT2sUCIjLFL9h5mcQYhx/hDaZxRHEFYMP7kiuIEwofhjuIAwouxSlZBQBbnuQ+Bgo9gWJCSMOCaNGP9CwnC7VUHIf0LBdIF8KpdEmUUDMgUEuMpjFHgIOUQmgNlFDCICjc6DqoVMUgb3K3emoCLYhhIDLd6C+heIJAuilt9SEDLLgiIionxFCR6AUCq2BwgEitI28SmeKrxBmkjDvOjBlvwsoDEDFdnDZbgZQYpgyZXZlnCsBEkJQ4biQkkLQ4LiQEklXG+yzTiDSDJcRhJ9CBJzB/f0s8nWpAE5vM7aed4HUiiHELoFigakC729+qlyYXvQVILvEfV90H4FqRNmEMXum5Boq1rYZqgINEXUjbdDfgbkDLqwhaiu2FyA5L0ANk0QECSnUGOug6TC0gZ+xthuswmF5AMHOspaQPJwrGe+k66vkAycSxxjVxfIHPs74NrNIH0sb8Oo8UAkslI3yRbLUg2I31TpQNJOXm/U91qQJJcpZtU3YPkE3rfOprkAJKdQU4mERkb5GQSkbNBjib5gOQWsjbtJvmAZDWp76ouIFkaZDXJN0imBtlXWG+QQMewzpKVRojAM55BosRe/cYNJoK2J5AYJTk9B8rPqxNIhKGu58DNBPURJELx3bAhiJyauwNI+FndwIENoNMBJLhnGTjQKUa9gwT3LNNGM947ug9IaM8ycTjMzNMHJLBnmThcclf5BnnQf6vxd00HGJyc4/ECCbuxY+RwS/nUCyRonmXkcFwUjS+QkDtU5iM+jlGn3kBCBl8zh/NaovsDCThEzBzuq231BxKuAm85BOc+nc1/IMFmEQuHxyJVPkFaui+1/JqZw6uMU64goca67Yy7V560rCCB9hJsHH7VD7WChBnrNg7P+mCzggQ5umi9O+GZgA8rSIh53crhW1arCxEiaFk5/AvPpQgQtOx3cvxXdg+xEHypWXYOgnptL9gzLTsHxY6GEtw1RsBdL4qSwSSYCw8ADpKNgEbwLg8BHDRbZSMvCOQOIY1LDIIziYdwEO0wSU4QCAfVHqwUfBkK6G4qVaxhTLRAHBlsXYI4Mtjch915Tv+0BYwjfceCcaTvWMC79LSOxdGTCcZB6lg1w4QI5KB1LIaZHdoChNaxpKAuokA5iCMWefYL5aCOWCPxwgrcWoZ6Kmxol7pgDvKpcCItPoA56KdCJQj/N/CWRfQ51iLoNtnhHAw5VifIzs7BOThyrJasiI1ohcWQvNdk2woIDo7k/bmtQPL/QXCwJO/zCkIRfzF971hWhdUKQlCOx3DwrAq7FcQ/bGE4mFaFLcWBAVQ/RZ5yg6Q4woHiYCo3zASHalAcXOUG5X/MCdenk6uO1XkfPMNxcNWxXgfPPI4C4jjY6ljvo4DOgwTHwVcgfR/OdM3kkRx8BdL3cVnHmQTJwVcg/RxgdrsGg+RgrLw3HxCXAIzlYKy874f8HQIwloOx8r415NhA0L6F5eDc0mkOIFjfQnNwbukcryYhfQvNwbml82r18gJBndBEc7DuFU4nEMw5OjwH615heQLB5FuN7mKqVpx7hV9XXFNuA2hW/wUS9BIJoT5dnT4gmTV3eau/gLRZmmQPPHvziixNsjdp3UGyNEl5A5KjSQ5dcw8gGZqkvAXJzyTHNsZHkNxMcsqVfrJRWOLtcb91btV47kHHf3WBUL0BJE6fFzfNhQkk/Ra5H5kbTuYz3i0tQLPp6mRtyprLCuuy3L42Lk68s/ema0P/m1bSCT4O8a2LY/12c++fabee/DABN8BP8C2YoyT8SYKkh4mm0Pnjz3YkPOB1T8L8/NM2iV4bcnhsKMnQdfM4hB0kQRLHB7mSuwPl+kRaaiTuj9alReLzjODvPOyYzoj3fWqzSGQ+aazvHf8/z9GmQAJ5SRv2ZHPU4FWTPdkcNwzbwhUK5GeeNS9+5qH5Io57Ad0KBxIhet2WSwhAAhsF9sC8E0hIo9SQ1+XdQYoyUMPQEXu6DQtSFH0A/5KL/Tu8QVb/YkapK+Dc4QtSlJwZsROGIwgjiiOGM8gThcHBnDE8QFYU6mHvgeEFsqonPGAwouY/YpDVLBOJWbyMQQKyqvMdLfXkZwwqkMKLRVJQFFQgqx5qRK9Y6lE9qH6fDOSpTs1gy8hZ0ZjiJVKQp9qumgejbeqhUQv6xoNN5CCb2m5RUzOOUr6YaimHsZlU/yBH2PQPZ49ADhEYnEgAAAAASUVORK5CYII=",
  },
];

// --------------------------------------premarket----------------------------------------
export const tokenTable = [
  {
    id: 1,
    icon: "https://i.pinimg.com/736x/2e/99/73/2e9973b4ca3af5f314dfab0a6c23b352.jpg",
    name: "Token's name",
    price: "$0.99",
    change1h: "-1.11%",
    change1d: "+2.00%",
    marketCap: "$2.7B",
    volume: "$1.0B",
  },
  {
    id: 2,
    icon: "https://i.pinimg.com/736x/c2/6b/8c/c26b8c12fa9490fa1bdd38a4224e31a9.jpg",
    name: "AlphaToken",
    price: "$1.45",
    change1h: "+3.20%",
    change1d: "+5.12%",
    marketCap: "$3.5B",
    volume: "$2.2B",
  },
  {
    id: 3,
    icon: "https://i.pinimg.com/736x/e4/29/e6/e429e66ab46e2c9d94f4921f70682ac1.jpg",
    name: "BetaCoin",
    price: "$0.75",
    change1h: "-0.85%",
    change1d: "-1.50%",
    marketCap: "$1.8B",
    volume: "$0.9B",
  },
  {
    id: 4,
    icon: "https://i.pinimg.com/736x/4d/31/69/4d3169b7cbee7bec7176cd6e69be11bd.jpg",
    name: "GammaToken",
    price: "$2.10",
    change1h: "+0.45%",
    change1d: "+4.75%",
    marketCap: "$4.2B",
    volume: "$3.1B",
  },
  {
    id: 5,
    icon: "https://i.pinimg.com/736x/eb/bb/8a/ebbb8ad82d36f91ea2d839c4e59f589c.jpg",
    name: "DeltaCoin",
    price: "$0.58",
    change1h: "-2.34%",
    change1d: "-3.67%",
    marketCap: "$1.2B",
    volume: "$0.6B",
  },
];

// --------------------------------------Dashboard----------------------------------------
[];
export const buyTable = [
  {
    icon: "https://i.pinimg.com/736x/eb/bb/8a/ebbb8ad82d36f91ea2d839c4e59f589c.jpg",
    offerid: "1",
    time: "a day ago",
    deposit: "0.5",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 3024,
    tx: "0xdsf7458990340567343647034968",
    status: "Completed",
  },
  {
    icon: "https://i.pinimg.com/736x/42/cb/8e/42cb8e5a763748d9052fe520930f2c2b.jpg",
    offerid: "2",
    time: "2 hours ago",
    deposit: "1.2",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 1500,
    tx: "0xabc1234567890987654321",
    status: "Completed",
  },
  {
    icon: "https://i.pinimg.com/736x/d5/f1/b0/d5f1b06d7527c80857248d35c1662695.jpg",
    offerid: "3",
    time: "3 days ago",
    deposit: "2.0",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 1200,
    tx: "0x9876abcdef1234567890",
    status: "CancelledWithdraw",
  },
  {
    icon: "https://i.pinimg.com/736x/c5/9a/22/c59a22c38c4a0e189136f57b4644e7d1.jpg",
    offerid: "4",
    time: "5 minutes ago",
    deposit: "0.3",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 2500,
    tx: "0xfedcba09876543210",
    status: "Pending",
  },
  {
    icon: "https://i.pinimg.com/736x/39/e9/bd/39e9bd24557a1287fd1d55a1ce3eefc9.jpg",
    offerid: "5",
    time: "8 hours ago",
    deposit: "3.5",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 5000,
    tx: "0x1234567890abcdef9876",
    status: "Cancelled",
  },
  {
    icon: "https://i.pinimg.com/736x/39/e9/bd/39e9bd24557a1287fd1d55a1ce3eefc9.jpg",
    offerid: "6",
    time: "6 days ago",
    deposit: "0.8",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 4000,
    tx: "0xabcdef1234567890fedc",
    status: "Open",
  },
];

export const sellTable = [
  {
    icon: "https://i.pinimg.com/736x/eb/bb/8a/ebbb8ad82d36f91ea2d839c4e59f589c.jpg",
    offerid: "1",
    time: "a day ago",
    deposit: "0.5",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 3024,
    tx: "0xdsf7458990340567343647034968",
    status: "Pending",
  },
  {
    icon: "https://i.pinimg.com/736x/42/cb/8e/42cb8e5a763748d9052fe520930f2c2b.jpg",
    offerid: "2",
    time: "2 hours ago",
    deposit: "1.2",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 1500,
    tx: "0xabc1234567890987654321",
    status: "Settled",
  },
  {
    icon: "https://i.pinimg.com/736x/d5/f1/b0/d5f1b06d7527c80857248d35c1662695.jpg",
    offerid: "3",
    time: "3 days ago",
    deposit: "2.0",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 1200,
    tx: "0x9876abcdef1234567890",
    status: "Settled",
  },
  {
    icon: "https://i.pinimg.com/736x/c5/9a/22/c59a22c38c4a0e189136f57b4644e7d1.jpg",
    offerid: "4",
    time: "5 minutes ago",
    deposit: "0.3",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 2500,
    tx: "0xfedcba09876543210",
    status: "Cancelled",
  },
  {
    icon: "https://i.pinimg.com/736x/39/e9/bd/39e9bd24557a1287fd1d55a1ce3eefc9.jpg",
    offerid: "5",
    time: "8 hours ago",
    deposit: "3.5",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 5000,
    tx: "0x1234567890abcdef9876",
    status: "CancelledWithdraw",
  },
  {
    icon: "https://i.pinimg.com/736x/39/e9/bd/39e9bd24557a1287fd1d55a1ce3eefc9.jpg",
    offerid: "6",
    time: "6 days ago",
    deposit: "0.8",
    deposit_icon:
      "https://i.pinimg.com/736x/1b/9f/c2/1b9fc2f3a48868013b251accf905c205.jpg",
    for: 4000,
    tx: "0xabcdef1234567890fedc",
    status: "Open",
  },
];

// ------------------------------------- Add Project- Project Detail ----------------------------------------
export const availablePool = [
  {
    id: "1",
    name: "BNB",
  },
  {
    id: "2",
    name: "ETH",
  },
  // {
  //   id: "3",
  //   name: "USDT",
  // },
  // {
  //   id: "4",
  //   name: "BTC",
  // },
  // {
  //   id: "5",
  //   name: "ADA",
  // },
];

