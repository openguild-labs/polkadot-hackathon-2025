import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import getWhitelistContract from "../utils/whitelistContract";
import { Box, Button, Heading, Text, Spinner, Alert, AlertIcon, VStack } from "@chakra-ui/react";

let accountAddress = "";

const fetchAccountAddress = async () => {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    accountAddress = accounts[0];
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
};

function LoginPage() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [role, setRole] = useState(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const checkNetwork = async () => {
  const targetChainId = "0x61"; // =97
  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== targetChainId) {
      setError("Bạn đang kết nối với mạng không đúng. Vui lòng chuyển sang Binance Smart Chain Testnet.");
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainId,
              chainName: "Binance Smart Chain Testnet",
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.bscscan.com"],
            },
          ],
        });
      } catch (addError) {
        console.error("Lỗi khi thêm mạng:", addError);
        return false;
      }
    }
    return chainId === targetChainId;
  } catch (err) {
    console.error("Lỗi khi kiểm tra mạng:", err);
    setError("Không thể kiểm tra mạng. Vui lòng thử lại.");
    return false;
  }
};


  // Hàm kết nối MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setCurrentAccount(account);
        await checkUserRole(account);
        accountAddress = account;
      } catch (err) {
        console.error("Lỗi khi kết nối MetaMask:", err);
        setError("Không thể kết nối với MetaMask.");
      }
    } else {
      setError("Vui lòng cài đặt MetaMask để tiếp tục.");
    }
  };

  // Hàm kiểm tra vai trò từ hợp đồng thông minh
  const checkUserRole = async (account) => {
    setIsCheckingRole(true);
    setError("");
    try {
      const whitelistContract = await getWhitelistContract();
      if (!whitelistContract) {
        throw new Error("Whitelist contract không được tải.");
      }

      const [isAdmin, isVoter] = await Promise.all([
        whitelistContract.isAdmin(account),
        whitelistContract.isVoter(account),
      ]);

      if (isAdmin) {
        setRole("admin");
      } else if (isVoter) {
        setRole("voter");
        navigate("/voter");
      } else {
        setRole(null); // Không có quyền
        setError("Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.");
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra vai trò:", err);
      setError("Không thể kiểm tra vai trò. Vui lòng thử lại.");
    } finally {
      setIsCheckingRole(false);
    }
  };

  // Xử lý thay đổi tài khoản và mạng
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        checkUserRole(accounts[0]);
      } else {
        setCurrentAccount(null);
        setRole(null);
        setError("Bạn đã ngắt kết nối ví.");
      }
    };

    const handleChainChanged = (_chainId) => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    // Xóa thông tin đăng nhập mỗi khi tải lại trang
    setCurrentAccount(null);
    setRole(null);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1" display="flex" alignItems="center" justifyContent="center" p={8} bg="gray.100">
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" width="400px" textAlign="center">
          <Heading mb={6} color="teal.500">
            Trang Đăng Nhập
          </Heading>
          <VStack spacing={4}>
            {error && (
              <Alert status="error" width="100%">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {!currentAccount ? (
              <Button colorScheme="teal" onClick={connectWallet} width="100%">
                Kết Nối Ví MetaMask
              </Button>
            ) : isCheckingRole ? (
              <Spinner size="xl" color="teal.500" />
            ) : role === "admin" ? (
              <Box>
                <Text mb={4} fontSize="md">
                  Địa chỉ ví: {currentAccount}
                </Text>
                <Button colorScheme="teal" onClick={() => navigate("/admin")} width="100%" mb={2}>
                  Đi tới Trang Admin
                </Button>
                <Button colorScheme="teal" onClick={() => navigate("/voter")} width="100%">
                  Đi tới Trang Voter
                </Button>
              </Box>
            ) : null /* Không hiển thị gì nếu không có quyền */}
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default LoginPage;
export { accountAddress };